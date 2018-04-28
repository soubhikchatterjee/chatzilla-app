const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/auth");

// Import Controllers
const chats = require("../controllers/chats");

router.get("/channels/:id", AuthMiddleware, chats.getChannelChats);
router.get("/direct/:id", AuthMiddleware, chats.getDirectChats);
router.post("/channels", AuthMiddleware, chats.addChannelMessage);
router.post("/direct", AuthMiddleware, chats.addDirectMessage);

module.exports = router;
