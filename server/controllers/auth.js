const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const auth = require("../helpers/auth");

exports.register = async (request, response, next) => {
  try {
    let hashedPassword = await bcrypt.hash(request.body.password, 10);

    let user = new User({
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      email: request.body.email,
      password: hashedPassword,
      avatar_url: "",
      location: request.body.location,
      timezone: request.body.timezone,
      status_message: request.body.status_message,
      is_admin: false
    });

    await user.save();

    return response.status(201).json({
      message: "Registration successful"
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error: "An error has occurred and we are looking into it"
    });
  }
};

exports.login = async (request, response, next) => {
  let user = await User.findOne({ email: request.body.email });
  let token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: {
        _id: user._id,
        email: user.email
      }
    },
    process.env.JWT_SECRET
  );

  return response.status(200).json({
    token: token
  });
};

exports.token = (request, response, next) => {
  let authentication = auth.isAuthenticated(request.body.token);
  if (authentication) {
    return response.status(200).json(authentication);
  } else {
    return response.status(401).json({
      error: "Invalid token"
    });
  }
};
