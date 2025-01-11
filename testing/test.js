const bcrypt = require('bcrypt');
const saltRounds = 10;

const getSalt = async () => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        console.log(salt)
        return salt;
    } catch (err) {
        console.log("Salt generation error: ", err);
        throw err;
    }
};

data = '111111';

const generateHash = async (data) => {
    try {
        console.log("Hash function called");
        const salt = await getSalt();
        console.log("Generated salt:", salt);
        const hashedPassword = await bcrypt.hash(data, salt);
        console.log("Hashed password:", hashedPassword);
        return hashedPassword;
    } catch (err) {
        console.log("Error in hashing process:", err.message);
        throw err;
    }
};

generateHash(data);