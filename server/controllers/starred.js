const Starred = require("../models/starred");
const _ = require("lodash");
const auth = require("../helpers/auth");

exports.getAll = async (request, response) => {
  let user = auth.isAuthenticated(request.get("authorization"));

  let query = {
    creator_user_id: user.data._id
  };

  try {
    let starred = await Starred.find(query);
    response.status(200).json(starred);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error: "An error occurred and we are looking into it."
    });
  }
};

exports.getOne = async (request, response) => {
  let user = auth.isAuthenticated(request.get("authorization"));

  let lookup = {
    users: {
      $in: request.params.id
    }
  };
  if (request.path.indexOf("channels") != -1) {
    lookup = {
      channels: {
        $in: request.params.id
      }
    };
  }

  let query = {
    lookup,
    creator_user_id: user.data._id
  };

  try {
    let starred = await Starred.findOne(query);
    response.status(200).json(starred);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error: "An error occurred and we are looking into it."
    });
  }
};

exports.toggleStarred = async (request, response) => {
  let user = auth.isAuthenticated(request.get("authorization"));

  let keyName = "users";
  let keyId = request.body.user_id;
  if (request.path.indexOf("channel") != -1) {
    // If the request path contains the word channel
    keyName = "channels";
    keyId = request.body.channel_id;
  }

  // Check if a user's record exists
  let starred = await Starred.findOne({ creator_user_id: user.data._id });

  if (_.isEmpty(starred)) {
    let object = new Starred({
      creator_user_id: user.data._id,
      users: [],
      channels: []
    });
    starred = await object.save();
  }

  let condition = {
    creator_user_id: user.data._id,
    [keyName]: {
      $in: [keyId]
    }
  };

  // Check if the element already exists in the array, if not, add it, if yes, remove it
  let starredExists = await Starred.findOne(condition);

  // Looks like the lookup date does not exists, lets add data to it
  if (_.isEmpty(starredExists)) {
    starred = await Starred.update(
      { creator_user_id: user.data._id },
      { $push: { [keyName]: keyId } }
    );
    return response.status(201).json(starred);
  }

  // The element exists, lets remove it
  starred = await Starred.update(
    { creator_user_id: user.data._id },
    { $pull: { [keyName]: keyId } }
  );

  return response.status(200).json(starred);
};
