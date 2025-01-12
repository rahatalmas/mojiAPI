const db = require("../../config/db");
const { examsQ, candidateQ, questionQ, questionAnswerQ, resultQ } = require("../../queries/queries");
const { roles } = require("../utility/keys");

const getExamList = async (req, res) => {
    try {
        // const rolekey = req.user.key;
        // const role = roles[rolekey];
        // console.log(role);
        // if(role != "admin" && role != "editor"){
        //     res.status(401).json({"message":"Access Denied"});
        //     return;
        // }
        const [exams] = await db.query(examsQ.getList);
        exams.reverse();
        res.status(200).json(exams);
    } catch (err) {
        res.status(500).json({ "message": "Sorry! Internal Server error" });
    }
}

const getExamWithDetails = async (req, res) => {
    try {
        const examId = req.params.examId;
        const [examDetails] = await db.query(examsQ.getExamDetailsById, [examId]);
        // //create a function here to get stu
        // console.log(examDetails);
        // // Initialize the result object
        // const result = {
        //     exam_id: examDetails[0].exam_id,
        //     exam_name: examDetails[0].exam_name,
        //     exam_date: examDetails[0].exam_date,
        //     exam_location: examDetails[0].exam_location,
        //     exam_duration: examDetails[0].exam_duration,
        //     question_count: examDetails[0].question_count,
        //     candidate_count: examDetails[0].candidate_count,
        //     candidates: [],
        //     question_answers: []
        // };
        // // For candidates, we’ll track unique ones by their `scholar_id`
        // const uniqueCandidates = new Set();

        // // For correct answers (question_answers), we’ll track unique answers for each question
        // const correctAnswers = new Set();

        // examDetails.forEach(item => {
        //     // For candidate data
        //     const candidate = {
        //         serial_number: item.scholar_id,
        //         candidate_name: item.candidate_name,
        //         candidate_school: item.candidate_school,
        //         candidate_class_level: item.candidate_class_level,
        //         candidate_picture: item.candidate_picture,
        //         grade: item.grade
        //     };

        //     // Only add unique candidates by scholar_id
        //     if (!uniqueCandidates.has(item.scholar_id)) {
        //         result.candidates.push(candidate);
        //         uniqueCandidates.add(item.scholar_id);
        //     }

        //     // Handle correct answers for each question

        //     const correctAnswer = {
        //         question_number: item.question_number,
        //         correct_answer: item.correct_answer
        //     };

        //     // Add the correct answer to the question_answers array without duplication
        //     if (!correctAnswers.has(item.question_number)) {
        //         result.question_answers.push(correctAnswer);
        //         correctAnswers.add(item.question_number);
        //     }
        // })
        // console.log(result);
        // res.status(200).json(result);
        res.status(200).json(examDetails);
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

const addExam = async (req, res) => {
    try {
        const {
            exam_name,
            exam_date,
            exam_location,
            exam_duration,
            question_count,
            candidate_count
        } = req.body;
        const [result] = await db.execute(
            examsQ.addExam,
            [exam_name, exam_date, exam_location,
                exam_duration, question_count, candidate_count]
        );
        console.log(result);
        res.status(201).json({ "message": "Exam Added" });
    } catch (err) {
        console.log(err.errno);
        //mysql 1062 error code means duplicate entry >_<
        if (err.errno === 1062) {
            res.status(409).json({ "message": "Exam Name Already Exists" });
            return;
        }
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

const updateExam = async (req, res) => {
    try {
        const {
            exam_id,
            exam_name,
            exam_date,
            exam_location,
            exam_duration,
            question_count,
            candidate_count
        } = req.body;

        console.log({ exam_id, exam_name, exam_date, exam_location, exam_duration, question_count, candidate_count });

        // Convert exam_date to MySQL-compatible DATETIME format
        const formattedDate = new Date(exam_date).toISOString().slice(0, 19).replace('T', ' ');

        const [exam] = await db.query(examsQ.getSpecificById, [exam_id]);
        if (exam.length !== 1) {
            console.log("Exam Id: ", exam_id);
            console.log("No exam found with this id");
            res.status(404).json({ "message": "Exam not found" });
            return;
        }

        const result = await db.execute(
            examsQ.editExam,
            [exam_name, formattedDate, exam_location, exam_duration, question_count, candidate_count, exam_id]
        );
        console.log(result);
        res.status(204).json({ "message": "Exam data Updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Internal Server Error" });
    }
};

const deleteExam = async (req, res) => {
    try {
        console.log("Exam delete controller called: ");
        const id = req.params.id;
        console.log(id);
        const [exam] = await db.query(examsQ.getSpecificById, [id]);
        //checking exam exist or not
        if (exam.length != 1) {
            console.log("Exam Id: ", id);
            console.log("No exam found with this id");
            res.status(404).json({ "message": "Exam not found" });
            return;
        }

        //removing question answers for this exam
        console.log("removing qustion answers for this exam: ");
        const removeAnswers = await db.execute(questionAnswerQ.deleteAnswerForExam, [id]);
        console.log(removeAnswers);

        //removing results related to exam
        console.log("removing Results for this exam: ");
        const removeResults = await db.execute(resultQ.deleteAllResultForExam, [id]);
        console.log(removeResults);

        //removing candidates related to exam
        console.log("removing Candidates for this exam: ");
        const removeCandidates = await db.execute(candidateQ.deleteAllCandidateForExam, [id]);
        console.log(removeCandidates);

        //removing questions
        const removeQuestions = await db.execute(questionQ.deleteAllQuestionForExam, [id]);
        console.log(removeQuestions);

        const result = await db.execute(examsQ.deleteExam, [id]);
        console.log(result);
        res.status(204).json({ "message": "Exam Deleted" });
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ "message": "Internal Server Error" });
    }
}

module.exports = {
    getExamList,
    getExamWithDetails,
    addExam,
    deleteExam,
    updateExam
}
