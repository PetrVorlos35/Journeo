import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AccountInfo from "./AccountInfo";
import { DateRangePicker } from "react-date-range";
import { cs, enUS } from "date-fns/locale"; 
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css"; 
// import { LoadScript } from '@react-google-maps/api';
import BudgetTracking from "./BudgetTracking";
// import Map from "./Map";
// import MapComponent from "./MapComponent";
import UpcomingTrips from "./UpcomingTrips";
import { useTranslation } from 'react-i18next';
// import FriendsDashboard from "./FriendsDashboard";
// import AuthHandler from "./AuthHandler";


function Dashboard() {
  const [activeTab, setActiveTab] = useState("createTrip");
  const [loading, setLoading] = useState(true);
  const [tripName, setTripName] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  ]);
  const [userId, setUserId] = useState(null);
  const [statistics, setStatistics] = useState({ distance: 0, time: 0 });

  const [tokenAuth, setToken] = useState(localStorage.getItem('token'));


  const navigate = useNavigate(); 
  const location = useLocation();

  const { t, i18n } = useTranslation();

  const getLocale = () => {
    switch (i18n.language) {
      case "cs":
        return cs;
      case "en":
      default:
        return enUS;
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        const result = await response.json();
        if (response.ok) {
          setUserId(result.id);
          
        } else {
          console.error('Error fetching user ID:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const delayFetch = setTimeout(() => {
      fetchUserId();
    }, 1000); 
  
    return () => clearTimeout(delayFetch); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      console.error('User ID not available');
      return;
    }
    const tripData = {
      userId: userId,
      title: tripName,
      startDate: dateRange[0].startDate.toLocaleDateString("en-CA"),
      endDate: dateRange[0].endDate.toLocaleDateString("en-CA"),
      activities: [],
    };
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tripData),
      });
      const result = await response.json();
      if (response.ok) {
        const startDate = dateRange[0].startDate.toLocaleDateString("en-CA"); 
        const endDate = dateRange[0].endDate.toLocaleDateString("en-CA"); 
        navigate("/create-trip", { state: { tripName, startDate, endDate, tripId: result.tripId } });
      } else {
        console.error('Error creating trip:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);

      navigate("/dashboard", { replace: true });
    } else {
      const savedToken = localStorage.getItem("token");

      if (savedToken) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [navigate, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <Navbar />
      {/* <AuthHandler token={tokenAuth} setToken={(newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
      }} /> */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="w-full text-center overflow-x-scroll whitespace-nowrap space-x-4 md:space-x-8 mb-6 px-4 ">
  {[
    { tab: "createTrip", label: t("planTrip"), svg: (
      <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 95.6299 92.8864"
              className="w-5 h-5 inline-block mr-2"
            >
              <g>
                <rect height="92.8864" opacity="0" width="95.6299" x="0" y="0" />
                <path
                  d="M61.5316 20.3934L26.0132 20.3934C22.4976 20.3934 20.5444 22.2977 20.5444 26.0086L20.5444 69.368C20.5444 73.079 22.4976 74.9833 26.0132 74.9833L69.6167 74.9833C73.1323 74.9833 75.0854 73.079 75.0854 69.368L75.0854 34.2529L82.1655 27.1565L82.1655 69.7586C82.1655 77.9618 77.9663 82.0145 69.7144 82.0145L25.9155 82.0145C17.6636 82.0145 13.4644 77.9618 13.4644 69.7586L13.4644 25.618C13.4644 17.4149 17.6636 13.3622 25.9155 13.3622L68.5547 13.3622Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <path
                  d="M39.2456 57.5516L47.2534 54.1336L82.9956 18.3915L77.2339 12.7762L41.5405 48.4696L37.9272 56.1844C37.5854 56.9169 38.4155 57.8934 39.2456 57.5516ZM85.9741 15.4129L88.9038 12.4344C90.2222 11.0184 90.2222 8.96763 88.9038 7.64927L87.8296 6.57505C86.5601 5.30552 84.5093 5.45201 83.2397 6.77037L80.2612 9.70005Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
              </g>
            </svg>
    ) },
    { tab: "upcomingTrips", label: t("trips"), svg: (
      <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 76.5625 71.2402"
              className="w-5 h-5 inline-block mr-2"
            >
              <g>
                <rect height="71.2402" opacity="0" width="76.5625" x="0" y="0" />
                <path
                  d="M12.4512 71.2402L64.1113 71.2402C72.4609 71.2402 76.5625 67.1387 76.5625 58.9355L76.5625 12.3535C76.5625 4.15039 72.4609 0.0488281 64.1113 0.0488281L12.4512 0.0488281C4.15039 0.0488281 0 4.15039 0 12.3535L0 58.9355C0 67.1387 4.15039 71.2402 12.4512 71.2402ZM11.7676 64.1602C8.74023 64.1602 7.03125 62.5488 7.03125 59.375L7.03125 22.6562C7.03125 19.4824 8.74023 17.8711 11.7676 17.8711L64.7461 17.8711C67.7734 17.8711 69.5312 19.4824 69.5312 22.6562L69.5312 59.375C69.5312 62.5488 67.7734 64.1602 64.7461 64.1602ZM30.8594 31.6895L33.1055 31.6895C34.5703 31.6895 35.0586 31.2012 35.0586 29.7852L35.0586 27.5391C35.0586 26.123 34.5703 25.6348 33.1055 25.6348L30.8594 25.6348C29.4434 25.6348 28.9551 26.123 28.9551 27.5391L28.9551 29.7852C28.9551 31.2012 29.4434 31.6895 30.8594 31.6895ZM43.457 31.6895L45.7031 31.6895C47.1191 31.6895 47.6074 31.2012 47.6074 29.7852L47.6074 27.5391C47.6074 26.123 47.1191 25.6348 45.7031 25.6348L43.457 25.6348C41.9922 25.6348 41.5039 26.123 41.5039 27.5391L41.5039 29.7852C41.5039 31.2012 41.9922 31.6895 43.457 31.6895ZM56.0059 31.6895L58.252 31.6895C59.668 31.6895 60.2051 31.2012 60.2051 29.7852L60.2051 27.5391C60.2051 26.123 59.668 25.6348 58.252 25.6348L56.0059 25.6348C54.541 25.6348 54.0527 26.123 54.0527 27.5391L54.0527 29.7852C54.0527 31.2012 54.541 31.6895 56.0059 31.6895ZM18.3105 44.043L20.5566 44.043C22.0215 44.043 22.5098 43.5547 22.5098 42.1387L22.5098 39.8926C22.5098 38.4766 22.0215 37.9883 20.5566 37.9883L18.3105 37.9883C16.8945 37.9883 16.3574 38.4766 16.3574 39.8926L16.3574 42.1387C16.3574 43.5547 16.8945 44.043 18.3105 44.043ZM30.8594 44.043L33.1055 44.043C34.5703 44.043 35.0586 43.5547 35.0586 42.1387L35.0586 39.8926C35.0586 38.4766 34.5703 37.9883 33.1055 37.9883L30.8594 37.9883C29.4434 37.9883 28.9551 38.4766 28.9551 39.8926L28.9551 42.1387C28.9551 43.5547 29.4434 44.043 30.8594 44.043ZM43.457 44.043L45.7031 44.043C47.1191 44.043 47.6074 43.5547 47.6074 42.1387L47.6074 39.8926C47.6074 38.4766 47.1191 37.9883 45.7031 37.9883L43.457 37.9883C41.9922 37.9883 41.5039 38.4766 41.5039 39.8926L41.5039 42.1387C41.5039 43.5547 41.9922 44.043 43.457 44.043ZM56.0059 44.043L58.252 44.043C59.668 44.043 60.2051 43.5547 60.2051 42.1387L60.2051 39.8926C60.2051 38.4766 59.668 37.9883 58.252 37.9883L56.0059 37.9883C54.541 37.9883 54.0527 38.4766 54.0527 39.8926L54.0527 42.1387C54.0527 43.5547 54.541 44.043 56.0059 44.043ZM18.3105 56.3965L20.5566 56.3965C22.0215 56.3965 22.5098 55.9082 22.5098 54.4922L22.5098 52.2461C22.5098 50.8301 22.0215 50.3418 20.5566 50.3418L18.3105 50.3418C16.8945 50.3418 16.3574 50.8301 16.3574 52.2461L16.3574 54.4922C16.3574 55.9082 16.8945 56.3965 18.3105 56.3965ZM30.8594 56.3965L33.1055 56.3965C34.5703 56.3965 35.0586 55.9082 35.0586 54.4922L35.0586 52.2461C35.0586 50.8301 34.5703 50.3418 33.1055 50.3418L30.8594 50.3418C29.4434 50.3418 28.9551 50.8301 28.9551 52.2461L28.9551 54.4922C28.9551 55.9082 29.4434 56.3965 30.8594 56.3965ZM43.457 56.3965L45.7031 56.3965C47.1191 56.3965 47.6074 55.9082 47.6074 54.4922L47.6074 52.2461C47.6074 50.8301 47.1191 50.3418 45.7031 50.3418L43.457 50.3418C41.9922 50.3418 41.5039 50.8301 41.5039 52.2461L41.5039 54.4922C41.5039 55.9082 41.9922 56.3965 43.457 56.3965Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
              </g>
            </svg>
    ) },
    { tab: "statistics", label: t("statistics"), svg: (
      <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 85.9375 71.2402"
              className="w-5 h-5 inline-block mr-2"
            >
              <g>
                <rect height="71.2402" opacity="0" width="85.9375" x="0" y="0" />
                <path
                  d="M0 67.7246C0 69.6777 1.61133 71.2402 3.51562 71.2402L82.4219 71.2402C84.3262 71.2402 85.9375 69.6777 85.9375 67.7246C85.9375 65.8203 84.3262 64.209 82.4219 64.209L3.51562 64.209C1.61133 64.209 0 65.8203 0 67.7246Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <path
                  d="M66.1133 53.9551C66.1133 56.2012 67.4805 57.5195 69.8242 57.5195L78.2715 57.5195C80.5664 57.5195 81.9336 56.2012 81.9336 53.9551L81.9336 29.4922C81.9336 27.2949 80.5664 25.9277 78.2715 25.9277L69.8242 25.9277C67.4805 25.9277 66.1133 27.2949 66.1133 29.4922Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <path
                  d="M45.4102 53.9551C45.4102 56.2012 46.7773 57.5195 49.1211 57.5195L57.5195 57.5195C59.8633 57.5195 61.2305 56.2012 61.2305 53.9551L61.2305 12.207C61.2305 9.96094 59.8633 8.64258 57.5195 8.64258L49.1211 8.64258C46.7773 8.64258 45.4102 9.96094 45.4102 12.207Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <path
                  d="M24.707 53.9551C24.707 56.2012 26.0742 57.5195 28.3691 57.5195L36.8164 57.5195C39.1602 57.5195 40.5273 56.2012 40.5273 53.9551L40.5273 3.56445C40.5273 1.31836 39.1602 0.0488281 36.8164 0.0488281L28.3691 0.0488281C26.0742 0.0488281 24.707 1.31836 24.707 3.56445Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <path
                  d="M4.00391 53.9551C4.00391 56.2012 5.37109 57.5195 7.66602 57.5195L16.1133 57.5195C18.457 57.5195 19.8242 56.2012 19.8242 53.9551L19.8242 20.9961C19.8242 18.7988 18.457 17.4805 16.1133 17.4805L7.66602 17.4805C5.37109 17.4805 4.00391 18.7988 4.00391 20.9961Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
              </g>
            </svg>
    ) },
  { tab: "budgetTracking", label: t("budgetTracking"), svg: (
    <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 90.5273 66.2598"
              className="w-5 h-5 inline-block mr-2"
            >
              <g>
                <rect height="66.2598" opacity="0" width="90.5273" x="0" y="0" />
                <path
                  d="M17.7246 52.2949L27.0996 52.2949C29.3457 52.2949 30.8594 50.7812 30.8594 48.6328L30.8594 41.5527C30.8594 39.4043 29.3457 37.8906 27.0996 37.8906L17.7246 37.8906C15.4785 37.8906 13.9648 39.4043 13.9648 41.5527L13.9648 48.6328C13.9648 50.7812 15.4785 52.2949 17.7246 52.2949ZM3.51562 24.7559L87.0605 24.7559L87.0605 15.9668L3.51562 15.9668ZM12.4512 66.2598L78.0762 66.2598C86.4258 66.2598 90.5273 62.207 90.5273 54.0039L90.5273 12.3047C90.5273 4.10156 86.4258 0.0488281 78.0762 0.0488281L12.4512 0.0488281C4.15039 0.0488281 0 4.10156 0 12.3047L0 54.0039C0 62.207 4.15039 66.2598 12.4512 66.2598ZM12.5488 59.2285C9.0332 59.2285 7.03125 57.3242 7.03125 53.6133L7.03125 12.6953C7.03125 8.98438 9.0332 7.08008 12.5488 7.08008L77.9785 7.08008C81.4941 7.08008 83.4961 8.98438 83.4961 12.6953L83.4961 53.6133C83.4961 57.3242 81.4941 59.2285 77.9785 59.2285Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
              </g>
            </svg>
  )},
  { tab: "map", label: t("mapHead"), svg: (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 146.729 82.8613"
      className="w-8 h-8 inline-block mr-2"
    >
      <g>
        <rect height="82.8613" opacity="0" width="146.729" x="0" y="0" />
        <path
          d="M146.729 70.5078C146.729 74.9512 143.945 77.1484 138.428 77.1484L110.975 77.1484C112.181 75.3244 112.744 73.1427 112.744 70.752C112.744 70.7359 112.744 70.7199 112.741 70.7031L139.6 70.7031C139.99 70.7031 140.234 70.5078 140.234 70.0684C140.234 61.0352 129.639 52.3926 117.432 52.3926C113.448 52.3926 109.632 53.3203 106.312 54.8982C104.949 53.209 103.359 51.5957 101.552 50.1083C106.162 47.4935 111.642 45.9473 117.432 45.9473C133.252 45.9473 146.729 57.4219 146.729 70.5078ZM132.031 25.7324C132.031 34.5215 125.439 41.748 117.432 41.748C109.521 41.748 102.881 34.5703 102.881 25.8301C102.881 17.2852 109.473 10.2539 117.432 10.2539C125.586 10.2539 132.031 17.1387 132.031 25.7324ZM109.375 25.8301C109.375 31.0059 113.135 35.2539 117.432 35.2539C121.826 35.2539 125.586 31.0059 125.586 25.7324C125.586 20.6543 121.973 16.748 117.432 16.748C113.037 16.748 109.375 20.752 109.375 25.8301Z"
          fill="currentColor"
          fillOpacity="0.85"
        />
        <path
          d="M45.1531 50.1028C43.3443 51.5895 41.7519 53.2023 40.3873 54.8911C37.0629 53.3176 33.2417 52.3926 29.248 52.3926C17.0898 52.3926 6.49414 61.0352 6.49414 70.0684C6.49414 70.5078 6.73828 70.7031 7.12891 70.7031L33.939 70.7031C33.9356 70.7199 33.9355 70.7359 33.9355 70.752C33.9355 73.1427 34.5044 75.3244 35.7178 77.1484L8.30078 77.1484C2.7832 77.1484 0 74.9512 0 70.5078C0 57.4219 13.4766 45.9473 29.248 45.9473C35.051 45.9473 40.5386 47.4911 45.1531 50.1028ZM43.8477 25.7324C43.8477 34.5215 37.2559 41.748 29.2969 41.748C21.3379 41.748 14.6973 34.5703 14.6973 25.8301C14.6973 17.2852 21.2891 10.2539 29.2969 10.2539C37.4023 10.2539 43.8477 17.1387 43.8477 25.7324ZM21.1914 25.8301C21.1914 31.0059 24.9512 35.2539 29.2969 35.2539C33.6426 35.2539 37.4023 31.0059 37.4023 25.7324C37.4023 20.6543 33.7891 16.748 29.2969 16.748C24.8535 16.748 21.1914 20.752 21.1914 25.8301Z"
          fill="currentColor"
          fillOpacity="0.85"
        />
        <path
          d="M73.3887 41.5039C82.5684 41.5039 90.1855 33.252 90.1855 23.3398C90.1855 13.4277 82.666 5.66406 73.3887 5.66406C64.1113 5.66406 56.543 13.5742 56.543 23.4375C56.543 33.3008 64.1602 41.5039 73.3887 41.5039ZM73.3887 34.9609C68.1641 34.9609 63.623 29.834 63.623 23.4375C63.623 17.041 68.0176 12.2559 73.3887 12.2559C78.7598 12.2559 83.1055 16.9434 83.1055 23.3398C83.1055 29.7363 78.6133 34.9609 73.3887 34.9609ZM49.7559 77.1484L96.9727 77.1484C103.809 77.1484 107.08 75.1465 107.08 70.752C107.08 60.6934 94.3359 45.9961 73.3398 45.9961C52.3926 45.9961 39.6484 60.6934 39.6484 70.752C39.6484 75.1465 42.9199 77.1484 49.7559 77.1484ZM47.5098 70.5566C46.9727 70.5566 46.6797 70.4102 46.6797 69.873C46.6797 64.1602 56.1035 52.5879 73.3398 52.5879C90.625 52.5879 100 64.1602 100 69.873C100 70.4102 99.7559 70.5566 99.2188 70.5566Z"
          fill="currentColor"
          fillOpacity="0.85"
        />
      </g>
    </svg>

  )},
    { tab: "accountInfo", label: t("accountInfo"), svg: (
<svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 67.3828 71.5332"
              className="w-5 h-5 inline-block mr-2"
            >
              <g>
                <rect height="71.5332" opacity="0" width="67.3828" x="0" y="0" />
                <path
                  d="M10.0586 71.4844L57.3242 71.4844C64.1602 71.4844 67.3828 69.4824 67.3828 65.0879C67.3828 55.0293 54.6875 40.332 33.6914 40.332C12.7441 40.332 0 55.0293 0 65.0879C0 69.4824 3.27148 71.4844 10.0586 71.4844ZM7.86133 64.8926C7.32422 64.8926 7.03125 64.7461 7.03125 64.209C7.03125 58.4961 16.4062 46.9238 33.6914 46.9238C50.9766 46.9238 60.3516 58.4961 60.3516 64.209C60.3516 64.7461 60.0586 64.8926 59.5215 64.8926ZM33.6914 35.8398C42.9199 35.8398 50.4883 27.5879 50.4883 17.6758C50.4883 7.76367 43.0176 0 33.6914 0C24.4629 0 16.8945 7.91016 16.8945 17.7734C16.8945 27.6367 24.5117 35.8398 33.6914 35.8398ZM33.6914 29.2969C28.5156 29.2969 23.9258 24.1699 23.9258 17.7734C23.9258 11.377 28.3691 6.5918 33.6914 6.5918C39.0625 6.5918 43.457 11.2793 43.457 17.6758C43.457 24.0723 38.9648 29.2969 33.6914 29.2969Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
              </g>
            </svg>
  )},
  ].map(({ tab, label, svg }) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`inline-block p-3 transition-all duration-300 ${
        activeTab === tab
          ? "text-blue-600 transition-none border-b-blue-600 border-b-2"
          : " text-gray-500 hover:text-blue-600 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
      }`}
    >
      {svg}
      {label}
    </button>
  ))}
</div>



        {/* Tab Content */}
        <div className="flex justify-center transition-all duration-300">
          {activeTab === "upcomingTrips" && (
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">{t('myTrips')}</h2>
              <UpcomingTrips userId={userId} />
            </div>
          )}

          {activeTab === "map" && (
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">{t('mapHead')}</h2>
              <p>{t('construction')}</p>
              {/* <FriendsDashboard userId={userId} /> */}
            </div>
          )}

          {activeTab === "budgetTracking" && (
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">{t('budgetTracking')}</h2>
              <BudgetTracking userId={userId} />
            </div>
          )}


          {activeTab === "createTrip" && (
           <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
           <h2 className="text-2xl font-bold mb-4 text-blue-500">{t('newTrip')}</h2>
           <form onSubmit={handleSubmit}>
             <div className="mb-4">
               <label htmlFor="tripName" className="block text-sm font-medium text-gray-700">{t('tripName')}</label>
               <input
                 type="text"
                 id="tripName"
                 name="tripName"
                 className="mt-1 p-2 border border-gray-300 rounded w-full"
                 value={tripName}
                 placeholder={t('tripNameDes')}
                 onChange={(e) => setTripName(e.target.value)}
                 required
               />
             </div>
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700">{t('dateFromTo')}</label>
               <style>
                 {`
                   .rdrDefinedRangesWrapper {
                     display: none;
                   }
                 `}
               </style>
               <DateRangePicker
                 ranges={dateRange}
                 onChange={handleDateChange}
                 moveRangeOnFirstSelection={false}
                 rangeColors={["#3b82f6"]}
                 minDate={new Date()}
                 weekStartsOn={1}
                 dragSelectionEnabled={true}
                 fixedHeight={true}
                 staticRanges={[]}
                 inputRanges={[]}
                 locale={getLocale()}
                 className="w-fit border border-gray-300 rounded m-auto relative left-2/4 transform -translate-x-2/4"   
               />
             </div>
             <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mt-4 hover:bg-blue-600 transition duration-300 transform hover:shadow-2xl">
                {t('createTrip')}
             </button>
           </form>
         </div>
          )}

          {activeTab === "statistics" && (
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full  sm:w-10/12 md:w-8/12 lg:w-6/12">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">{t('statsHead')}</h2>
              <p>{t('statsDistance')} <strong>{statistics.distance} km</strong></p>
              <p>{t('statsTime')} <strong>{statistics.time} {t('hours')}</strong></p>
            </div>
          )}

          {activeTab === "accountInfo" && (
            <AccountInfo />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
