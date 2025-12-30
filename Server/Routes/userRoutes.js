const express = require('express');
const { Signup, Login, getAllUsers, getMe } = require('../Controllers/UserController.js');
const protectRoute = require('../Middlewares/Auth.js');

const userRouter = express.Router();

userRouter.post("/signup",Signup);
userRouter.post("/login",Login);
userRouter.post("/getUsers", getAllUsers);
userRouter.post("/me",getMe);


module.exports = userRouter;