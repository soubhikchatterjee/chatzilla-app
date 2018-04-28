const { check, validationResult } = require("express-validator/check");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");

exports.validate = [
  [
    check("email")
      .isEmail()
      .withMessage("Email is invalid"),
    check("email")
      .custom(async (value, { req }) => {
        let user = await User.findOne({ email: value });

        if (_.isEmpty(user)) {
          return false;
        } else {
          try {
            let hash = await bcrypt.compare(req.body.password, user.password);
            if (hash === false) {
              return false;
            }
          } catch (error) {
            console.log(error);
          }
        }
      })
      .withMessage("Invalid login"),
    check("password")
      .exists()
      .isLength({ min: 5 })
      .withMessage("Password is mandatory")
  ],
  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.mapped() });
    }

    next();
  }
];
