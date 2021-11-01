const app = require('express')()
const http = require('http').createServer(app)
const connectedUsers =[];

const socketio = require('socket.io')(http);
socketio.connectedUsers =[];

app.get('/', (req, res) => {
   var clients =  socketio.connectedUsers;
   console.log(clients)
    res.send("Connected users"+ JSON.stringify(connectedUsers))
});

socketio.on("connection", (userSocket) => {
    console.log('user connected')
  console.log(userSocket.id)
 
    userSocket.emit("receive_message", {first_load:"socket io"})

    userSocket.emit("get_user", {socket_id:userSocket.id})

    userSocket.on('set_user', (data)=>{
        console.log(data);
        
        socketio.connectedUsers= socketio.connectedUsers.filter(element=> element.email !== data.email);
        socketio.connectedUsers.push(data)
        socketio.emit('connected_users',{users: socketio.connectedUsers} )

    });

    userSocket.on("send_message", (data) => {
        userSocket.broadcast.emit("receive_message", data)
    });

    userSocket.on('disconnect', (data)=>{
        socketio.connectedUsers= socketio.connectedUsers.filter(element=> element.sockeId !== userSocket.id);
        socketio.emit('connected_users',{users: socketio.connectedUsers} )
        console.log("disconnected")
    });


})

let port = process.env.PORT || 8080
http.listen(port)