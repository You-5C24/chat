const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 8080
let connectedUser = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on("connection", (socket) => {
  console.log("a user connected");
  let userName = ''

  // login
  socket.on('login', (name, callback) => {
    if (name.trim().length === 0) {
      return
    }
    callback(true)
    userName = name
    connectedUser.push(userName)
    // console.log(connectedUser);
    updateUserName()
  })

  // Receive Chat Message
  socket.on('chat message', (msg) => {
    console.log(msg);

    io.emit('output', {
      name: userName,
      msg: msg
    })
  })



  // Disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    connectedUser.splice(connectedUser.indexOf(userName), 1)
    // console.log(connectedUser);
    updateUserName()
  })

  // Update username
  function updateUserName() {
    io.emit("loadUser", connectedUser)
  }
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
})