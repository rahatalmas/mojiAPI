const adminsQ = {
    getList: "SELECT admin_id,admin_username,admin_role_key FROM admins",
    getSpecificById:"SELECT admin_id,admin_username,admin_role_key FROM admins WHERE admin_id=?",
    getSpecificByName:"SELECT admin_id,admin_username,admin_role_key FROM admins WHERE admin_username=?",
    getCredentialsByName:"SELECT admin_password,admin_role_key FROM admins WHERE admin_username=?",
    addAdmin: `INSERT INTO admins 
                   (admin_username, admin_password, admin_role_key)
                VALUES
                   (?, ?, ?);`,
    editAdminUsername: `UPDATE admins SET admin_username=? WHERE admin_id=?`,
    editAdminPassword: `UPDATE admins SET admin_password=? WHERE admin_id=?`,
    editAdminRole: `UPDATE admins SET admin_role_key=? WHERE admin_id=?`,
    deleteAdmin: `DELETE FROM admins WHERE admin_id=?`
}

const examsQ = {
    getList: "SELECT * FROM exams",
    getSpecificById:"SELECT * FROM exams WHERE exam_id=?",
    getExamDetailsById: 
    `
            SELECT 
            e.exam_id,
            e.exam_name,
            e.exam_date,
            e.exam_location,
            e.exam_duration,
            e.question_count,
            e.candidate_count,
            
            c.serial_number,
            c.candidate_name,
            c.school_name AS candidate_school,
            c.class_level AS candidate_class_level,
            c.candidate_picture,
            c.scholar_id,
            
            qa.question_number,
            qa.correct_answer,
            
            r.correct_answers,
            r.incorrect_answers,
            r.grade
        FROM exams e
        LEFT JOIN candidates c ON e.exam_id = c.exam_id
        LEFT JOIN scholars s ON c.scholar_id = s.scholar_id
        LEFT JOIN question_answers qa ON e.exam_id = qa.exam_id
        LEFT JOIN results r ON e.exam_id = r.exam_id AND c.serial_number = r.serial_number
        WHERE e.exam_id=?;

    `,
    addExam: `INSERT INTO exams
                  (exam_name, exam_date, exam_location, exam_duration, question_count, candidate_count)
              VALUES 
                  (?, ?, ?, ?, ?, ?);`,
    editExam: `UPDATE exams SET 
              exam_name=?, exam_date=?, exam_location=?, exam_duration=?, question_count=?, candidate_count=?
              WHERE exam_id=?`,
    deleteExam: `DELETE FROM exams WHERE exam_id=?`
}

const scholarQ = {
    getList: "SELECT * FROM scholars",
    getFilteredList:`
    SELECT * 
    FROM scholars 
    WHERE scholar_id NOT IN (
        SELECT c.scholar_id 
        FROM candidates c
        JOIN exams e ON c.exam_id = e.exam_id
        WHERE e.exam_id = ?
    )`,
    getSpecificById:"SELECT * FROM scholars WHERE scholar_id=?",
    addScholar: `INSERT INTO scholars
                  (scholar_name, scholar_school, class_level)
              VALUES 
                  (?, ?, ?);`,
    editScholar: `UPDATE scholars SET 
              scholar_name=?, scholar_school=?, class_level=?
              WHERE scholar_id=?`,
    deleteScholar: `DELETE FROM scholars WHERE scholar_id=?`
}

//modifying (for adding candidate i need to check the candidate id and serial nubmer composite key dattebayo)
const candidateQ = {
    getList: "SELECT * FROM candidates WHERE exam_id=?",
    getCandidateCount: "SELECT COUNT(*) AS candidate_count FROM candidates WHERE exam_id=?",
    getCandidateBySerialNumber:"SELECT * FROM candidates WHERE serial_number=? AND exam_id=?",
    addCandidate: `INSERT INTO candidates
                  (serial_number, candidate_name, school_name, class_level, scholar_id, exam_id)
              VALUES 
                  (?, ?, ?, ?, ?, ?);`,
    deleteCandidate: "DELETE FROM candidates WHERE serial_number=? AND exam_id=?",
    deleteCandidateByScholarId: "DELETE FROM candidates WHERE scholar_id=?",
    deleteAllCandidateForExam: "DELETE FROM candidates WHERE exam_id=?"
}

//incomplete
const questionQ = {
    getList:"",
    getQuestionCount:"",
    addQuestion:"",
    deleteQuestion:"",
    deleteAllQuestionForExam:"DELETE FROM questions WHERE exam_id=?",
}

//result queries
const resultQ = {
    getAllResult: "SELECT * FROM results WHERE exam_id=?",
    getAllResultWithExamAndCandidate:
    `  SELECT 
            e.exam_id,
            e.exam_name,
            e.exam_date,
            e.exam_location,
            e.exam_duration,
            e.question_count,
            e.candidate_count,
            c.serial_number,
            c.candidate_name,
            c.school_name,
            c.class_level,
            c.candidate_picture,
            c.scholar_id,
            r.correct_answers,
            r.incorrect_answers,
            r.grade
        FROM 
            exams e
        INNER JOIN 
            candidates c ON e.exam_id = c.exam_id
        INNER JOIN 
            results r ON e.exam_id = r.exam_id AND c.serial_number = r.serial_number;
    `,
    getMyResult: "SELECT * FROM results WHERE exam_id=? AND serial_number=?",
    addResult: `INSERT INTO results
                  (exam_id, serial_number, correct_answers, incorrect_answers, grade)
              VALUES 
                  (?, ?, ?, ?, ?);`,
    deleteAllResultForExam: "DELETE FROM results WHERE exam_id=?",
    deleteResultForCandidate: "DELETE FROM results WHERE exam_id=? AND serial_number=?",
    updateCandidateResult: `UPDATE results SET 
    correct_answers=?, incorrect_answers=?, grade=?
    WHERE exam_id=? AND serial_number=?`,
}

//question answer queries
const questionAnswerQ = {
    getQuestionCount: "SELECT COUNT(*) AS question_count FROM question_answers WHERE exam_id=? AND question_set_id=?",
    getAllAnswer: "SELECT * FROM question_answers WHERE exam_id=?",
    addAnswer: `INSERT INTO question_answers
                  (exam_id, question_set_id, question_number, correct_answer)
              VALUES 
                  (?, ?, ?, ?);`,
   
    deleteAnswerForExam: "DELETE FROM question_answers WHERE exam_id=?",
    updateQuestionAnswer: `UPDATE question_answers SET correct_answer=?
    WHERE exam_id=? AND question_set_id=? AND question_number=?`,
}

const candidateAnswerQ = {/*future implementation*/}

module.exports = {
    adminsQ,
    examsQ,
    scholarQ,
    candidateQ,
    resultQ,
    questionAnswerQ,
    questionQ
}