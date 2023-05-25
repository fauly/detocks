const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    lastLogin: Date,
    role: { type: String, default: 'user' }, // 'user', 'admin', etc.
  });

UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

UserSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
