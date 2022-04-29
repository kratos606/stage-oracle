const bcrypt = require('bcrypt');
async function verifyPassword(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
};
async function encryptPassword(password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
module.exports = {verifyPassword,encryptPassword};