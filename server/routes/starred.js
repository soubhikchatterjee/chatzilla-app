const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/auth");

// Import controllers
const starred = require("../controllers/starred");

router.get("/", AuthMiddleware, starred.getAll);
router.get("/users/:id", AuthMiddleware, starred.getOne);
router.get("/channels/:id", AuthMiddleware, starred.getOne);
router.post("/users", AuthMiddleware, starred.toggleStarred);
router.post("/channels", AuthMiddleware, starred.toggleStarred);

module.exports = router;
