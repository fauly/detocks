const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/messages', authMiddleware.ensureAuth, (req, res) => {
    const { message, username } = req.body;
  
    // TODO: Add logic for creating a new message entry in the database
    // TODO: Add logic for updating the sphere entry for the user
  
    chatController.handleNewMessage;

    res.status(200).send('Message received');
});
  
module.exports = router;
