const db = require('../config/db');
const {generateHash,hashCompare} = require('../controllers/utility/hash');
const {generateAccessToken,generateRefreshToken} = require('../controllers/utility/jwt');
const { adminsQ } = require('../queries/queries');
const { keys, roles } = require('./utility/keys');
//const hashedpassword = await generateHash(password) //123456$
//const hashpassword = "$2b$10$ydta7s1xfVGt4Gkt8qLdGOBcobbO21blY1Wxl.YPMBhExc6X4pT/."

const login = async (req,res)=>{
    try{
        console.log("user agent ",req.headers['user-agent']);
        const {username,password} = req.body
        console.log(username,password);
        const [user] = await db.query(adminsQ.getCredentialsByName,[username]);
        console.log(user[0]);
        if(user.length<1){
            console.log("username: ",username)
            res.status(404).json({"message":"No User Found"});
            return;
        }

        const result = await hashCompare(password,user[0].admin_password);
        console.log("pass: ",result);
        if(!result){
            res.status(401).json({"message":"Incorrect Password"})
            return;
        }

        const accesstoken = generateAccessToken({ username: username, key: user[0].admin_role_key });
        const refreshtoken = generateRefreshToken({ username: username, key: user[0].admin_role_key });
        //console.log("Access Token: ",accesstoken);
        //console.log("Access Token: ",refreshtoken);
        res.cookie('refreshToken',refreshtoken,{
            httpOnly:true,
            secure:true,
            //secure: process.env.NODE_ENV === 'production',  // Only sent over HTTPS in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
            sameSite: 'Strict'
        });
        
        const role = roles[user[0].admin_role_key];
        console.log("role: ",role);
        let permissions;
        if(role == "admin"){
            permissions = 1;
        }else if(role == "editor"){
            permissions = 2;
        }else{
            permissions = 3;
        }
        res.status(200).json({
            "message":"Login Successful",
            "username":username,
            "accesstoken":accesstoken,
            "permission":permissions,
        })
    }catch(err){
        console.log("loging err ", err)
        res.status(500).json({ message: 'Server error. Please try again later.' });
        return;
    }
}

module.exports = {
    login
}