import db from '../../models';
import userModel from '../models/User'


export const verifyUser = async(req, res, next) =>{
    const findUser = await db.users.findOne({where: {email:req.body.email}});
    if(!findUser){
        next()
        return
    }else{
        res.status(404).json({message: "Account already exists"})
    }
}