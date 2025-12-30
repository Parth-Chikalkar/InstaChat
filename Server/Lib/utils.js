const jwt = require('jsonwebtoken');

 const genToken = (userId)=>{
  const token = jwt.sign({userId},process.env.JWT_SECRET_KEY);
  return token;
}

const decodejwt = (tok)=>{
  const decode = jwt.decode(tok);
  return decode;
}

module.exports = {genToken  , decodejwt};