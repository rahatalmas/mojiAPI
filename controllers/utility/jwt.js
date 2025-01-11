const jwt = require('jsonwebtoken')
const SECRET_KEY = "moji omr secret token secret"; // for HMAC algo
//const PRIVATE_KEY = 100; // for RSA algo

const verifyToken = (token)=>{
    console.log("jwt verify function called");
    try{
        result = jwt.verify(token,SECRET_KEY);
        console.log("Verification result: ",result);
        return result;
    }catch(err){
        console.log("Token Verification error: ",err.message);
        return null;
    }
}

const generateAccessToken = (data) =>{
    console.log("Access token generator called")
    try{
        const token = jwt.sign(data,SECRET_KEY,{expiresIn:'7d',algorithm:'HS512'});
        return token
    }catch(err){
        console.log("Token generation error: ",err);
    }
}

const generateRefreshToken = (data) =>{
    console.log("Refresh token generator called");
    try{
        const refreshToken = jwt.sign(data,SECRET_KEY,{expiresIn:'15d',algorithm:'HS512'});
        return refreshToken;
    }catch(err){
        console.log("Refresh token error: ",err);
    }
}

module.exports = {
    verifyToken,
    generateAccessToken,
    generateRefreshToken
}