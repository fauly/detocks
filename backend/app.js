require('dotenv').config();

// Web Imports

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const https = require('https');

// Own Imports

const passport = require('./config/passport');
const db = require('./config/db');
const errorHandlers = require('./middleware/errorHandlers');
const corsOptions = require('./middleware/corsOptions');
const authRoutes = require('./routes/auth');
const httpsOptions = require('./utils/httpsOptions');

// Connect to MongoDB
db.connect();

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

app.use(errorHandlers);

app.use(cors(corsOptions));

// Routes
app.use('/auth', authRoutes);

// Start HTTPS server
https.createServer(httpsOptions, app).listen(5000, () => {
  console.log('Server running on port 5000');
});
