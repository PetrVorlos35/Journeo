const express = require("express");
const {
    getFriendsList,
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest
} = require("../controllers/friendsController");
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/list", authenticateToken, getFriendsList);
router.get("/requests", authenticateToken, getFriendRequests);
router.post("/request", authenticateToken, sendFriendRequest);
router.post("/accept", authenticateToken, acceptFriendRequest);

module.exports = router;
