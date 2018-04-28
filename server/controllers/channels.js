const _ = require("lodash");
const Channel = require("../models/channel");
const Starred = require("../models/starred");
const User = require("../models/user");
const auth = require("../helpers/auth");

// Get all channels
exports.getAll = async (request, response) => {
  let query = {
    is_private: false
  };

  try {
    let channels = await Channel.find(query)
      .populate("members", "_id first_name last_name email")
      .exec();
    response.status(200).json(channels);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error: "An error occurred and we are looking into it."
    });
  }
};

// Get single channel
exports.getOne = async (request, response) => {
  let query = {
    _id: request.params.channelId
  };

  try {
    let channels = await Channel.findOne(query).populate(
      "members",
      "_id first_name last_name email"
    );
    response.status(200).json(channels);
  } catch (error) {
    response.status(500).json({
      error: "An error occurred and we are looking into it."
    });
  }
};

// Get all private channels
exports.getAllPrivate = async (request, response) => {
  let user = auth.isAuthenticated(request.get("authorization"));

  let query = {
    is_private: true,
    members: { $in: [user.data._id] }
  };

  try {
    let channels = await Channel.find(query).populate(
      "members",
      "_id first_name last_name email"
    );
    response.status(200).json(channels);
  } catch (error) {
    response.status(500).json({
      error: "An error occurred and we are looking into it."
    });
  }
};

// Create new channel
exports.add = async (request, response, next) => {
  let user = auth.isAuthenticated(request.get("authorization"));

  if (!_.isEmpty(request.body.members)) {
    for (member of request.body.members) {
      try {
        let isUserValid = await User.findById(member);
        if (_.isEmpty(isUserValid)) {
          return response.status(400).json({
            error: "One or more member is invalid"
          });
        }
      } catch (error) {
        console.log(error);
        return response.status(400).json({
          error: "One or more member is invalid"
        });
      }
    }
  }

  let channel = new Channel({
    display_name: request.body.display_name,
    is_private: request.body.is_private,
    members: request.body.members,
    creator_user_id: user.data._id
  });

  try {
    let result = await channel.save();
    return response.status(201).json(result);
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error: "An error occurred and we are looking into itx."
    });
  }
};
