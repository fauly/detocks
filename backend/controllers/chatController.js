const socketio = require('socket.io');
const Sphere = require('./models/sphere');

module.exports.listen = function(app) {
  io = socketio(app);

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen for chat message event
    socket.on('chat message', async (msg) => {
      // Save the message to the database
      const sphere = new Sphere({
        uniqueID: socket.id,
        username: msg.username,
        '3dVector': msg['3dVector'],
        '3dVelocity': msg['3dVelocity'],
        isConnected: true,
        isTyping: false,
        newMessages: msg.newMessages
      });

      await sphere.save();

      // Emit the message to all clients
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};
