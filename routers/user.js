const router = require('express').Router();
const {verifyTokenAndAdmin} = require('../middlewares/verifyToken');
const {getAllUsers, createUser, updateUser, deleteUser} = require('../controllers/user');

// user routes

router.get('/',verifyTokenAndAdmin, getAllUsers);
router.post('/',verifyTokenAndAdmin, createUser);
router.put('/:id',verifyTokenAndAdmin, updateUser);
router.delete('/:id',verifyTokenAndAdmin, deleteUser);

module.exports = router;