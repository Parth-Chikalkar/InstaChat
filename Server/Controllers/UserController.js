const { genToken, decodejwt } = require('../Lib/utils.js');
const User = require('../Models/UserModel.js');
const bcrypt = require('bcrypt');

// Signup Function
const Signup = async (req, res) => {
  const { fullname, email, password, bio } = req.body;

  try {
    if (!fullname || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedpass,
      bio,
    });

    const token = genToken(newUser._id);
    res.json({
      success: true,  
      user: newUser,
      token,
      message: "Account Created Successfully!",
    });
  } catch (error) {
    console.log(error.message); 
    res.json({ success: false, message: "Failed due to errors in backend!" });
  }
};

// Login Function
  const Login = async (req, res) => {
    try {
      const { email, password } = req.body;


      const userPass = await User.findOne({ email }); 
      
      if (!userPass) {
        return res.json({ success: false, message: "User not found!" });
      }

      const check = await bcrypt.compare(password, userPass.password);
      if (!check) {
        return res.json({ success: false, message: "Invalid Credentials!" });
      }
   
      const token = genToken(userPass._id);
      res.json({
        success: true,
        user: userPass,
        token,
        message: `Welcome ${userPass.fullname}`,
      });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
const getAllUsers =  async (req,res)=>{
  try {
    const {token} = req.body;
    const id = decodejwt(token).userId;

    
     const users = await User.find({_id : {$ne : id}});
     return res.json({success : true , users});

    
    
  } catch (error) {
    console.log(error.message);
      res.json({ success: false, message: error.message });
  }
}
const getMe = async (req,res)=>{
  try {
  const {token} = req.body;
  const _id =decodejwt(token).userId;
  const user = await User.findById({_id});
  return res.json({success : true , user});
    
  } catch (error) {
    console.log(error.message);
      res.json({ success: false, message: error.message });
    
  }


}
module.exports = { Signup, Login , getAllUsers , getMe };
