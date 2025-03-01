import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { cs, enUS } from "date-fns/locale";
import MapComponent from "./MapComponent";
import { useTranslation } from "react-i18next";
import { LoadScript } from "@react-google-maps/api";
import { toast, ToastContainer, Slide } from "react-toastify";


const libraries = ["places"];

const PublicTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [dailyPlans, setDailyPlans] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentDayData, setCurrentDayData] = useState(null);
  const [inputType, setInputType] = useState("location");
  const [accommodationSegment, setAccommodationSegment] = useState("");
  const { t, i18n } = useTranslation();
  const [accommodationCost, setAccommodationCost] = useState(0);
  const [tripTotal, setTripTotal] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/trip/public/${tripId}`)
      .then((res) => res.json())
      .then((data) => {
        try {
          const activities = typeof data.activities === "string" ? JSON.parse(data.activities) : data.activities || [];
          const budgets = typeof data.budgets === "string" ? JSON.parse(data.budgets) : data.budgets || [];
          setAccommodationCost(data.accommodationCost || 0);
          setTripTotal(data.totalCost || 0);
  
          setDailyPlans(convertDailyPlans(activities, budgets, data.startDate, data.endDate, accommodationCost, tripTotal));
          setTrip(data);
        } catch (error) {
          console.error("Error parsing trip data:", error);
        }
      })
      .catch((err) => console.error("Error fetching trip:", err));
  }, [tripId]);

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

      useEffect(() => {
        const updateTheme = () => {
          setTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', updateTheme); // Listen for storage changes
        return () => window.removeEventListener('storage', updateTheme);
      }, []);
  
  

  const convertDailyPlans = (activities, budgets, startDate, endDate) => {
    const dateRange = eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate),
    });
  
    return dateRange.map((date, index) => ({
      date,
      plan: activities?.[index]?.plan || "",
      location: activities?.[index]?.location || "",
      route: activities?.[index]?.route || { start: "", end: "", stops: [] },
      expenses: budgets?.[index]?.expenses || [], // Oprava: bere správně daily budgets
    }));
  };
  

  const getLocale = () => {
    return i18n.language === "cs" ? cs : enUS;
  };

  const handleClearMap = () => {
    setCurrentDayData(null);
  };

  const handleDayClick = (index) => {
    if (index === "accommodation") {
      setAccommodationSegment('accommodation'); // Aktivujeme segment ubytování
      setCurrentDayData(null);
      setCurrentDayIndex(null); // Nevybíráme žádný den
    }else{
      setAccommodationSegment(null);
      handleClearMap();
      setCurrentDayIndex(index);
      setTimeout(() => {
        setCurrentDayData(dailyPlans[index]);
      }, 0); 
    }
    

    // Při změně dne resetuje mapu
    if (dailyPlans[index].location) {
      setInputType("location");
    } else if (dailyPlans[index].route.start || dailyPlans[index].route.end || dailyPlans[index].route.stops.length > 0) {
      setInputType("route");
    }
  };


  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 dark:from-black dark:to-gray-900 ">
      <Navbar />
      <ToastContainer theme={theme} />
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-center flex-grow dark:text-white">{trip.tripName}
          <button
          onClick={() => {
            const shareUrl = `${import.meta.env.VITE_APP_URL}/trip/${tripId}`;
            navigator.clipboard.writeText(shareUrl).then(() => {
                toast.success(t('copiedToClipboard'), {
                    position: "top-right", 
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    transition: Slide,
                  });
            });
          }}
          className="p-2 hover:opacity-80 hover:text-blue-500 transition-opacity"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 68.7012 102.686"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <rect height="102.686" opacity="0" width="68.7012" x="0" y="0" />
              <path
                d="M68.7012 43.1152L68.7012 80.6152C68.7012 88.8184 64.5996 92.8711 56.25 92.8711L12.4512 92.8711C4.15039 92.8711 0 88.8184 0 80.6152L0 43.1152C0 34.9121 4.15039 30.8594 12.4512 30.8594L23.1934 30.8594L23.1934 37.8906L12.5488 37.8906C9.0332 37.8906 7.03125 39.7949 7.03125 43.5059L7.03125 80.2246C7.03125 83.9355 9.0332 85.8398 12.5488 85.8398L56.1523 85.8398C59.6191 85.8398 61.6699 83.9355 61.6699 80.2246L61.6699 43.5059C61.6699 39.7949 59.6191 37.8906 56.1523 37.8906L45.459 37.8906L45.459 30.8594L56.25 30.8594C64.5996 30.8594 68.7012 34.9609 68.7012 43.1152Z"
                fill="currentColor"
              />
              <path
                d="M34.3262 62.5977C36.2305 62.5977 37.8418 61.084 37.8418 59.2285L37.8418 21.2402L37.5488 15.3809L39.502 17.4805L44.873 23.3398C45.5078 24.0723 46.3867 24.3652 47.2656 24.3652C49.0723 24.3652 50.4395 23.0957 50.4395 21.3379C50.4395 20.4102 50.0488 19.6777 49.4141 19.043L36.8652 7.08008C35.9863 6.15234 35.2539 5.9082 34.3262 5.9082C33.4473 5.9082 32.7148 6.15234 31.7871 7.08008L19.2871 19.043C18.6035 19.6777 18.2617 20.4102 18.2617 21.3379C18.2617 23.0957 19.5801 24.3652 21.3867 24.3652C22.2168 24.3652 23.1934 24.0723 23.7793 23.3398L29.1992 17.4805L31.1523 15.3809L30.8594 21.2402L30.8594 59.2285C30.8594 61.084 32.4707 62.5977 34.3262 62.5977Z"
                fill="currentColor"
              />
            </g>
          </svg>
        </button>
          </h1>
        </div>

        <div className="md:flex md:space-x-4 flex-col md:flex-row">
          <div className="md:w-2/3 w-full border rounded-lg p-4 max-h-[600px] overflow-y-auto shadow-md bg-white dark:bg-gray-900 dark:border-gray-700">
          {accommodationSegment === 'accommodation' ? (
          <div className="p-6 bg-white rounded-xl dark:bg-gray-900">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">
              {t('accomodationCost')}
          </h2>
      
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner dark:bg-gray-800">
              <label className="block text-lg font-medium text-gray-700 mb-2 dark:text-gray-300">
                  {t('accomodationCost')}
              </label>
              <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                  {Math.round(accommodationCost) || 0}
              </div>
          </div>
      
          <div className="flex justify-between items-center font-semibold text-lg text-gray-800 mt-4 p-3 border-t dark:border-gray-700 dark:text-gray-300">
              <span>{t('totalBudget')}</span>
              <span className="text-blue-600 text-xl font-bold dark:text-blue-400">
                  {Math.round(tripTotal)} CZK
              </span>
          </div>
      </div>
      
        
        
        ) : (
            dailyPlans.length > 0 && (
              <div>
               <div className="relative">
               <h2 className="text-xl font-semibold mb-2 dark:text-white">
                  {t("day")} {currentDayIndex + 1} - {format(dailyPlans[currentDayIndex].date, "dd.MM.yyyy")}
                  <span className="text-center right-4 absolute">
                    {format(dailyPlans[currentDayIndex].date, "EEEE", { locale: getLocale() })}
                  </span>
                </h2>
               </div>

                <p className="dark:text-white"><strong>{t("dailyActivity")}</strong></p>
                <div className="border p-2 rounded bg-gray-100 mb-4 dark:bg-black dark:border-gray-800">
                    <p className="text-gray-600 dark:text-white">{dailyPlans[currentDayIndex].plan || t("noActivity")}</p>
                </div>


                <h3 className="font-bold text-lg mb-2 dark:text-white">{t("dailyBudget")}</h3>
                <div className="space-y-2">
                {dailyPlans[currentDayIndex]?.expenses?.length > 0 ? (
                    dailyPlans[currentDayIndex].expenses.map((expense, index) => (
                <div 
                  key={index} 
                  className="border-l-4 border-blue-600 p-3 rounded shadow-md bg-gray-50 flex justify-between items-center 
                            dark:bg-black dark:border-l-blue-500 dark:border-gray-800"
                >
                    <div>
                        <p className="font-semibold text-gray-700 dark:text-white">{t(expense.category || "Other")}</p>
                        <p className="text-gray-500 dark:text-gray-400">{expense.description || t("noDescription")}</p>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                        {Math.round(expense.amount) || 0} CZK
                    </span>
                </div>

                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-200">{t("noExpenses")}</p>
                )}
                </div>

                <div 
                  className="bg-blue-100 text-blue-800 font-bold text-lg p-3 rounded-md shadow-md mt-4 mb-4 flex justify-between 
                            dark:bg-blue-900 dark:text-blue-200"
                >
                    <span>{t("totalDailyExpense")}</span>
                    <span>{Math.round(dailyPlans[currentDayIndex]?.expenses?.reduce((sum, expense) => sum + (expense.amount || 0), 0))} CZK</span>
                </div>



                {dailyPlans[currentDayIndex].location && (
                <div className="border p-2 rounded bg-gray-100 mb-4 dark:bg-black dark:border-gray-800">
                <p className="dark:text-white"><strong>{t("location")}:</strong></p>
                <p className="text-gray-600 dark:text-gray-300">{dailyPlans[currentDayIndex].location}</p>
            </div>
            
                )}

                {dailyPlans[currentDayIndex].route.start && dailyPlans[currentDayIndex].route.end && (
               <div className="border p-3 rounded bg-gray-100 mb-4 dark:bg-black dark:border-gray-800">
               <p className="font-bold dark:text-white">{t("route")}</p>
           
               <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                   <span className="text-green-600 font-bold dark:text-green-400">Start:</span>
                   <span>{dailyPlans[currentDayIndex].route.start}</span>
               </div>
           
               <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                   <span className="text-red-600 font-bold dark:text-red-400">End:</span>
                   <span>{dailyPlans[currentDayIndex].route.end}</span>
               </div>
           
               {dailyPlans[currentDayIndex].route.stops.length > 0 && (
                   <div className="mt-2">
                       <p className="text-gray-500 font-semibold dark:text-gray-400">{t("stops")}:</p>
                       <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                           {dailyPlans[currentDayIndex].route.stops.map((stop, index) => (
                               <li key={index}>{stop}</li>
                           ))}
                       </ul>
                   </div>
               )}
           </div>
           
                )}


                
                <div className="mt-6 mb-4">
                  <MapComponent
                    location={inputType === "location" ? dailyPlans[currentDayIndex]?.location : null}
                    route={inputType === "route" ? dailyPlans[currentDayIndex]?.route : { start: "", end: "", stops: [] }}
                    clearMap={!currentDayData}
                    overviewMode={false}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="md:w-1/3 w-full border rounded-lg p-4 shadow-md max-h-[600px] mt-6 md:mt-0 overflow-y-auto bg-white dark:bg-gray-900 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-2 dark:text-white">{t("calendar")}</h3>
            <div className="space-y-2">
                {dailyPlans.map((day, index) => (
                    <button
                        key={index}
                        className={`w-full text-left p-2 border rounded 
                                    ${index === currentDayIndex ? "bg-blue-200 dark:bg-blue-800" : "hover:bg-gray-100 dark:hover:bg-gray-700"} 
                                    dark:border-gray-700 dark:text-gray-300`}
                        onClick={() => handleDayClick(index)}
                    >
                        {t("day")} {index + 1} ({format(day.date, "EEEE", { locale: getLocale() })}) - {format(day.date, "dd.MM.yyyy")}
                    </button>
                ))}
            </div>
            <button
                className={`w-full text-left mt-2 p-2 border rounded 
                            ${accommodationSegment === 'accommodation' ? 'bg-blue-200 dark:bg-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} 
                            dark:border-gray-700 dark:text-gray-300`}
                onClick={() => handleDayClick('accommodation')}
            >
                {t('accomodationCost')}
            </button>
        </div>

        </div>
      </div>
        </LoadScript>
    </div>
  );
};

export default PublicTrip;
