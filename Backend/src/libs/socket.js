const http = require('http');
const express = require('express');
const {Server} = require('socket.io');


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST']
    }
})

//used to store online users
const userSocketMap = {}

    function getReceiverSocketId(userId) {
        console.log(userId)
        return userSocketMap[userId]
    }

io.on('connection', (socket) => {
    console.log('a user connected');
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

module.exports = {io, app, server, getReceiverSocketId}