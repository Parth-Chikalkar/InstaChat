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
app.use(express.json());
app.use(cors());

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
// 📞 Incoming Call
socket.on("incoming-call", ({ to, from, callId }) => {
  const receiverSockets = global.userSocketMap[to];

  if (receiverSockets) {
    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("incoming-call", {
        from,
        callId,
      });
    });
  }
});
// ❌ Call Rejected
socket.on("reject-call", ({ to }) => {
  const receiverSockets = global.userSocketMap[to];

  if (receiverSockets) {
    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("call-rejected");
    });
  }
});
// 🔚 Call Ended
socket.on("end-call", ({ to }) => {
  const receiverSockets = global.userSocketMap[to];

  if (receiverSockets) {
    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("call-ended");
    });
  }
});
socket.on("call-accepted", ({ to, callId }) => {
  const receiverSockets = global.userSocketMap[to];

  if (receiverSockets) {
    receiverSockets.forEach((socketId) => {
      io.to(socketId).emit("call-accepted", { callId });
    });
  }
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


const { StreamClient } = require("@stream-io/node-sdk");

const streamClient = new StreamClient(
  process.env.GETSTREAM_API_KEY,
  process.env.GETSTREAM_API_SECRET
);

app.post("/video-token", (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId required" });
    }

    const token = streamClient.createToken(userId);

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Token generation failed" });
  }
});

app.post("/create-call", async (req, res) => {
  try {
    const { callId, userId } = req.body;

    if (!callId || !userId) {
      return res.status(400).json({ error: "callId and userId required" });
    }

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: userId, // ✅ REQUIRED FIX
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Call creation failed" });
  }
});

app.use("/api/auth",userRouter);
app.use("/api/messages",msgRouter)

 dbConnect();
server.listen(PORT,()=>{
    console.log("Server live on "+ PORT);
})
