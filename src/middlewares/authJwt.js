import jwt from "jsonwebtoken";
import config from "../config";
import userModel from '../models/User'
import roleModel from "../models/Role";
import moment from 'moment'

export const verifyToken = async(req, res, next) =>{
    try {
        const token = req.headers.authorization

        if(!token) return res.status(403).json({message: 'no token providen'})
        const tokenKey = token.split(' ')[1];
        const decoded = jwt.verify(tokenKey, config.SECRET)
        req.userId = decoded.id
        req.name = decoded.name
        req.role = decoded.role
        const user = await userModel.findById(req.userId)
        if(!user) res.status(404).json({message: 'no user found'})
        
        next()
    } catch (error) {
        return res.status(401).json({message: 'unauthorized'})
    }
    
}
export const isAdmin = async(req, res, next) => {
    const role = await roleModel.verifyUserRole(req.userId);
    if(role[0].id === 1){
        next()
        return
    }
    return res.status(403).json({message: "Doesn't have the right permission"});
}
export const isEmployee = async(req, res, next) =>{
    const role = await roleModel.verifyUserRole(req.userId);
    if(role[0].id === 1 || role[0].id === 2 ){
        next()
        return;
    }
    return res.status(403).json({message: 'wrong role'})
}