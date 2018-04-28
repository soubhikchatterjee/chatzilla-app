const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String
  },
  location: {
    type: String
  },
  timezone: {
    type: String,
    default: "GMT-0"
  },
  status_message: {
    type: String
  },
  last_online: {
    type: Date
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
