const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    uniqueID: { type: String, required: true, unique: true },
    sender: String,
    content: String,
    timestamp: Date,
});
  
const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;