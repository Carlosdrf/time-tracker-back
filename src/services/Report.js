import pool from '../database'

const models = {}

models.getReport = async(dateRange, user_id = '') =>{
    let row
    if(user_id == ''){
        row = await pool.query('SELECT u.id, u.name, u.email, u.last_name, tt.date, tt.start_time, tt.end_time, t.description FROM users u INNER JOIN entries tt ON tt.user_id = u.id INNER JOIN tasks t ON t.id = tt.task_id WHERE tt.status = 1 AND tt.start_time BETWEEN ? AND ? ORDER BY u.email asc', [dateRange.start_time, dateRange.end_time])
    }else if(dateRange == 0 && user_id !== null){
        row = await pool.query('SELECT u.id, u.name, u.email, u.last_name, tt.date, tt.task_id, tt.start_time, tt.end_time, t.description FROM users u INNER JOIN entries tt ON tt.user_id = u.id INNER JOIN tasks t ON t.id = tt.task_id WHERE u.id = ? AND tt.status = 1', [user_id])
    }else{
        row = await pool.query('SELECT u.id, u.name, u.email, u.last_name, tt.date, tt.start_time, tt.end_time, t.description FROM users u INNER JOIN entries tt ON tt.user_id = u.id INNER JOIN tasks t ON t.id = tt.task_id WHERE u.id = ? AND tt.status = 1 AND tt.start_time BETWEEN ? AND ? ORDER BY u.email asc', [user_id, dateRange.start_time, dateRange.end_time])
    }
    return row
}

module.exports = models