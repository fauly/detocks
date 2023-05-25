require('dotenv').config();

const http = require('http');
const https = require('https');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const { body, check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');

// Error Catching

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
  process.exit(1);
});

process.on('uncaughtException', (err, origin) => {
  console.error(`Caught exception: ${err}\n` +
                `Exception origin: ${origin}`);
  process.exit(1);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

// Create a new Express application
const app = express();

app.use(express.json());


// Set up HTTPS server options
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  }
}));

// Set up Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up Passport local strategy
passport.use(new LocalStrategy(
    async function(username, password, done) {
      try {
        const user = await User.findOne({ username });
        if (!user) return done(null, false);
  
        user.comparePassword(password, (err, isMatch) => {
          if (err) return done(err);
          if (isMatch) return done(null, user);
          else return done(null, false);
        });
      } catch (err) {
        return done(err);
      }
    }
));
  
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
  
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', code: 'internal_error', message: err.message });
});

const corsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.post('/login', [
  body('usernameOrEmail').trim().notEmpty().withMessage('Username or email is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
], async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  const { usernameOrEmail, password } = req.body;
  
  const isEmail = /\S+@\S+\.\S+/.test(usernameOrEmail);

  let user;

  if (isEmail) {
    user = await User.findOne({ email: usernameOrEmail });
  } else {
    user = await User.findOne({ username: usernameOrEmail });
  }

  if (!user) return res.status(400).json({ errors: ['Invalid username or password'] });


  user.comparePassword(password, (err, isMatch) => {
    if (err) return next(err);
    if (!isMatch) return res.status(400).json({ errors: ['Invalid username or password'] });

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      
      // Create a token
      try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, id: user._id });
      } catch (err) {
        console.error('JWT signing error:', err);
        return res.status(500).json({ status: 'error', code: 'jwt_error', message: err.message });
      }
    });
  });
});

app.post('/register', 
[ 
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
],
async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  const { username, email, password } = req.body;
  
  try {
    // Ensure user doesn't already exist
    const existingUser = await User.findOne({ username, email });
    if (existingUser) {
      return res.status(409).json({ status: 'error', code: 'user_exists', message: 'Username or email already exists.' });
    }

    const user = new User({
      email, username, password
    });
  
    try {
      const savedUser = await user.save();
    } catch (err) {
      if (err.code === 11000) {
        // This is a duplicate key error
        return res.status(400).json({ status: 'error', code: 'duplicate_key', message: 'Username or email already exists.' });
      }
      // If it's not a duplicate key error, we pass it on to be handled by the global error handler
      next(err);
    }
    
    // Automatically login the user after register
    req.login(user, function(err) {
      if (err) { return next(err); }
    
      // Send the token
      try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, id: user._id, status: 'success', code: 'registered' });
      } catch (err) {
        console.error('JWT signing error:', err);
        return res.status(500).json({ status: 'error', code: 'jwt_error', message: err.message });
      }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/logout', function(req, res){
  req.session.destroy(function(err) {
    if(err){
      return res.status(500).json({ status: 'error', code: 'logout_failed' });
    } 
    return res.status(200).json({ status: 'success', code: 'logged_out' });
  });
});


const httpsoptions = {
  key: fs.readFileSync('../ssl/private.key'),
  cert: fs.readFileSync('../ssl/certificate.crt')
};

// Start HTTPS server
https.createServer(httpsoptions, app).listen(5000, () => {
  console.log('Server running on port 5000');
});

