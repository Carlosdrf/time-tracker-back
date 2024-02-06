import pool from '../database'

const models = {}

models.getEntries = async (user_id, dateRange = 0) => {
    if (dateRange == 0) {
        return await pool.query('SELECT tt.*, t.description FROM entries tt LEFT JOIN tasks t ON t.id = tt.task_id WHERE tt.user_id = ? ORDER BY tt.start_time DESC', [user_id]);
    } else {
        return await pool.query('SELECT tt.*, t.description FROM entries tt LEFT JOIN tasks t ON t.id = tt.task_id WHERE tt.user_id = ? AND tt.status = 1 AND tt.date BETWEEN ? AND ? ORDER BY tt.start_time DESC', [user_id, dateRange]);
    }
}
models.getAllEntries = async (dateRange) => {
    return await pool.query('SELECT * FROM entries WHERE start_time BETWEEN ? AND ?;', [dateRange.start_time, dateRange.end_time])
}

// models.getUsersEntries = async(user_id) => {
//     return await pool.query('SELECT tt.*, t.description FROM entries tt LEFT JOIN tasks t ON t.id = tt.task_id WHERE tt.user_id = ? and tt.status = 1 ORDER BY tt.start_time DESC', [user_id]);
// }

models.getStartedEntry = async (user_id) => {
    const row = await pool.query('SELECT id, status, start_time FROM entries WHERE user_id = ? AND status = 0', [user_id])
    return row;
}

models.closeCurrentEntry = async (entry_id, date, user_id) => {
    const row = await pool.query('UPDATE entries SET ? WHERE user_id = ? AND id = ? AND status = 0', [date, user_id, entry_id])
    return row;
}

models.createEntry = async (data) => {
    return await pool.query('INSERT INTO entries SET ?', [data]);
}
models.createTask = async (task) => {
    return await pool.query('INSERT INTO tasks SET description = ?', [task])
}
models.updateTask = async (data) => {
    return await pool.query('UPDATE tasks SET description = ? WHERE id =?', [data.description, data.id])
}
models.deleteById = async (id) => {
    return await pool.query('DELETE FROM entries WHERE id = ?', [id])
}

models.updateEntryById = async (id, data) => {
    return await pool.query('UPDATE entries SET ? WHERE id = ?', [data, id])
}

module.exports = models