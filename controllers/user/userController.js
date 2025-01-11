const db = require("../../config/db");
const { adminsQ } = require("../../queries/queries");
const { generateHash, hashCompare } = require("../utility/hash");
const { roles } = require("../utility/keys");

//user list provider
const userList = async (req,res)=>{
    try{
        const [adminList] = await db.query(adminsQ.getList);
        res.status(200).json(adminList);
    }catch(err){
        console.log(err.message)
        res.status(500).json({"message":"Internal Server Error"});
    }
}


//individual user provider
const indiVidualUser = async (req,res) =>{
    try{
        const userId = req.params.id;
        console.log("user ID: ",userId);
        //check string or not{}
        const [result] = await db.query(adminsQ.getSpecificById,[userId]);
        console.log(result);
        res.status(200).json(result[0]);
    }catch(err){
        console.log(err.message);
        res.status(500).json({"message":"Internal Server Error"});
    }
}


//user adding : ner user registration
const addUser = async (req,res) =>{
    try{
        const {admin_username,admin_password,admin_role_key} = req.body;
        if (!admin_username || !admin_password || !admin_role_key) {
            return res.status(400).json({ "message": "Missing required fields" });
        }
        console.log("add user Post: ",{admin_username,admin_password,admin_role_key});
        const [user] = await db.query(adminsQ.getSpecificByName,[admin_username]);
        if(user.length>0 && user[0].admin_username === admin_username){
            res.status(409).json({"message":"User name already exists"});
            return;
        }
        console.log("req user: ",req.user.key)
        console.log(roles[req.user.key])

        if(roles[req.user.key] != "admin"){
            res.status(401).json({"message":"Access Denied"});
            return;
        }
        const hashedPassword = await generateHash(admin_password);
        
        let role_key = ""
        const key = admin_role_key.toLowerCase();
        console.log("role to lower: ",admin_role_key);
        if(key == "admin"){
            role_key = "admin_key";
        }else if(key == "editor"){
            role_key = "editor_key"
        }else{
            role_key = "user_key"
        }
        const result = await db.execute(adminsQ.addAdmin,[admin_username,hashedPassword,role_key]);
        console.log(result);
        res.status(201).json({"message":"New User Added"});
    }catch(err){
        console.log(err.message)
        res.status(500).json({"message":"Internal Server Error","err":err.message});
    }
}


//update admin name
const updateUserName = async (req,res)=>{
    try{
        const {admin_id,username} = req.body;
        if(!admin_id || !username){
            res.status(406).json({"message":"Invalid Request"});
            return;
        }
        console.log("update request: ",{admin_id,username});
        const [user] = await db.query(adminsQ.getSpecificById,[admin_id]);
        console.log(user.length);
        if(user.length<=0 || user.length>1){
            res.status(404).json({"message":"Invalid User Reference"});
            return;
        }else if(user[0].admin_username === username){
            res.status(409).json({"message":"username already Exist"});
            return;
        }
        const [result] = await db.execute(adminsQ.editAdminUsername,[username,admin_id]);
        console.log("update result: ",result);
        res.status(201).json({"message":"user data updated"});
    }catch(err){
        console.log(err.message)
        res.status(500).json({"message":"Internal Server Error"});
    }
}

//password update
const updateUserPassword = async (req,res)=>{
    try{
        const {admin_id,currentpassword,newpassword} = req.body;
        if(!admin_id || !currentpassword || !newpassword){
            res.status(406).json({"message":"Invalid Request"});
            return;

        }
        const [user] = await db.query(adminsQ.getSpecificById,[admin_id]);
        const match = await hashCompare(currentpassword,user[0].admin_password);
        if(user.length<=0 || user.length>1){
            res.status(404).json({"message":"Invalid User Reference"});
            return;
        }else if(!match){
            res.status(401).json({"message":"Incorrect password"});
            return;
        }
        const hashedNewPassword = await generateHash(newpassword);
        const [result] = await db.execute(adminsQ.editAdminPassword,[hashedNewPassword,admin_id]);
        res.status(200).json({"message":"user password updated"});
    }catch(err){
        console.log(err.message)
        res.status(500).json({"message":"Internal Server Error"});
    }
}

//role update
const updateUserRole = async (req,res)=>{
    try{
        const {admin_id,role} = req.body;
        if(!admin_id || !role){
            res.status(406).json({"message":"Invalid Request"});
            return;

        }
        let role_key = "";
        if(role == "admin"){
            role_key = "admin_key";
        }else if(role == "editor"){
            role_key = "editor_key"
        }else{
            role_key = "user_key"
        }
        const [user] = await db.query(adminsQ.getSpecificById,[admin_id]);
        if(user.length<=0 || user.length>1){
            res.status(404).json({"message":"Invalid User Reference"});
            return;
        }
        const [result] = await db.execute(adminsQ.editAdminRole,[role_key,admin_id]);
        console.log("update result: ",result);
        res.status(200).json({"message":"user data updated"});
    }catch(err){
        console.log(err.message)
        res.status(500).json({"message":"Internal Server Error"});
    }
}

//delete user
const deleteUser = async (req,res)=>{
    try{
        const id = req.params.id;
        console.log(id);
        const result = await db.execute(adminsQ.deleteAdmin,[id]);
        console.log(result);
        console.log("user deleted");
        res.status(204).json({"message":"User Deleted"});
    }catch(err){
        console.log(err.message)
        res.status(500).json({"message":"Internal Server Error"});
    }
}

module.exports = {
    addUser,
    userList,
    indiVidualUser,
    updateUserName,
    updateUserPassword,
    updateUserRole,
    deleteUser
}