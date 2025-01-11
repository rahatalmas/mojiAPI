const { verifyToken } = require("./utility/jwt");

const authCheck = (req,res,next) =>{
        const auth = req.headers['authorization'];
        const token = auth && auth.split(' ')[1];
        if(!token){
            res.status(401).json({"message":"No Authorization Token found"});
            return;
        }
        const user = verifyToken(token);
        console.log(user);
        if(!user){
            res.status(401).json({"message":"Invalid Token"});
            return;
        }
        req.user = user;
        next();
}

module.exports = {
    authCheck,
}