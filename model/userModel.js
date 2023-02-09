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
    select: false,
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
    default: 'user',
    enum: ['user', 'admin', 'guide', 'lead-guide'],
  },
  passwordResetToken: String,
  passwordResetExpires: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 3000;

  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // 1) Encrypt password
  this.password = await bcrypt.hash(this.password, 12);

  // 2) remove the password confirm field
  this.passwordConfirm = undefined;
  this.passwordResetExpires = undefined;
  this.passwordResetToken = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to query object
  this.find({ active: { $ne: false } });

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

  return +tokenIssueDate < +this.passwordChangedAt;
};

userSchema.methods.isCorrect = async function (candidatePassword) {
  console.log(this.password);
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
