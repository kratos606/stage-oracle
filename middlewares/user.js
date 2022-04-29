const oracledb = require('oracledb');
const dbConfig = require('../config/database.config.js');

// Check if user already exists

const AlreadyExists = async(email) => {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT count(*) FROM users WHERE email = :email",{ email: email });
    if(result.rows[0][0]>0) return true
    return false;
}

const AlreadyExistsForUpdate = async(email,id) => {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT count(*) FROM users WHERE email = :email AND user_id != :id",{ email: email, id: id });
    if(result.rows[0][0]>0) return true
    return false;
}

module.exports = {AlreadyExists,AlreadyExistsForUpdate};