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
const apiRoutes = require('./routes/api');
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

app.use(errorHandlers.handleError);

app.use(cors(corsOptions));

// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Start HTTPS server
https.createServer(httpsOptions, app).listen(process.env.HTTPS_PORT, () => {
  console.log('Server running on port ' + process.env.HTTPS_PORT);
});
