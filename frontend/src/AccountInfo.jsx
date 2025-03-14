import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';


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

  const { t } = useTranslation();


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/account`, {
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
      await axios.put(`${import.meta.env.VITE_API_URL}/account/update`, userInfo, {
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
    <div className="bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
      <h2 className="text-2xl font-bold mb-4 text-blue-500">{t('accountOver')}</h2>

      {/* Profile Picture */}
      {userInfo.profilovka ? (
        <img src={userInfo.profilovka} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
      ) : (
        <p className="text-red-500">{t('noPic')}</p>
      )}

      {/* Full Name */}
      {isEditing ? (
        <>
          <label className='dark:text-gray-200'>
          {t('firstName')}
            <input
              type="text"
              name="jmeno"
              value={userInfo.jmeno || ''}
              onChange={handleChange}
              className="border p-2 rounded mb-2 w-full dark:bg-black dark:border-gray-800 dark:text-gray-100"
            />
          </label>
          <label className='dark:text-gray-200'>
          {t('lastName')}
            <input
              type="text"
              name="prijmeni"
              value={userInfo.prijmeni || ''}
              onChange={handleChange}
              className="border p-2 rounded mb-2 w-full dark:bg-black dark:border-gray-800 dark:text-gray-100"
            />
          </label>
        </>
      ) : (
        <p className='dark:text-gray-200'>
          {t('fullName')} <strong>{userInfo.jmeno} {userInfo.prijmeni}</strong>
        </p>
      )}

      {/* Nickname */}
      {isEditing ? (
        <label className='dark:text-gray-200'>
          {t('nickName')}
          <input
            type="text"
            name="prezdivka"
            value={userInfo.prezdivka || ''}
            onChange={handleChange}
            className="border p-2 rounded mb-2 w-full dark:bg-black dark:border-gray-800 dark:text-gray-100"
          />
        </label>
      ) : userInfo.prezdivka ? (
        <p className='dark:text-gray-200'>{t('nickName')} <strong>{userInfo.prezdivka}</strong></p>
      ) : (
        <p className="text-red-500">{t('noNick')}</p>
      )}

      {/* Email */}
      <p className='dark:text-gray-200'>Email: <strong>{userInfo.email}</strong></p>

      {/* Save/Cancel or Edit Button */}
      {isEditing ? (
        <div>
          <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded w-full mt-4 hover:bg-green-600">
            {t('save')}
          </button>
          <button onClick={handleEditToggle} className="bg-gray-500 text-white p-2 rounded w-full mt-4 hover:bg-gray-600">
          {t('cancel')}
          </button>
        </div>
      ) : (
        <button onClick={handleEditToggle} className="bg-blue-500 text-white p-2 rounded w-full mt-4 hover:bg-blue-600">
          {t('editProfile')}
        </button>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded w-full mt-4 hover:bg-red-600">
        {t('logout')}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default AccountInfo;
