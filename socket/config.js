const { createServer } = require("http");
const { app } = require("../config/config");

const server = createServer(app);

module.exports = server