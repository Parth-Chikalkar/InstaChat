const userModel = require('../Models/UserModel.js');
const messageModel = require('../Models/Message.js');

const { decodejwt } = require('../Lib/utils.js');

const getAllMessages = async (req, res) => {
  try {
    const { tok, recieverId } = req.body;

    const decoded = decodejwt(tok);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing token",
      });
    }

    const my_id = decoded.userId;

    const messages = await messageModel.find({
      $or: [
        { senderId: my_id, recieverId },
        { senderId: recieverId, recieverId: my_id },
      ],
    });

    res.json({ success: true, messages, my_id });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get messages",
    });
  }
};


const sendMessage = async (req, res) => {
  try {
    const { text, tok, recieverId } = req.body;

    const decoded = decodejwt(tok);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing token",
      });
    }

    const senderId = decoded.userId;

    const new_message = await messageModel.create({
      senderId,
      recieverId,
      text,
      image: "",
    });

    const receiverSocketId = global.userSocketMap?.[recieverId];

    if (receiverSocketId) {
      global.io.to(receiverSocketId).emit("NewMessage", new_message);
    }

    res.json({ success: true, new_message });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};


module.exports = {
  getAllMessages,
  sendMessage,
};