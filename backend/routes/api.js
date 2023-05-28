const express = require('express');
const router = express.Router();
const validation = require('../middleware/validation');

router.get('/check-username', validation.usernameAvailable)

module.exports = router;
