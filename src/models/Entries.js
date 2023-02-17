import pool from '../database'
// import '../database'

const models = {}

models.getEntries = async(user_id) =>{
    const row = await pool.query('SELECT * FROM time_tracker WHERE user_id = ? and status = 1 ORDER BY time_tracker.start_time DESC', [user_id]);
    console.log(row.length)
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
models.deleteById = async(id) =>{
    return await pool.query('DELETE FROM time_tracker WHERE id = ?', [id])
}

models.updateEntryById = async(id, data) =>{
    return await pool.query('UPDATE time_tracker SET ? WHERE id = ?', [data, id])
}

module.exports = models