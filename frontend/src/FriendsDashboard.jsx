import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const FriendsDashboard = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [receiverId, setReceiverId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, [userId]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/friends/list`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/friends/requests`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendRequests(response.data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const sendFriendRequest = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/friends/request`,
        { userId, receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Friend request sent!");
      setReceiverId("");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleFriendRequest = async (requestId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/friends/accept`,
        { userId, requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFriends();
      fetchFriendRequests();
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} className="p-2 border-b">{friend.username}</li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-4">Friend Requests</h2>
      <ul>
        {friendRequests.map((request) => (
          <li key={request.id} className="p-2 border-b flex justify-between">
            {request.username}
            <button onClick={() => handleFriendRequest(request.id)} className="bg-green-500 text-white px-2 py-1 mx-1">Accept</button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-4">Add Friend</h2>
      <div className="flex">
        <input
          type="number"
          placeholder="Enter friend's ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="p-2 border"
        />
        <button onClick={sendFriendRequest} className="bg-blue-500 text-white px-4 py-2 ml-2">Send</button>
      </div>
    </div>
  );
};
FriendsDashboard.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default FriendsDashboard;
