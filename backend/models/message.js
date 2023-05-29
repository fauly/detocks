const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const MessageSchema = new mongoose.Schema({
    UID: { type: String, default: uuidv4(), required: true, unique: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    UserUID: { type: String, required: true },
    isRead: { type: Boolean, default: false },
});
  
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;