const oracledb = require('oracledb');
const dbConfig = require('../config/database.config.js');

// Get all histories

const getAllHistories = async (req, res) => {
    try{
        let histories = new Array();
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("SELECT history_date,action,history_data,history.user_id,users.username,users.email,users.isAdmin FROM history INNER JOIN users ON users.user_id = history.user_id ORDER BY history_date DESC");
        result.rows.forEach((item) => {
            let history = new Object();
            history.history_date = item[0];
            history.action = item[1];
            history.history_data = JSON.parse(item[2]);
            history.user= {user_id: item[3], username: item[4], email: item[5],isAdmin: item[6]};
            histories.push(history);
        });
        res.json(histories);
        if(connection){
            connection.close();
        }
    }catch(error) {
        res.json({ error: error.message });
    }
}

// create a new history

const createHistory = async(action,history_data,user_id) => {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("INSERT INTO history (action,history_data,user_id) VALUES (:action,:history_data,:user_id)",
    {
        action: action,
        history_data: history_data,
        user_id: user_id
    });
    connection.commit();
    if(connection){
        connection.close();
    }
}

module.exports = {getAllHistories,createHistory};