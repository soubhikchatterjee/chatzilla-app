const express = require("express");
const router = express.Router();

let Team = require("../models/team");

router.get("/", (request, response) => {
  Team.find({}, (error, teams) => {
    if (error) {
      console.log(error);
    } else {
      response.json(teams);
    }
  });
});

module.exports = router;
