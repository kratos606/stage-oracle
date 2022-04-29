const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { verifyPassword } = require('../middlewares/password');
const oracledb = require('oracledb');
const dbConfig = require('../config/database.config.js');

// Loging Validation

const loginValidation = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
});

// Loging Controller

const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) return res.json({ error: "You must fill all required fields" });
        const { error } = loginValidation.validate(req.body);
        if(error) return res.json({error : error.details[0].message});
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("select JSON_OBJECT('id' is user_id, 'username' is username,'email' is email,'password' is password,'isAdmin' is isAdmin) from users WHERE email = :email fetch first 1 rows only", {email});
        if(result.rows.length === 0) return res.json({error : "Invalid email or password"});
        const user = JSON.parse(result.rows[0]);
        const isPasswordValid = await verifyPassword(password, user.password);
        if(!isPasswordValid) return res.json({error : "Invalid email or password"});
        const token = jwt.sign({id:user.id,isAdmin:(user.isAdmin===1 ? true : false)}, process.env.JWT_SECRET_KEY);
        let currentUser = (({ password, ...user }) => user)(user);
        currentUser.isAdmin = (user.isAdmin===1 ? true : false);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).send({currentUser});
    } catch (error) {
        console.log(error);
        res.json({ error: error.message });
    }
}

// Check Authentication Controller

const checkAuthController = async(req, res) => {
    let currentUser;
    if (req.cookies.token) {
        const token = req.cookies.token;
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute("select JSON_OBJECT('id' is user_id, 'username' is username,'email' is email,'isAdmin' is isAdmin) from users WHERE user_id = :user_id fetch first 1 rows only", {user_id:decoded.id});
        const user = JSON.parse(result.rows[0]);
        currentUser = (({ password, ...user }) => user)(user);
        currentUser.isAdmin = (user.isAdmin===1 ? true : false);
      } else {
        currentUser =  null;
      }    
    res.send({ currentUser });
}

// Logout Controller

const logoutController = async(req, res) => {
    res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send();
}

module.exports = {loginController,checkAuthController,logoutController};