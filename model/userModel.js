const mongoose = require('mongoose');
const validator = require('validator');

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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
