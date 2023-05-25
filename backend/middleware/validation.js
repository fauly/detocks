const { body, validationResult } = require('express-validator');

exports.validateLogin = [
  body('usernameOrEmail').trim().notEmpty().withMessage('Username or email is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    next();
  }
];

exports.validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('username')
    .trim()
    .escape()
    .isLength({ min: 3, max: 16 }).withMessage('Username must be at least 3 characters long, but shorter than 16')
    .matches(/^[a-zA-Z0-9]+$/).withMessage('Username can only contain alphanumeric characters'),
  body('password')
    .trim()
    .escape()
    .isLength({ min: 8, max : 16}).withMessage('Password must be at least 8 characters long, but shorter than 16')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    next();
  }
];
