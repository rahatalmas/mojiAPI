const db = require("../../config/db");
const { questionAnswerQ, examsQ } = require("../../queries/queries");

//All result for a exam
const getAllAnswer = async (req, res) => {
    console.log("All answer Controller: ");
    const examId = req.params.examId;
    console.log("ExamId: ", examId);
    try {
        const [result] = await db.query(questionAnswerQ.getAllAnswer, [examId]);
        console.log([result]);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

//add answer
const addAnswer = async (req, res) => {
    console.log("Adding Answer: ");
    const { exam_id, question_set_id, question_number, correct_answer } = req.body;

    //getting exam
    const [exam] = await db.query(examsQ.getSpecificById, exam_id);
    console.log("Answer Add Request for examId: ", exam);
    if (exam.length == 0) {
        console.log("No Exam found with this ID: " + exam_id);
        res.status(404).json({ "message": "No Exam Found" });
        return;
    }

    //getting question count
    const totalQuestions = exam[0].question_count;
    console.log("Total Questions: ", totalQuestions);

    //getting filled answer counts 
    const [count] = await db.query(questionAnswerQ.getQuestionCount, [exam_id,question_set_id]);
    const questionCount = count[0].question_count;
    console.log("question count :", questionCount);

    //validation for sits available or not
    if (questionCount == totalQuestions) {
        res.status(406).json({ "message": "All Questions are filled" });
        return;
    }

    console.log("Answers: ", exam_id, question_set_id, question_number, correct_answer);
    try {
        const [result] = await db.execute(questionAnswerQ.addAnswer, [exam_id, question_set_id, question_number, correct_answer]);
        console.log([result]);
        res.status(201).json({ "message": "New Answer Added" });
    } catch (err) {
        console.log(err);
        if(err.errno == 1062){
            res.status(500).json({ "message": "Duplicate Entry" });
            return;
        }
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

//update answer
const updateAnswer = async (req, res) => {
    console.log("Updating answer: ");
    const { exam_id, question_set_id, question_number, correct_answer } = req.body;
    console.log("answer: ", exam_id, question_set_id, question_number, correct_answer);
    try {
        const [result] = await db.execute(questionAnswerQ.updateQuestionAnswer, [correct_answer, exam_id, question_set_id, question_number]);
        console.log([result]);
        res.status(201).json({ "message": "Answer Updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

//delete answer
const deleteAnswers = async (req, res) => {
    console.log("Delete Answer: ");
    const examId = req.params.examId;
    console.log("ExamId: ", examId);
    try {
        const [result] = await db.execute(questionAnswerQ.deleteAnswerForExam, [examId]);
        console.log([result]);
        res.status(204).json({ "message": "Results Deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

module.exports = {
    getAllAnswer,
    addAnswer,
    updateAnswer,
    deleteAnswers,
}