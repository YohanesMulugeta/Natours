/* eslint-disable prefer-arrow-callback */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    minLength: [3, 'The name must be a minimum of 3 character long'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a user'],
    unque: [true, 'There is a use with this email.'],
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: 'Email must be valid',
    },
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: [6, 'Password must be a minimum of 6 char lenght.'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Users must confirm their password.'],
    validate: {
      validator: function (conPass) {
        return this.password === conPass;
      },
      message: 'ConfirmPassword has to be the same as the password.',
    },
  },
  passwordChangedAt: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guid'],
    default: 'user',
  },
  passwordResetToken: String,
  passwordResetExpires: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isnew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // 1) Encrypt password
  this.password = await bcrypt.hash(this.password, 12);

  // 2) remove the password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.isPasswordChangedAfter = function (tokenIssueDate) {
  if (!this.passwordChangedAt) return false;

  return tokenIssueDate > +this.passwordChangedAt;
};

userSchema.methods.isCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
