const express = require("express");
const router = express.Router();

let User = require("../models/user");

router.get("/", (request, response) => {
  User.find({}, (error, users) => {
    if (error) {
      console.log(error);
    } else {
      response.json(users);
    }
  });
});

module.exports = router;
