const mongoose = require("mongoose");

let conversationScheme = mongoose.Schema({
  channel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: false
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ]
});


module.exports = mongoose.model("Conversation", conversationScheme);
