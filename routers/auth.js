const router = require('express').Router();
const {loginController,checkAuthController,logoutController} = require('../controllers/auth');

// Authentication routes

router.post('/login', loginController);
router.get('/check', checkAuthController);
router.get('/logout', logoutController);

module.exports = router;