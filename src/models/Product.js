import pool from '../database'
// import '../database'

const models = {}

models.getProduct = async() =>{
    const row = await pool.query('SELECT * FROM users');
    console.log(row.length)
    if(row.length > 0){
        return row;
    }else{
        return false
    }
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