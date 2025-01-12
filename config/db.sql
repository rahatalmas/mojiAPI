CREATE TABLE IF NOT EXISTS admins (
    admin_id INT NOT NULL AUTO_INCREMENT,
    admin_username VARCHAR(50),
    admin_password VARCHAR(255),
    admin_role_key VARCHAR(255),
    PRIMARY KEY (admin_id)
);

CREATE TABLE IF NOT EXISTS exams (
    exam_id INT NOT NULL AUTO_INCREMENT,
    exam_name VARCHAR(255) NOT NULL,
    exam_date DATETIME NOT NULL,
    exam_location VARCHAR(255) NOT NULL,
    exam_duration INT NOT NULL,
    question_count INT NOT NULL,
    candidate_count INT NOT NULL,
    UNIQUE (exam_name),
    PRIMARY KEY (exam_id)
);

CREATE TABLE IF NOT EXISTS candidates (
    serial_number INT NOT NULL,
    candidate_name VARCHAR(100) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    class_level VARCHAR(25) NOT NULL,
    candidate_picture VARCHAR(255),
    scholar_id INT NOT NULL,
    exam_id INT NOT NULL,
    PRIMARY KEY(serial_number,exam_id),
    CONSTRAINT fk_exam_candidates FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scholars(
    scholar_id INT NOT NULL AUTO_INCREMENT,
    scholar_name VARCHAR(100) NOT NULL,
    scholar_school VARCHAR(255) NOT NULL,
    class_level VARCHAR(25) NOT NULL,
    scholar_picture VARCHAR(255),
    PRIMARY KEY(scholar_id)
);

CREATE TABLE IF NOT EXISTS question_answers (
    exam_id INT NOT NULL,
    question_set_id INT NOT NULL,
    question_number INT NOT NULL,
    correct_answer INT NOT NULL,
    PRIMARY KEY (exam_id, question_set_id,question_number),
    CONSTRAINT fk_exam_answer_set FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS results (
    exam_id INT NOT NULL,
    serial_number INT NOT NULL,
    correct_answers INT NOT NULL CHECK (correct_answers >= 0),
    incorrect_answers INT NOT NULL CHECK (incorrect_answers >= 0),
    grade VARCHAR(20) NOT NULL,
    PRIMARY KEY (exam_id,serial_number),
    CONSTRAINT fk_candidate FOREIGN KEY (serial_number) REFERENCES candidates(serial_number) ON DELETE CASCADE,
    CONSTRAINT fk_exam_result FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);

