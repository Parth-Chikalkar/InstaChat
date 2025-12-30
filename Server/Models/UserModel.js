const mongoose =require('mongoose');
const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    fullname : {
        type : String,
        required : true,
    },
    profilePic :{
        type : String,
        default :""
    },
    bio: {
        type : String,
        default :"Hello there , Im using ChatBot"
    }, 
    password :{
        type : String,
        
    }
},{timestamps : true});

const User = mongoose.model("User",userSchema);
module.exports = User;