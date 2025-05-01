const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
// const { app, server } = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")

const app = express()
const server = createServer(app)
const io = new Server(server)

app.engine("hbs", hbs.engine({
  extname: ".hbs",
  defaultLayout: "main.hbs",
  layoutsDir: path.join(__dirname, "views/layouts"),
}))
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
  res.render("home")
})

app.get("/socket", (req, res) => {
  res.send("Socket route")
})
// socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected =>", socket.id)
  socket.on("disconnect", () => {
    console.log("Client disconnected =>", socket.id)
  })
})


server.listen(3000, (err)=>{
    if (err) console.log(err)
    console.log("Server is running on port 3000")
})