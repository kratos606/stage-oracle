require('dotenv').config();

dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.CONNECTION_STRING,
}

module.exports = dbConfig;