import models from "../models/Entries";
import usersModel from "../models/User";
import reportModel from "../models/Report";
import roleModel from '../models/Role'
import * as format from '../services/utc.format'
import moment from 'moment';
import jwt from "jsonwebtoken";
import config from '../config'
import { io } from "../app";
import db, { sequelize } from '../../models'
import { Op } from "sequelize";


export const genNewToken = async (req) => {
    let last_active = await usersModel.verifyLastActive(req.userId)
    let token
    const currentTime = Date.now()
    last_active = last_active[0].last_active
    const diff = Math.floor((currentTime - last_active.getTime()) / (1000 * 60 * 60))
    if (diff === '23') {
        const role = await roleModel.verifyUserRole(req.userId)
        token = jwt.sign({ id: req.userId, role: role[0].id }, config.SECRET, {
            expiresIn: 86400
        })
    } else {
        token = null;
    }
    return token;
}

export const getEntries = async (req, res) => {
    // const token = await genNewToken(req)
    // const { user_id } = req.body
    const user_id = req.body.user_id ? req.body.user_id : req.userId
    let where = [];
    if (req.body.start_time) {
        const start_time = new Date(req.body.start_time)
        const end_time = new Date(new Date(req.body.end_time).setHours(23, 59, 59))
        where.push({ start_time: { [Op.between]: [start_time, end_time] } })
    }
    where.push({ user_id: user_id })
    where.push({ [Op.and]: sequelize.literal('(TIMEDIFF(end_time, start_time) < "10:00:00")') })
    let result = await db.entries.findAll({
        order: [["id", "DESC"]],
        include: {
            model: db.tasks,
            attributes: []
        },
        raw: true,
        attributes: {
            include: [[sequelize.literal('task.description'), 'description']]
        },
        where: where
    })
    let suspicious = await db.entries.findAll({
        where: sequelize.literal(`TIMEDIFF(end_time, start_time) >= '10:00:00' AND user_id=${user_id}`),
        order: [['start_time', 'desc']]
    })
    res.status(200).json({ entries: result, suspicious })
}

export const getStartedEntry = async (req, res) => {
    const startedEntry = await db.entries.findOne({ where: { user_id: req.userId, status: 0 } })
    // io.emit('server:message', startedEntry);
    res.json(startedEntry);
}

export const createEntry = async (req, res) => {
    const date = moment().format('YYYY-MM-DD')
    const { start_time, status } = req.body
    const task = {
        description: req.body.description
    }
    console.log(req.body.description)
    const newTask = await db.tasks.create(task)
    const data = {
        start_time: new Date(),
        end_time: new Date(),
        date,
        user_id: req.userId,
        status,
        task_id: newTask.id
    }
    const result = await db.entries.create(data)

    if (result) {
        const startedEntry = await db.entries.findOne({
            where: { user_id: req.userId, status: 0 },
            include: {
                model: db.tasks,
                required: false,
                attributes: []
            },
            attributes: {
                include: [[sequelize.literal('task.description'), 'description']]
            }
        })
        io.emit('server:message', result)
        io.emit('server:admin:newEntry')
        res.json(startedEntry)
    } else {
        res.json('There was a Trouble')
    }
}

export const closeEntry = async (req, res) => {

    let entryData = {
        end_time: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
        status: 1,
    }

    const result = await db.entries.update(entryData, { where: { id: req.params.entryId, status: 0 } })
    await db.tasks.update({description: req.body.description}, {where: {id: req.body.task_id}})
    if (result) {
        // io.emit('server:closedEntry', [req.userId, entryData])
        io.emit('server:closedEntry')

        res.status(200).json({ message: 'closed' })
    } else {
        res.status(400).json({ message: "there whas an error" })
    }
}

export const getUserEntriesStatus = async (req, res) => {
    const result = await models.getStartedEntry(req.body.id)
    res.json(result)
}

export const updateEntryById = async (req, res) => {
    const { start_time, end_time, date, description, task_id } = req.body
    const taskData = ({
        id: task_id,
        description
    })
    await models.updateTask(taskData)

    const entryData = ({
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        date: new Date(date),
    })
    const result = await db.entries.update(entryData, { where: { id: req.params.entryId } })
    if (result) {
        res.status(200).json({ message: 'Updated' })
    } else {
        res.status(400).json({ message: "there whas an error" })
    }
}
export const updateTaskById = async (req, res) => {
    const { description, id } = req.body
    const taskData = ({
        description: description == null ? '' : description
    })
    console.log(req.body.task_id)
    const updated = req.body.task_id != null ? await db.tasks.update(taskData, { where: { id: req.params.task_id } }) : await db.tasks.create(taskData)

    if (updated == 1 || updated.dataValues) {
        res.status(200).json({ message: 'Task Updated successfully' })
    } else if (updated == 0) {
        res.status(201).json({ message: 'No changes detected' })
    } else {
        res.status(400).json({ message: "There was an error" })
    }
    if (updated.dataValues) {
        await db.entries.update({ task_id: updated.dataValues.id }, { where: { id: id } })
    }
}

export const deleteProductById = async (req, res) => {
    const result = await models.deleteById(req.params.entryId)
    if (result) {
        res.json(result)
    } else {
        res.json('error')
    }
}

export const getEntryForReview = async (req, res) => {
    const { id } = req.body
    let where = "TIMEDIFF(end_time, start_time) >= 10:00:00)"
    if (id) {
        where = "TIMEDIFF(end_time, start_time) >= 10:00:00) AND user_id =".id
    }
    const reviewEntry = db.entries.findAll({
        where: sequelize.literal(where)
    })
    res.json(reviewEntry)
}