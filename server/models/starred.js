const mongoose = require("mongoose");

let starredSchema = mongoose.Schema({
  creator_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  users: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  channels: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }]
  }
});

module.exports = mongoose.model("Starred", starredSchema);
