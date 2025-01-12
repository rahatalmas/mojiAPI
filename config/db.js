const mysql = require('mysql2');

const dbConfig = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'moji_main',
    connectionLimit: 10 
});

const db = dbConfig.promise();

async function checkConnection() {
    try {
        const [rows] = await db.execute('SELECT 1');
        console.log('MySQL connection is successful!');
    } catch (error) {
        console.error('Error connecting to MySQL:', error.message);
        process.exit(1);
    }
}

checkConnection();

module.exports = db;
