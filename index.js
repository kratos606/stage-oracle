const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000'
}))
app.use(bodyParser.json());
app.use(cookieParser());

// use Routes

const auth = require('./routers/auth');
app.use('/auth', auth);
const user = require('./routers/user');
app.use('/user', user);
const plan = require('./routers/plan');
app.use('/plan', plan);
const history = require('./routers/history');
app.use('/history', history);

app.listen(process.env.PORT,() => {
    console.log('Listening on port ' + process.env.PORT)
})