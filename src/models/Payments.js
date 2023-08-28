import pool from "../database";

const model = {}

model.createPayment = async (data) => {
    return await pool.query('insert into payments set ?', [data])
}

model.getPayments = async (user_id) => {
    return await pool.query('select p.*, c.name as currency_name, s.name as status_name, s.id as status_id from payments p left join currencies c on c.id = p.currency_id left join status s on s.id = p.status_id where user_id = ?', [user_id])
}
model.updatePayment = async(data) =>{
    return await pool.query('update payments set ? where id = ?', [data, data.id])
}
module.exports = model