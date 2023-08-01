import pool from "../database";

const model = {}

model.createPayment = async(data) =>{
    return await pool.query('insert into payments set ?', [data])
}

module.exports = model