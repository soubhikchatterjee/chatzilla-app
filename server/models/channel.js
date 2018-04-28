const mongoose = require("mongoose");

let channelSchema = mongoose.Schema({
  display_name: {
    type: String,
    required: true
  },
  members: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  is_private: {
    type: Boolean,
    default: false
  },
  creator_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

module.exports = mongoose.model("Channel", channelSchema);
