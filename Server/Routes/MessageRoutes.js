const express = require('express');
const { getAllMessages, sendMessage } = require('../Controllers/MessageController.js');

const msgRouter = express.Router();

msgRouter.post("/getallmessaage", getAllMessages);
msgRouter.post("/send",sendMessage);
module.exports = msgRouter;
