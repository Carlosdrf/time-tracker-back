import mysql from "mysql";
import { promisify } from 'util';


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'i-nimble_db'
})


pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
    return err;
  }else{
    if (connection) connection.release();
    console.log('DB is Connected');

    return;
  }  
});

// Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;
