const oracledb = require('oracledb');
const { AlreadyExists,AlreadyExistsForUpdate } = require('../middlewares/user')
const { encryptPassword } = require('../middlewares/password')
const dbConfig = require('../config/database.config.js');

// Get All Users

const getAllUsers = async (req, res) => {
    try{
        let users = new Array();
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("SELECT * FROM users where user_id != :id",{id:req.user.id});
        result.rows.forEach((item) => {
            let user = new Object();
            user.id = item[0];
            user.username= item[1];
            user.email= item[2];
            user.isAdmin = item[4]===1 ? true : false;
            users.push(user);
        });
        res.json(users);
        if(connection){
            connection.close();
        }
    }catch(error) {
        res.json({ error: error.message });
    }
}

// Create a new user

const createUser = async (req, res) => {
    try{
        const { username,email,password,isAdmin } = req.body;
        if(!username || !email || !password || !(isAdmin.toString())) return res.json({ error: "You must fill all required fields" })
        if(await AlreadyExists(email)) return res.json({ error: "User already exists" })
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("INSERT INTO users (username,email,password,isAdmin) VALUES (:username,:email,:password,:isAdmin) RETURN user_id INTO :id",
        {
            username: username,
            email: email,
            password: await encryptPassword(password),
            isAdmin: (isAdmin) ? 1 : 0,
            id : {type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        });
        await connection.commit();
        res.json({success:"User successfully created!"});
        if(connection){
            connection.close();
        }
    }catch(error) {
        res.json({ error: error.message });
    }
}

// Update a user

const updateUser = async (req, res) => {
    try{
        const { username,email,password,isAdmin } = req.body;
        if(!username || !email || !password || !isAdmin.toString()) return res.json({ error: "You must fill all required fields" })
        if(await AlreadyExistsForUpdate(email,req.params.id)) return res.json({ error: "User already exists" })
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("UPDATE users SET username = :username, email = :email, password = :password, isAdmin = :isAdmin WHERE user_id = :id",
        {
            username: req.body.username,
            email: req.body.email,
            password: password,
            isAdmin: isAdmin ? 1 : 0,
            id : req.params.id
        });
        await connection.commit();
        res.json({success:"User successfully updated!"});
        if(connection){
            connection.close();
        }
    }catch(error) {
        console.log(error);
        res.json({ error: error.message });
    }
}

// Delete a user

const deleteUser = async(req, res) => {
    try{
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("DELETE FROM users WHERE user_id = :id",
        {
            id : req.params.id
        });
        await connection.commit();
        res.json({success:"User successfully deleted!"});
        if(connection){
            connection.close();
        }
    }catch(error) {
        res.json({ error: error.message });
    }
}

module.exports = {getAllUsers, createUser, updateUser, deleteUser};