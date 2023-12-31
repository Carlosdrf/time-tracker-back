import pool from '../database'
const roleModel = {}

roleModel.ADMIN_ROLE = '1';
roleModel.USER_ROLE = '2';
roleModel.EMPLOYER_ROLE = '3';

roleModel.verifyRoleExists = async()=>{
    return await pool.query('SELECT * FROM roles');
}
roleModel.assignRole = async(user_id, role_id = 2) =>{
    return await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES(?,?)', [user_id, role_id])
}
roleModel.verifyUserRole = async(user_id) =>{
    return await pool.query('SELECT r.name, r.id FROM roles r INNER JOIN user_roles ur ON ur.role_id = r.id INNER JOIN users u ON u.id = ur.user_id WHERE u.id = ?', [user_id])
}
roleModel.createRole = async(data) =>{
    return await pool.query('INSERT INTO roles SET ?', [data])
}
// roleModel.getUserProv = async()=>{
//     return await pool.query('SELECT * FROM users')
// }
module.exports = roleModel