import jwt from "jsonwebtoken";
import config from "../config";
import userModel from '../models/User'
import roleModel from "../models/Role";

export const verifyToken = async(req, res, next) =>{
    try {
        const token = req.headers.authorization

        if(!token) return res.status(403).json({message: 'no token providen'})
        const tokenKey = token.split(' ')[1];
        const decoded = jwt.verify(tokenKey, config.SECRET)
        req.userId = decoded.id
        req.name = decoded.name
        console.log(decoded)
        const user = await userModel.findById(req.userId)
        if(!user) res.status(404).json({message: 'no user found'})

        next()
    } catch (error) {
        return res.status(401).json({message: 'unauthorized'})
    }
    
}
export const isEmployee = async(req, res, next) =>{
    const role = await roleModel.verifyUserRole(req.userId);
    console.log(role[0]);
    if(role[0].name === "Employee"){
        next()
        return;
    }
    return res.status(403).json({message: 'wrong role'})
}