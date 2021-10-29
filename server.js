const app = require('express')()
const http = require('http').createServer(app)


app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})

//Socket Logic
const socketio = require('socket.io')(http)

socketio.on("connection", (userSocket) => {
    userSocket.emit("receive_message", {first_load:"socket io"})
    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data)
    })
})

let port = process.env.PORT || 8080
http.listen(port)