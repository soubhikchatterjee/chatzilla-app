const mongoose = require("mongoose");

let teamSchema = mongoose.Schema({
  domain_name: {
    type: String,
    required: true
  },
  display_name: {
    type: String,
    required: true
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

module.exports = mongoose.model("Team", teamSchema);
