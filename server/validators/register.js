const { check, validationResult } = require("express-validator/check");
const User = require("../models/user");
const _ = require("lodash");

exports.validate = [
  [
    check("first_name")
      .exists()
      .withMessage("Firstname cannot be empty"),
    check("last_name")
      .exists()
      .withMessage("Lastname cannot be empty"),
    check("email")
      .isEmail()
      .withMessage("Email is invalid"),
    check("email")
      .custom(async (value, { req }) => {
        let user = await User.findOne({ email: value });

        if (!_.isEmpty(user)) {
          return false;
        }
      })
      .withMessage("Email already exists"),
    check("password")
      .isLength({ min: 5 })
      .matches(/\d/)
      .withMessage(
        "Passwords must be at least 5 chars long and contain one number"
      ),
    check("password2")
      .exists()
      .custom((value, { req }) => value === req.body.password)
      .withMessage(
        "Password confirm field must have the same value as the password field"
      ),
    check("location")
      .isLength({ min: 2 })
      .withMessage("Location cannot be empty"),
    check("timezone")
      .isLength({ min: 5 })
      .withMessage("Timezone cannot be empty")
  ],
  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({ errors: errors.mapped() });
    }

    next();
  }
];
