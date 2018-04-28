const express = require("express");
const router = express.Router();

// Controllers
const auth = require("../controllers/auth");

// Validator Middlewares
const register = require("../validators/register");
const login = require("../validators/login");

router.post("/register", register.validate, auth.register);
router.post("/login", login.validate, auth.login);
router.post("/token", auth.token);

module.exports = router;
