const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');

router.post('/login', validation.validateLogin, authController.login);
router.post('/register', validation.validateRegister, authController.register);
router.get('/logout', authController.logout);

module.exports = router;
