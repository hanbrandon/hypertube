const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  googleId: {
    type: String,
    required: false
  },
  facebookId: {
    type: String,
    required: false
  }, 
  fortytwoId: {
    type: String,
    required: false
  },
  slackId: {
    type: String,
    required: false
  },
  resetToken: {
    type: String,
    required: false
  },
  watchedImdb: {
    type: Array,
    required: false
  }
});
module.exports = User = mongoose.model("users", UserSchema);