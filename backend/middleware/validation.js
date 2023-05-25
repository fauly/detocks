// validation.js

const { body, check, validationResult } = require('express-validator');

const loginValidation = [
  body('usernameOrEmail').trim().notEmpty().withMessage('Username or email is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

const registerValidation = [
  check('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  check('username')
    .trim()
    .escape()
    .isLength({ min: 3, max: 16 }).withMessage('Username must be at least 3 characters long, but shorter than 16')
    .matches(/^[a-zA-Z0-9]+$/).withMessage('Username can only contain alphanumeric characters'),
  check('password')
    .trim()
    .escape()
    .isLength({ min: 8, max : 16}).withMessage('Password must be at least 8 characters long, but shorter than 16')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

module.exports = {
  loginValidation,
  registerValidation,
  validate
};
