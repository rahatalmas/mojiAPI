const express = require('express');
const { getAllAnswer, addAnswer, updateAnswer, deleteAnswers } = require('../controllers/answer/answerController');
const answerRouter = express.Router();

answerRouter.get("/all/:examId",getAllAnswer);
answerRouter.post("/add",addAnswer);
answerRouter.put("/update",updateAnswer);
answerRouter.delete("/delete/:examId",deleteAnswers);

module.exports = answerRouter;