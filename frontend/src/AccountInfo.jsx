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
<div className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
  {/* Nadpis */}
  <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center">
    {t("accountOver")}
  </h2>

  {/* Profilový obrázek */}
  <div className="flex justify-center mb-6">
    {userInfo.profilovka ? (
      <img
        src={userInfo.profilovka}
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-blue-500 dark:border-blue-400 transition-transform transform hover:scale-105"
      />
    ) : (
      <img
        src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${userInfo.email || userInfo.jmeno || "guest"}`}
        alt="Generated Avatar"
        className="w-24 h-24 rounded-full border-4 border-gray-400 dark:border-gray-600 transition-transform transform hover:scale-105"
      />
    )}
  </div>

  {/* Jméno a Přezdívka */}
  <div className="space-y-4">
    {isEditing ? (
      <>
        <label className="block text-gray-700 dark:text-gray-200">
          {t("firstName")}
          <input
            type="text"
            name="jmeno"
            value={userInfo.jmeno || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
        </label>
        <label className="block text-gray-700 dark:text-gray-200">
          {t("lastName")}
          <input
            type="text"
            name="prijmeni"
            value={userInfo.prijmeni || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
        </label>
      </>
    ) : (
      <p className="text-lg dark:text-gray-200 text-center">
        {t("fullName")} <strong>{userInfo.jmeno} {userInfo.prijmeni}</strong>
      </p>
    )}

    {isEditing ? (
      <label className="block text-gray-700 dark:text-gray-200">
        {t("nickName")}
        <input
          type="text"
          name="prezdivka"
          value={userInfo.prezdivka || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        />
      </label>
    ) : userInfo.prezdivka ? (
      <p className="text-gray-700 dark:text-gray-300 text-center">{t("nickName")}<strong>{userInfo.prezdivka}</strong></p>
    ) : (
      <p className="text-red-500 text-center">{t("noNick")}</p>
    )}
  </div>

  {/* Email */}
  <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
    <p className="text-gray-700 dark:text-gray-300 text-lg">
      ✉️ <strong>{userInfo.email}</strong>
    </p>
  </div>

  {/* Tlačítka */}
  <div className="mt-6 space-y-3">
    {isEditing ? (
      <>
        <button
          onClick={handleSave}
          className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition-all"
        >
          {t("save")}
        </button>
        <button
          onClick={handleEditToggle}
          className="w-full bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
        >
          {t("cancel")}
        </button>
      </>
    ) : (
      <button
        onClick={handleEditToggle}
        className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
      >
        {t("editProfile")}
      </button>
    )}
    <button
      onClick={handleLogout}
      className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
    >
      {t("logout")}
    </button>
  </div>

  {/* Chybová hláška */}
  {error && <p className="text-red-500 text-center mt-4">{error}</p>}
</div>

  );
}

export default AccountInfo;
