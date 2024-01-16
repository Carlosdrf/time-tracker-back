"use strict";

var _mysql = _interopRequireDefault(require("mysql"));
var _util = require("util");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
require('dotenv').config();
var pool = _mysql["default"].createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
pool.getConnection(function (err, connection) {
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
  } else {
    if (connection) connection.release();
    console.log('DB is Connected');
    return;
  }
});

// Promisify Pool Querys
pool.query = (0, _util.promisify)(pool.query);
module.exports = pool;