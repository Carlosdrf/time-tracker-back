import userModel from '../models/User'
import roleModel from '../models/Role'
import jwt from "jsonwebtoken";
import config from '../config'
import moment from 'moment'
import db from '../../models'

export const signUp = async (req, res) => {
    const { email, password, name, last_name } = req.body;
    const newUser = ({
        name,
        last_name,
        email,
        password: await userModel.encryptPass(password),
        last_active: moment().format('YYYY-MM-DD HH:mm:ss')
    })
    const savedUser = await userModel.createUser(newUser)
    await roleModel.assignRole(savedUser.insertId);
    if (savedUser) {
        const user = await userModel.findUserByEmail(req.body.email)
        const role = await roleModel.verifyUserRole(user[0].id)
        const token = jwt.sign({ id: savedUser.insertId, role: role[0].id }, config.SECRET, {
            expiresIn: 86400
        })
        const username = user[0].name
        const role_id = role[0].id
        const email = user[0].email
        res.json({ token, username, role_id, email })
    } else {
        res.status(404).json('there was a problem')
    }
}

export const signin = async (req, res) => {
    const user = await db.users.findOne({
        where: { email: req.body.email },
        attributes: {
            include: ['password']
        }
    })
    if (!user) return res.status(400).json({ message: 'no user found' })
    const matchPass = await userModel.comparePass(req.body.password, user.password)

    if (!matchPass) return res.status(401).json({ token: null, message: 'invalid password' })
    const role = await db.user_roles.findOne({ where: { user_id: user.id } })

    const token = jwt.sign({ id: user.id, role: role.role_id }, config.SECRET, {
        expiresIn: 86400
    })
    const last_active = moment().format('YYYY-MM-DD HH:mm:ss')
    await db.users.update({ last_active: last_active }, { where: { id: user.id } })
    const username = user.name
    const role_id = role.role_id
    const email = user.email

    res.json({ token, username, role_id, email })
}