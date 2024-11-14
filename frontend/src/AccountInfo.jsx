import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AccountInfo() {
    const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    id: null,
    email: '',
    jmeno: '',
    prijmeni: '',
    prezdivka: '',
    profilovka: '',
    created_at: ''
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/account', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      }
    };

    fetchUserInfo();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/account/update', userInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update user data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">Account Overview</h2>

      {/* Profile Picture */}
      {userInfo.profilovka ? (
        <img src={userInfo.profilovka} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
      ) : (
        <p className="text-red-500">No profile picture</p>
      )}

      {/* Full Name */}
      {isEditing ? (
        <>
          <label>
            First Name:
            <input
              type="text"
              name="jmeno"
              value={userInfo.jmeno || ''}
              onChange={handleChange}
              className="border p-2 rounded mb-2 w-full"
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="prijmeni"
              value={userInfo.prijmeni || ''}
              onChange={handleChange}
              className="border p-2 rounded mb-2 w-full"
            />
          </label>
        </>
      ) : (
        <p>
          Full Name: <strong>{userInfo.jmeno} {userInfo.prijmeni}</strong>
        </p>
      )}

      {/* Nickname */}
      {isEditing ? (
        <label>
          Nickname:
          <input
            type="text"
            name="prezdivka"
            value={userInfo.prezdivka || ''}
            onChange={handleChange}
            className="border p-2 rounded mb-2 w-full"
          />
        </label>
      ) : userInfo.prezdivka ? (
        <p>Nickname: <strong>{userInfo.prezdivka}</strong></p>
      ) : (
        <p className="text-red-500">Nickname not set</p>
      )}

      {/* Email */}
      <p>Email: <strong>{userInfo.email}</strong></p>

      {/* Save/Cancel or Edit Button */}
      {isEditing ? (
        <div>
          <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded w-full mt-4 hover:bg-green-600">
            Save
          </button>
          <button onClick={handleEditToggle} className="bg-gray-500 text-white p-2 rounded w-full mt-4 hover:bg-gray-600">
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={handleEditToggle} className="bg-blue-500 text-white p-2 rounded w-full mt-4 hover:bg-blue-600">
          Edit Profile
        </button>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded w-full mt-4 hover:bg-red-600">
        Logout
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default AccountInfo;
