const express = require('express');
const { login } = require('../controllers/login');
const { authCheck } = require('../controllers/middlewares');
const { userList,
        addUser, 
        deleteUser,
        indiVidualUser,
        updateUserName,
        updateUserPassword,
        updateUserRole,
        
} = require('../controllers/user/userController');

const userRouter = express.Router()

userRouter.post("/login",login);

//checkpost alert
userRouter.use(authCheck);

userRouter.get("/list",userList);
userRouter.get("/list/:id",indiVidualUser);
userRouter.post("/register",addUser);
userRouter.put("/update/name",updateUserName);
userRouter.put("/update/password",updateUserPassword);
userRouter.put("/update/role",updateUserRole);
userRouter.delete("/delete/:id",deleteUser);

module.exports = userRouter;
