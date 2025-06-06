const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
// const { app, server } = require("./config/config.js")
const hbs = require("express-handlebars")
const path = require("path")
const IpQuery = require("./ip/api.js")
const User = require("./models/User.js")
const Datetime = require("./moment/config.js")
const Mysql = require("./mysql/config.js")
const upload = require("./upload/config.js")
const Post = require("./models/Post.js")
const { marked } = require("marked")

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
app.use(express.static(path.join(__dirname, "upload")))
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
    res.render("home", { user: user.dataValues })
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
app.post("/login", async(req, res)=>{
  // login
  const ip = await IpQuery()
  const { username, password } = req.body

  console.log("IP =>", ip)
  console.log("Username =>", username)
  console.log("Password =>", password)
  


  const user = await User.findOne({ where: { username: username } });
  if (user && user.password === password) {
    console.log("User found =>", user.dataValues)
    const update = await User.update({
      ip: ip,
      data: Datetime()
    }, {
      where: {
        username: username,
      }
    })

    console.log("User logged in =>", username);
    res.redirect("/");
  } else {

    const error = `
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Opa, houve um erro aqui!</strong> Campos de usuário ou senha, não estão corretos.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    res.render("login", { error: error });
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
app.post("/register", async(req, res)=>{
  // register
  const ip = await IpQuery()
  const { username, password, email } = req.body

  console.log("IP =>", ip)
  console.log("Username =>", username)
  console.log("Password =>", password)
  console.log("Email =>", email)

  const user = await User.findOne({
    where: {
      ip: ip
    }
  })
  // check if username and email are registed
  const nameCheck = await User.findOne({
    where: {
      username: username
    }
  })
  const emailCheck = await User.findOne({
    where: {
      email: email
    }
  })
  if (!nameCheck || nameCheck === null || nameCheck === undefined && !emailCheck || emailCheck === null || emailCheck === undefined) {
    // create user
    const newUser = await User.create({
      username: username,
      password: password,
      email: email,
      data: Datetime(),
      ip: ip,
      bio: ""
    })
    console.log("User created =>", newUser.dataValues)
    // res.json({
    //   message: "User created",
    //   status: true
    // })
    res.redirect("/login")
  } else {
    console.log("User already exists")
    const error = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Opa, houve um erro aqui!</strong> Campos inscritos como: usuário e email, já estão cadastrados em NewGenesis.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    res.render("register", { error: error })
  }
})

app.get("/@:username", async(req, res)=>{
  // profile page
  const ip = await IpQuery()
  const { username } = req.params
  const mysql = await Mysql()

  console.log("IP =>", ip)
  console.log("Username =>", username)

  const user = await User.findOne({
    where: {
      ip: ip
    }
  })

  
  if (!user || user === null) {
    console.log("User not found")
    res.redirect("/login")
  } else {
    let profileCheck = await User.findOne({
      where: {
        username: username
      }
    })
    //edit profile button
    const editProfile = `
      <button class="btn btn-primary btn-sm" onclick="location.href='/edit-profile/'">Editar Perfil</button>
    `
    const profile = await mysql.query(`SELECT * FROM Users WHERE username = "${username}"`)
    console.log(profile)
    if (profileCheck.ip === ip) {
      res.render("profile", { profile: profile[0], btn: editProfile, user: user.dataValues })
    } else {
      res.render("profile", { profile: profile[0], user: user.dataValues })
    }
  }
})
app.get("/publicar", async(req, res)=>{
  // publish page
  const ip = await IpQuery()
  const user = await User.findOne({
    where: {
      ip: ip
    }
  })
  if (!user || user === null) {
    console.log("User not found")
    res.redirect("/login")
  } else {
    res.render("publicar", { user: user.dataValues })
  }
})
app.post("/publicar", upload.single("image"), async(req, res)=>{
  // publish post
  const ip = await IpQuery()
  const { title, content } = req.body
  const user = await User.findOne({
    where: {
      ip: ip
    }
  })
  if (!user || user === null) {
    console.log("User not found")
    res.redirect("/login")
  } else {
    console.log("IP =>", ip)
    console.log("Title =>", title)
    console.log("Content =>", content)
    const mysql = await Mysql()
    const post = await Post.create({
      title: title,
      content: marked(content),
      image: req.file.filename,
      data: Datetime(),
      post_like: 0,
      username: user.username
    })
    console.log("Post created =>", post)
    io.emit("newPost", post);
    res.redirect(`/@${post.username}/posts/${post.id}`)
  }

})
app.get("/@:username/posts/:id", async(req, res)=>{
  // post page
  const ip = await IpQuery()
  const { username, id } = req.params
  const mysql = await Mysql()

  console.log("IP =>", ip)
  console.log("Username =>", username)
  console.log("Post ID =>", id)

  const user = await User.findOne({
    where: {
      ip: ip
    }
  })
  
  if (!user || user === null) {
    console.log("User not found")
    res.redirect("/login")
  } else {
    let profileCheck = await User.findOne({
      where: {
        username: username
      }
    })
    //edit post button
    const editPost = `
      <button class="btn btn-secondary" onclick="location.href='/edit-post/${id}'">Editar Post</button>
    `
    const post = await mysql.query(`SELECT * FROM Posts WHERE id = "${id}"`)
    console.log(post[0])
    if (profileCheck.ip === ip) {
      res.render("post", { post: post[0], btn: editPost, user: user.dataValues })
    } else {
      res.render("post", { post: post[0], user: user.dataValues })
    }
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