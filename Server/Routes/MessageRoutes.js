const express = require('express');
const { getAllMessages, sendMessage, deleteMsgs } = require('../Controllers/MessageController.js');

const msgRouter = express.Router();

msgRouter.post("/getallmessaage", getAllMessages);
msgRouter.post("/send",sendMessage);
msgRouter.post("/deletemessages",deleteMsgs);
module.exports = msgRouter;
