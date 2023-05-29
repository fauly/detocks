const socketio = require('socket.io');

module.exports.listen = function(app) {
  const io = socketio(app, {
    cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST"], // Allow GET and POST requests
      credentials: true // Allow credentials (cookies, authorization headers, TLS client certificates, etc.)
    }
  });
  io.on('connection', (socket) => {
    console.log('New connection');

    socket.on('sendMessage', (message, callback) => {
        console.log(message);
        
        io.emit('message', { user: 'user', text: message });
        callback(); // This will clear the message text box in the client's UI
    });

    socket.on('disconnect', () => {
      console.log('User had left');
    });
  });

  return io;
};
