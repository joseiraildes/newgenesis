const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")


const app = express()
// const server = new createServer(app)

module.exports = {
  app
}