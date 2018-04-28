const _ = require("lodash");
const jwt = require("jsonwebtoken");
const auth = require("../helpers/auth");
const Channel = require("../models/channel");
const User = require("../models/user");
const Conversation = require("../models/chats/conversation");
const Message = require("../models/chats/message");

exports.getChannelChats = async (request, response) => {
  try {
    let conversation = await Conversation.findOne({
      channel_id: request.params.id
    });
    let message = await Message.find({ conversation_id: conversation._id }).populate('sender', '-is_admin -password');
    return response.status(200).json(message);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      error: "Invalid channel name"
    });
  }
};

exports.getDirectChats = async (request, response) => {
  let user = auth.isAuthenticated(request.get("authorization"));
  console.log("user", user.data._id);

  try {
    let conversation = await Conversation.findOne({
      channel_id: null,
      participants: { $in: [user.data._id, request.params.id] }
    });
    let message = await Message.find({ conversation_id: conversation._id }).populate('sender', '-is_admin -password');;
    return response.status(200).json(message);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      error: "Invalid channel name"
    });
  }
};

exports.addChannelMessage = async (request, response) => {
  let user = auth.isAuthenticated(request.get("authorization"));

  try {
    // Verify if the channel name is valid
    let isValidChannel = await Channel.findById(request.body.channel_id);

    if (_.isEmpty(isValidChannel)) {
      return response.status(400).json({
        error: "Invalid channel id"
      });
    }
  } catch (error) {
    return response.status(400).json({
      error: "Invalid channel name"
    });
  }

  try {
    // Since the channel is valid, lets check if there are any existing records for the channel in the conversation document
    let conversation = await Conversation.findOneAndUpdate(
      { channel_id: request.body.channel_id },
      {
        channel_id: request.body.channel_id,
        $addToSet: { participants: user.data._id }
      },
      { upsert: true, new: true }
    );

    // Add to the message collection
    let message = new Message({
      conversation_id: conversation._id,
      sender: user.data._id,
      content: request.body.content
    });

    message = await message.save();

    return response.status(201).json(message);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      error: error
    });
  }
};

exports.addDirectMessage = async (request, response) => {
  let user = auth.isAuthenticated(request.get("authorization"));

  try {
    // Verify if the user name is valid
    let isValidUser = await User.findById(request.body.user_id);

    if (_.isEmpty(isValidUser)) {
      return response.status(400).json({
        error: "Invalid user id"
      });
    }
  } catch (error) {
    return response.status(400).json({
      error: "Invalid user id"
    });
  }

  try {
    // Since the user is valid, lets check if there are any existing records for the two uses in the conversation document
    let conversation = await Conversation.findOneAndUpdate(
      {
        $where: () => {
          var match = [user.data._id, request.body.user_id];
          return (
            this.participants.filter(function(el) {
              return match.indexOf(el) != -1;
            }).length >= 2
          );
        },
        channel_id: null
      },
      {
        channel_id: null,
        $addToSet: { participants: [user.data._id, request.body.user_id] }
      },
      { upsert: true, new: true }
    );

    // Add to the message collection
    let message = new Message({
      conversation_id: conversation._id,
      sender: user.data._id,
      content: request.body.content
    });

    message = await message.save();

    return response.status(201).json(message);
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      error: error
    });
  }
};
