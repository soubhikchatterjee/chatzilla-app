const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/auth");

// Import Controllers
const channels = require("../controllers/channels");

router.get("/", AuthMiddleware, channels.getAll);
router.get("/private", AuthMiddleware, channels.getAllPrivate);
router.get("/:channelId", AuthMiddleware, channels.getOne);
router.post("/", AuthMiddleware, channels.add);

module.exports = router;
