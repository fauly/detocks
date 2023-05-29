const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    UID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    sphereId: { type: String, required: true },
    isRead: { type: Boolean, default: false },
});
  
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;