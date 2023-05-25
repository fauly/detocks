// Error Catching
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
  
  process.on('uncaughtException', (err, origin) => {
    console.error(`Caught exception: ${err}\n` +
                  `Exception origin: ${origin}`);
    process.exit(1);
  });
  
  exports.handleError = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', code: 'internal_error', message: err.message });
  };
  