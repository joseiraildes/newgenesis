const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
// const { app, server } = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
const IpQuery = require("./ip/api.js")
const User = require("./models/User.js")

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
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", async(req, res) => {
  const ip = await IpQuery()
  console.log("IP =>", ip)
  
  const user = await User.findOne({
    where: {
      ip: ip
    }
  })

  // console.log(user)

  if (!user ||user === null) {
    console.log("User not found")
    // res.json({
    //   message: "User not found",
    //   ip: ip
    // })
    res.redirect("/login")
  } else {
    res.render("home")
    console.log("User found =>", user.dataValues)
  }
  
})
app.get("/login", async(req, res)=>{
  // verification and redirect for page
  const ip = await IpQuery()
  // console.log("IP =>", ip)

  const user = await User.findOne({
    where: {
      ip: ip
    }
  })

  if (!user || user === null) {
    console.log("User not found")
    res.render("login")
  } else {
    res.redirect("/")
    console.log("User found =>", user.dataValues)
  }
})
app.get("/register", async(req, res)=>{
  // register
  const ip = await IpQuery()

  const user = await User.findOne({
    where: {
      ip: ip
    }
  })

  if(!user || user === null){
    console.log("User not found")
    res.render("register")
  }else{
    res.redirect("/login")
    console.log("User found =>", user.dataValues)
  }
})
// socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected =>", socket.id)
  socket.emit("connected", { message: "Hello, people." })
  socket.on("disconnect", () => {
    console.log("Client disconnected =>", socket.id)
  })
})


server.listen(3001, (err)=>{
  if (err) console.log(err)
  console.log("Server is running on port 3001")
})