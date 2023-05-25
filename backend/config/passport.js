const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

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

module.exports = passport;
