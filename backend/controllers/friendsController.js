const { getConnection } = require("../db");

// Získání seznamu přátel
const getFriendsList = async (req, res) => {
    const userId = req.query.userId; // Přijímáme userId jako query param

    if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
    }

    try {
        const conn = await getConnection();
        const friends = await conn.query(
            `SELECT u.id, u.username 
             FROM users u 
             JOIN friend_requests fr ON (u.id = fr.sender_id OR u.id = fr.receiver_id) 
             WHERE (fr.sender_id = ? OR fr.receiver_id = ?) 
             AND u.id != ? 
             AND fr.status = 'accepted'`,
            [userId, userId, userId]
        );
        conn.release();
        res.json(friends);
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: "Error fetching friends." });
    }
};

// Získání seznamu žádostí o přátelství
const getFriendRequests = async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ message: "Missing userId" });
    }

    try {
        const conn = await getConnection();
        const friendRequests = await conn.query(
            `SELECT fr.id, u.username 
             FROM friend_requests fr 
             JOIN users u ON u.id = fr.sender_id 
             WHERE fr.receiver_id = ? 
             AND fr.status = 'pending'`,
            [userId]
        );
        conn.release();
        res.json(friendRequests);
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: "Error fetching friend requests." });
    }
};

// Odeslání žádosti o přátelství
const sendFriendRequest = async (req, res) => {
    const { userId, receiverId } = req.body;

    if (!userId || !receiverId) {
        return res.status(400).json({ message: "Missing userId or receiverId" });
    }

    try {
        const conn = await getConnection();
        await conn.query(
            `INSERT INTO friend_requests (sender_id, receiver_id, status) 
             VALUES (?, ?, 'pending')`,
            [userId, receiverId]
        );
        conn.release();
        res.json({ message: "Friend request sent successfully." });
    } catch (error) {
        console.error("Error sending friend request:", error);
        res.status(500).json({ message: "Error sending friend request." });
    }
};

// Přijetí žádosti o přátelství
const acceptFriendRequest = async (req, res) => {
    const { userId, requestId } = req.body;

    if (!userId || !requestId) {
        return res.status(400).json({ message: "Missing userId or requestId" });
    }

    try {
        const conn = await getConnection();
        const request = await conn.query(
            `SELECT * FROM friend_requests WHERE id = ? AND receiver_id = ?`,
            [requestId, userId]
        );

        if (request.length === 0) {
            return res.status(404).json({ message: "Friend request not found or unauthorized." });
        }

        await conn.query(
            `UPDATE friend_requests SET status = 'accepted' WHERE id = ?`,
            [requestId]
        );
        conn.release();
        res.json({ message: "Friend request accepted successfully." });
    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Error accepting friend request." });
    }
};

module.exports = { getFriendsList, getFriendRequests, sendFriendRequest, acceptFriendRequest };
