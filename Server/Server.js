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
  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!global.userSocketMap[userId]) {
      global.userSocketMap[userId] = [];
    }
    global.userSocketMap[userId].push(socket.id);
  }

  socket.on("requestOnlineUsers", () => {
    socket.emit(
      "getOnlineUsers",
      Object.keys(global.userSocketMap)
    );
  });

  socket.on("disconnect", () => {
    if (userId && global.userSocketMap[userId]) {
      global.userSocketMap[userId] =
        global.userSocketMap[userId].filter(
          (id) => id !== socket.id
        );

      if (global.userSocketMap[userId].length === 0) {
        delete global.userSocketMap[userId];
      }
    }

    socket.broadcast.emit(
      "getOnlineUsers",
      Object.keys(global.userSocketMap)
    );
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
