const mysql = require('mysql2');
require("dotenv").config()
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env

async function Mysql(){
  const connection = await mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });
  const pool = connection.promise();
  return pool;
}

module.exports = Mysql