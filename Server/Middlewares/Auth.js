
const user = require('../Models/UserModel.js')

const jwt = require('jsonwebtoken');
//protect route 
const protectRoute = (req, res,next)=>{
    try {
        const token = req.headers.token;
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = user.findbyId(decode._id);
        if(!user){
            res.json({sucess : false , message : "User Not Found !"})
        }
        req.user = user;
        next();
    } catch (error) {
        res.json({sucess:false, message :"Error in Backend !"})
    }
}
module.exports = protectRoute;
