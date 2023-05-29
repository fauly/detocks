const mongoose = require('mongoose');
const Message = require('./message');

const SphereSchema = new mongoose.Schema({
  uniqueID: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  Position: {
    x: Number,
    y: Number,
    z: Number,
  },
  Velocity: {
    x: Number,
    y: Number,
    z: Number,
  },
  isConnected: Boolean,
  isTyping: Boolean,
  newMessages: [Message.schema],
});

const Sphere = mongoose.model('Sphere', SphereSchema);

module.exports = Sphere;