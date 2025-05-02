// sequelize config mysql
const { Sequelize } = require("sequelize");
require("dotenv").config()
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  dialect: "mysql",
})

module.exports = sequelize