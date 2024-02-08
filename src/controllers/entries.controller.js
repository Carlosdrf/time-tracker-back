import models from "../models/Entries";
import usersModel from "../models/User";
import reportModel from "../models/Report";
import roleModel from '../models/Role'
import * as format from '../services/utc.format'
import moment from 'moment';
import jwt from "jsonwebtoken";
import config from '../config'
import { io } from "../app";


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
    const token = await genNewToken(req)
    let result
    if (req.role == 1) {
        result = await usersModel.getAllEntries()
    } else {
        result = await models.getEntries(req.userId)
    }
    res.status(200).json({ result, token })
}

export const getAllEntries = async (req, res) => {
    const dateRange = {
        start_time: new Date(req.body.start_time),
        end_time: new Date(new Date(req.body.end_time).setHours(23, 59, 59))
    }

    const result = await models.getAllEntries(dateRange)
    res.json(result)
}
// users entries
export const getUsersEntries = async (req, res) => {
    const user_id = req.body.user_id
    let result
    if (req.body.start_time == null) {
        result = await models.getEntries(user_id)
    } else {
        const dateRange = {
            start_time: await format.UTCStart(req.body.start_time),
            end_time: await format.UTCend(req.body.end_time)
        }
        result = await reportModel.getReport(dateRange, user_id)
    }
    res.json(result)
}

export const getStartedEntry = async (req, res) => {
    const startedEntry = await models.getStartedEntry(req.userId)
    io.emit('server:message', startedEntry);
    res.json(startedEntry);
}

export const createEntry = async (req, res) => {
    const date = moment().format('YYYY-MM-DD')
    const { start_time, status } = req.body

    const taskId = await models.createTask(req.body.task)
    const data = {
        start_time: new Date(start_time),
        end_time: new Date(start_time),
        date,
        user_id: req.userId,
        status,
        task_id: taskId.insertId
    }
    const result = await models.createEntry(data)
    if (result) {
        io.emit('server:message', result.insertId)
        io.emit('server:admin:newEntry')
        // io.emit('server:admin:newEntry', [req.userId, data])
        res.json(result.insertId)
    } else {
        res.json('There was a Trouble')
    }
}

export const closeEntry = async (req, res) => {

    let entryData = ({
        end_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: 1,
    })
    const result = await models.closeCurrentEntry(req.params.entryId, entryData, req.userId)

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
        start_time: moment(date).format('YYYY-MM-DD') + ' ' + moment(start_time).format('HH:mm:ss'),
        end_time: moment(date).format('YYYY-MM-DD') + ' ' + moment(end_time).format('HH:mm:ss'),
        date: moment(date).format('YYYY-MM-DD'),
    })
    const result = await models.updateEntryById(req.params.entryId, entryData)
    if (result) {
        res.status(200).json({ message: 'Updated' })
    } else {
        res.status(400).json({ message: "there whas an error" })
    }
}
export const updateTaskById = async (req, res) => {
    const { description } = req.body
    console.log(description, req.params.task_id)
    const taskData = ({
        id: req.params.task_id,
        description
    })
    const updated = await models.updateTask(taskData)
    console.log(updated)
    if (updated) {
        res.status(200).json({ message: 'Task Updated' })
    } else {
        res.status(400).json({ message: "there whas an error" })
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