const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
    let socketId = socket.id;
    io.to(socket.id).emit("resServer", socket.id);
    socket.on("reqJoin", ([name, socketId]) => {
        io.emit("resJoin", [name, socketId]);
    })
    socket.on("reqSend", ([name, msg, socketId]) => {
        io.emit("resSend", [name, msg, socketId]);
    });
});

io.on("disconnect", (socket) => {
    io.to(socket.id).emit("resDisconnected", socket.id);
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
