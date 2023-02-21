import pool from '../database'
// import '../database'

const models = {}

models.getEntries = async(user_id) =>{
    const row = await pool.query('SELECT tt.*, t.description FROM time_tracker tt LEFT JOIN tasks t ON t.id = tt.task_id WHERE tt.user_id = ? and tt.status = 1 ORDER BY tt.start_time DESC', [user_id]);
    // console.log(row.length)
    // if(row.length > 0){
        return row;
    // }else{
        // return false
    // }
}

models.getStartedEntry = async(user_id) => {
    const row = await pool.query('SELECT id, status FROM time_tracker WHERE user_id = ? AND status = 0', [user_id])
    return row;
}
models.closeCurrentEntry = async(entry_id, date, user_id) => {
    const row = await pool.query('UPDATE time_tracker SET ? WHERE user_id = ? AND id = ? AND status = 0', [date, user_id, entry_id])
    return row;
}

models.createEntry = async(data) =>{
    return await pool.query('INSERT INTO time_tracker SET ?', [data]);   
}
models.createTask = async(task) =>{
    return await pool.query('INSERT INTO tasks SET description = ?', [task])
}
models.updateTask = async(data) =>{
    return await pool.query('UPDATE tasks SET description = ? WHERE id =?', [data.description, data.id])
}
models.deleteById = async(id) =>{
    return await pool.query('DELETE FROM time_tracker WHERE id = ?', [id])
}

models.updateEntryById = async(id, data) =>{
    return await pool.query('UPDATE time_tracker SET ? WHERE id = ?', [data, id])
}

module.exports = models