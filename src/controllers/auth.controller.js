import userModel from '../models/User'
import roleModel from '../models/Role'
import jwt from "jsonwebtoken";
import config from '../config'
import moment from 'moment'

export const signUp = async(req,res) =>{
    const {email, password, name, last_name} = req.body;
    const newUser = ({
        name,
        last_name,
        email,
        password: await userModel.encryptPass(password),
        last_active: moment().format('YYYY-MM-DD HH:mm:ss')
    })
    const savedUser = await userModel.createUser(newUser)
    await roleModel.assignRole(savedUser.insertId);
    if(savedUser){
        const user = await userModel.findUserByEmail(req.body.email)
        const role = await roleModel.verifyUserRole(user[0].id)
        const token = jwt.sign({id: savedUser.insertId, role: role[0].id}, config.SECRET,{
            expiresIn: 86400
        })
        const username = user[0].name
        const role_id = role[0].id
        const email = user[0].email
        res.json({token, username, role_id, email})
    }else{
        res.status(404).json('there was a problem')
    }
}

export const signin = async(req, res) => {
    const user = await userModel.findUserByEmail(req.body.email)
    if(!user) return res.status(400).json({message: 'no user found'})
    console.log(user[0])
    const matchPass = await userModel.comparePass(req.body.password, user[0].password)

    if(!matchPass) return res.status(401).json({token: null, message: 'invalid password'})
    const role = await roleModel.verifyUserRole(user[0].id)
    const token = jwt.sign({id: user[0].id, role: role[0].id}, config.SECRET, {
        expiresIn: 86400
    })
    const last_active = moment().format('YYYY-MM-DD HH:mm:ss')
    await userModel.updateLastActive(user[0].id, last_active)
    const username = user[0].name
    const role_id = role[0].id
    const email = user[0].email


    res.json({token, username, role_id, email})
}