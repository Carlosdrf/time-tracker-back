import pool from '../database'
import bcrypt from "bcryptjs";
const userModel = {}

userModel.getUsersList = async(name) => {
    if(name == ''){
        return await pool.query('SELECT u.name, u.last_name, u.email, u.id FROM users u INNER JOIN user_roles ur ON u.id = ur.user_id INNER JOIN roles r ON r.id = ur.role_id WHERE r.id = 2 ORDER BY u.name')
    }else{
        name = '%'+name+'%'
        return await pool.query('SELECT u.name, u.last_name, u.email, u.id FROM users u INNER JOIN user_roles ur ON u.id = ur.user_id INNER JOIN roles r ON r.id = ur.role_id WHERE r.id = 2 AND u.name LIKE ? ORDER BY u.name', [name])
    }
}
// testing

userModel.findUserByEmail = async(email) =>{
    const user = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if(user.length > 0){
        return user;
    }else{
        return false;
    }
}
userModel.updateLastActive = async(user_id, last_active) => {
    await pool.query('UPDATE users SET last_active = ? WHERE id = ?', [last_active, user_id])
}
userModel.verifyLastActive = async(user_id) => {
    const result = await pool.query('SELECT last_active FROM users WHERE id = ?', [user_id])
    return result;
}
userModel.findById = async(user_id)  => {
    return await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);
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