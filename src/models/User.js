import pool from '../database'
import bcrypt from "bcryptjs";
const userModel = {}

userModel.findUserByEmail = async(email) =>{
    const user = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if(user.length > 0){
        return user;
    }else{
        return false;
    }
}
userModel.findById = async(user_id)  => {
    return await pool.query('SELECT * FROM users WHERE id =?', [user_id]);
}
userModel.createUser = async(data) =>{
    return await pool.query('INSERT INTO users SET ?', [data]);
}
userModel.encryptPass = async(password) =>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
}
userModel.comparePass = async(password, receivesPass) =>{
    return await bcrypt.compare(password, receivesPass)
}

module.exports = userModel