require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const dbConnect = require('./config/db');
const errorHandlers = require('./middleware/errorHandlers');
const corsOptions = require('./middleware/corsOptions');
const fs = require('fs');
const https = require('https');

// Connect to MongoDB
dbConnect();

const app = express();
app.use(express.json());

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

app.use(passport.initialize());
app.use(passport.session());

app.use(errorHandlers);

app.use(cors(corsOptions));

app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/logout', require('./routes/logout'));

const httpsoptions = {
  key: fs.readFileSync('../ssl/private.key'),
  cert: fs.readFileSync('../ssl/certificate.crt')
};

https.createServer(httpsoptions, app).listen(5000, () => {
  console.log('Server running on port 5000');
});
