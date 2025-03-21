import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import Loading from './Loading';

function UpcomingTrips({ userId }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ongoing');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!userId) return;

    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/getTrips?id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tripsArray = Array.isArray(response.data) ? response.data : response.data.trips || [];
        const sortedTrips = tripsArray.sort((a, b) => 
          new Date(a.start_date) - new Date(b.start_date) || 
          new Date(a.end_date) - new Date(b.end_date)
        );

        setTrips(sortedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
        toast.error(t('fetchTripsError'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [userId]);

  const handleDelete = async (tripId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/deleteTrip?id=${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrips((prev) => prev.filter(trip => trip.id !== tripId));
      setConfirmDelete(null);
      toast.success(t('deletedTripSuccess'), { transition: Slide, autoClose: 3000 });
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast.error(t('deletedTripError'));
    }
  };

  const handleViewTrip = (tripName, startDate, endDate, tripId, activities, budgets, accommodationCost, accommodationEntries) => {
    navigate('/edit-trip', { state: { tripName, startDate, endDate, tripId, activities, budgets, accommodationCost, accommodationEntries } });
  }

  const now = new Date();
  const categorizeTrips = (trip) => {
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    if (end < now) return 'past';
    if (start <= now && end >= now) return 'ongoing';
    return 'upcoming';
  };

  const tripsByCategory = {
    past: trips.filter(trip => categorizeTrips(trip) === 'past'),
    ongoing: trips.filter(trip => categorizeTrips(trip) === 'ongoing'),
    upcoming: trips.filter(trip => categorizeTrips(trip) === 'upcoming'),
  };

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

      useEffect(() => {
        const updateTheme = () => {
          setTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', updateTheme); // Listen for storage changes
        return () => window.removeEventListener('storage', updateTheme);
      }, []);


      const tabRefs = useRef([]);
      const [underlineStyle, setUnderlineStyle] = useState({ left: "0px", width: "0px" });
    
      const [hoveredTab, setHoveredTab] = useState(null);
    
      useEffect(() => {
        const targetTab = hoveredTab ?? activeCategory; // Pokud je hover, tak bere hoveredTab, jinak activeCategory
        if (tabRefs.current[targetTab]) {
          const { offsetLeft, offsetWidth } = tabRefs.current[targetTab];
          setUnderlineStyle({ left: `${offsetLeft}px`, width: `${offsetWidth}px` });
        }
      }, [activeCategory, hoveredTab]);
  return (
    <div className="md:p-6 p-0 text-sm sm:text-base">
      <ToastContainer theme={theme} />
      <div className="relative mb-6 border-b dark:border-gray-700">
      <div className="flex justify-center w-full max-w-lg mx-auto relative">
        {["past", "ongoing", "upcoming"].map((category, index) => (
          <button
            key={category}
            ref={(el) => (tabRefs.current[category] = el)}
            className={`relative text-center px-4 sm:px-6 py-2 text-sm sm:text-lg font-medium transition-all duration-300 ${
              activeCategory === category
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            }`}
            onClick={() => setActiveCategory(category)}
            onMouseEnter={() => setHoveredTab(category)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {t(`trips${category.charAt(0).toUpperCase() + category.slice(1)}`)}
          </button>
        ))}
      </div>

      {/* Dynamická underline čára (reaguje na hover i kliknutí) */}
      <div
        className="absolute bottom-0 h-[2px] bg-blue-500 dark:bg-blue-400 transition-all duration-300"
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </div>

      <div className="trip-category transition-all duration-300 max-h-80 overflow-y-auto">
        {loading ? (
          <Loading />
        ) : tripsByCategory[activeCategory].length > 0 ? (
          tripsByCategory[activeCategory].map((trip) => (
            <div
              key={trip.id}
              className={`flex mb-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 w-full hover:bg-gray-100 dark:hover:bg-gray-900 transition cursor-pointer ${
                categorizeTrips(trip) === 'past' 
                  ? 'border-gray-400 dark:border-gray-600' 
                  : categorizeTrips(trip) === 'ongoing'
                  ? 'border-green-400 dark:border-green-600'
                  : 'border-blue-400 dark:border-blue-600'
              }`}
              onClick={() => handleViewTrip(trip.title, trip.start_date, trip.end_date, trip.id, trip.activities, trip.budgets, trip.accommodation_cost, trip.accommodation_entries)}
            >
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">{trip.title}</h4>
                <p className='dark:text-gray-100'>{format(new Date(trip.start_date), 'dd.MM.yyyy')} - {format(new Date(trip.end_date), 'dd.MM.yyyy')}</p>
                <p className="text-xs mt-1 dark:text-gray-100">{t('noActivities')}</p>
              </div>
              {confirmDelete === trip.id ? (
                <div className="flex space-x-2">
                  <button
                    className="text-green-500 hover:text-green-600"
                    onClick={(e) => { e.stopPropagation(); handleDelete(trip.id); }}
                    aria-label="Confirm delete"
                  >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.0898 68.7012" className="h-6 w-6"> <g> <rect height="68.7012" opacity="0" width="67.0898" x="0" y="0" /> <path d="M25.8789 68.7012C27.7832 68.7012 29.2969 67.8711 30.3711 66.2109L65.9668 9.91211C66.7969 8.64258 67.0898 7.61719 67.0898 6.5918C67.0898 4.19922 65.5273 2.58789 63.0859 2.58789C61.3281 2.58789 60.3516 3.17383 59.2773 4.88281L25.6836 58.7891L8.00781 34.9609C6.88477 33.4473 5.81055 32.8125 4.19922 32.8125C1.75781 32.8125 0 34.5215 0 36.9629C0 37.9883 0.439453 39.1113 1.26953 40.1855L21.2402 66.1133C22.6074 67.8711 23.9746 68.7012 25.8789 68.7012Z" fill="currentColor" /> </g> </svg>
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }}
                    aria-label="Cancel delete"
                  >
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3893 61.4014" className="h-6 w-6"> <g> <rect height="61.4014" opacity="0" width="61.3893" x="0" y="0" /> <path d="M1.15364 60.2661C2.71614 61.7798 5.2552 61.7798 6.76887 60.2661L30.6947 36.2915L54.6693 60.2661C56.1341 61.7798 58.722 61.7798 60.2357 60.2661C61.7493 58.7036 61.7493 56.1646 60.2357 54.6997L36.2611 30.7251L60.2357 6.79932C61.7493 5.28564 61.7982 2.69775 60.2357 1.18408C58.6732-0.280762 56.1341-0.280762 54.6693 1.18408L30.6947 25.1587L6.76887 1.18408C5.2552-0.280762 2.66731-0.32959 1.15364 1.18408C-0.311207 2.74658-0.311207 5.28564 1.15364 6.79932L25.1282 30.7251L1.15364 54.6997C-0.311207 56.1646-0.360035 58.7524 1.15364 60.2661Z" fill="currentColor" /> </g> </svg>
                  </button>
                </div>
              ) : (
                <button
                  className="ml-4 text-black dark:text-gray-100 dark:hover:text-red-600 hover:text-red-600 transition"
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(trip.id); }}
                  aria-label="Delete trip"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74.6094 92.8223" className="h-6 w-6"> <g> <rect height="92.8223" opacity="0" width="74.6094" x="0" y="0" /> <path d="M26.0254 73.0957C27.6855 73.0957 28.7598 72.0703 28.7109 70.5566L27.5879 30.5176C27.5391 28.9551 26.4648 27.9785 24.9023 27.9785C23.291 27.9785 22.168 29.0039 22.2168 30.5176L23.3398 70.5566C23.3887 72.1191 24.4629 73.0957 26.0254 73.0957ZM37.3047 73.0957C38.9648 73.0957 40.0879 72.0703 40.0879 70.5566L40.0879 30.5176C40.0879 29.0039 38.9648 27.9785 37.3047 27.9785C35.6445 27.9785 34.5215 29.0039 34.5215 30.5176L34.5215 70.5566C34.5215 72.0703 35.6445 73.0957 37.3047 73.0957ZM48.6328 73.0957C50.1465 73.0957 51.2695 72.1191 51.3184 70.5566L52.3926 30.5176C52.4414 29.0039 51.3672 27.9785 49.707 27.9785C48.1445 27.9785 47.0703 29.0039 47.0215 30.5176L45.9473 70.5566C45.8984 72.0703 46.9727 73.0957 48.6328 73.0957ZM20.2637 18.0176L27.1973 18.0176L27.1973 9.81445C27.1973 7.8125 28.6133 6.49414 30.6641 6.49414L43.8965 6.49414C45.8984 6.49414 47.3145 7.8125 47.3145 9.81445L47.3145 18.0176L54.2969 18.0176L54.2969 9.32617C54.2969 3.56445 50.5371 0 44.3848 0L30.127 0C24.0234 0 20.2637 3.56445 20.2637 9.32617ZM3.22266 21.4844L71.3867 21.4844C73.1934 21.4844 74.6094 20.0195 74.6094 18.2129C74.6094 16.4062 73.1445 14.9414 71.3867 14.9414L3.22266 14.9414C1.51367 14.9414 0 16.4062 0 18.2129C0 20.0195 1.51367 21.4844 3.22266 21.4844ZM19.6777 85.6934L54.9805 85.6934C60.791 85.6934 64.5508 82.0801 64.8438 76.2207L67.3828 20.752L60.4004 20.752L57.959 75.4883C57.8613 77.6855 56.3965 79.1504 54.248 79.1504L20.3125 79.1504C18.2617 79.1504 16.748 77.6367 16.6504 75.4883L14.0625 20.752L7.22656 20.752L9.81445 76.2695C10.1074 82.1289 13.7695 85.6934 19.6777 85.6934Z" fill="currentColor" /> </g> </svg>
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4 dark:text-gray-200">{t('noTripsInCategory')}</p>
        )}
      </div>
    </div>
  );
}

UpcomingTrips.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default UpcomingTrips;
