const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const http = require('http');
const dbConnect =require('./Lib/db.js');
const userRouter = require('./Routes/userRoutes.js'); 
const msgRouter = require('./Routes/MessageRoutes.js')
const { Server } = require("socket.io");
const { log } = require('console');

const PORT = process.env.PORT || 2000;

const app= express();
const server = http.createServer(app);

//initial socket server 
const io = new Server(server,{
    cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

global.userSocketMap={};

global.io = io;



io.on("connection", (socket) => {

  socket.on("addUser", (userId) => {
    if (!userId) return;

    if (!global.userSocketMap[userId]) {
      global.userSocketMap[userId] = [];
    }

    if (!global.userSocketMap[userId].includes(socket.id)) {
      global.userSocketMap[userId].push(socket.id);
    }

    io.emit("getOnlineUsers", Object.keys(global.userSocketMap));
  });

  socket.on("disconnect", () => {
    for (const userId in global.userSocketMap) {
      global.userSocketMap[userId] =
        global.userSocketMap[userId].filter(id => id !== socket.id);

      if (global.userSocketMap[userId].length === 0) {
        delete global.userSocketMap[userId];
      }
    }

    io.emit("getOnlineUsers", Object.keys(global.userSocketMap));
  });
});




module.exports = {io , userSocketMap};


app.use(express.json());
app.use(cors());

app.use("/api/auth",userRouter);
app.use("/api/messages",msgRouter)

 dbConnect();
server.listen(PORT,()=>{
    console.log("Server live on "+ PORT);
})
