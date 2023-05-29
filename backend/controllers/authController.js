const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Sphere = require('../models/sphere'); 
const { v4: uuidv4 } = require('uuid');


exports.login = async (req, res, next) => {
  // Validation is done by middleware before reaching here

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
        const token = jwt.sign({ UID: user.uniqueID }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, UID: user.uniqueID });
      } catch (err) {
        console.error('JWT signing error:', err);
        return res.status(500).json({ status: 'error', code: 'jwt_error', message: err.message });
      }
    });
  });
};

exports.register = async function (req, res, next) {
  // Validation is done by middleware before reaching here

  const { username, email, password } = req.body;
  
  try {
    // Ensure user doesn't already exist
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ status: 'error', code: 'user_exists', message: 'Username or email already exists.' });
    }

    const thisUniqueID = uuidv4();
    const user = new User({ email:email, username:username, password:password, uniqueID: thisUniqueID });
  
    const sphere = new Sphere({ username: username, uniqueID: thisUniqueID });

    try {
      await user.save();
      // Save the sphere to the database
      await sphere.save();
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
        const token = jwt.sign({ UID: user.uniqueID }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, UID: user.uniqueID, status: 'success', code: 'registered' });
      } catch (err) {
        console.error('JWT signing error:', err);
        return res.status(500).json({ status: 'error', code: 'jwt_error', message: err.message });
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle error
      console.error(err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    // Destroy session after logging out
    req.session.destroy((err) => {
      if (err) {
        // Handle error
        console.error(err);
        return res.status(500).json({ message: 'Error destroying session' });
      }
      // Respond to client
      res.clearCookie('connect.sid');
      return res.json({ message: 'You are now logged out!' });
    });
  });
};