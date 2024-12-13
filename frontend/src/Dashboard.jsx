import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AccountInfo from "./AccountInfo";
import { DateRangePicker } from "react-date-range";
import { cs } from "date-fns/locale"; // český jazykový balíček
import "react-date-range/dist/styles.css"; // základní styly
import "react-date-range/dist/theme/default.css"; // výchozí téma
import { LoadScript } from '@react-google-maps/api';
import BudgetTracking from "./BudgetTracking";
// import Map from "./Map";
import GoogleMap from "./GoogleMaps";
import MapComponent from "./MapComponent";
import UpcomingTrips from "./UpcomingTrips";

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
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [tripHistory, setTripHistory] = useState([]);
  const [statistics, setStatistics] = useState({ distance: 0, time: 0 });

  const navigate = useNavigate(); // useNavigate hook for navigation
  const location = useLocation(); // useLocation to get URL parameters

  useEffect(() => {
    // Function to fetch user data and set user ID
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('token'); // Replace with your token management logic

        const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });

        const result = await response.json();
        if (response.ok) {
          setUserId(result.id); // Store the user ID from the response
          
        } else {
          console.error('Error fetching user ID:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const delayFetch = setTimeout(() => {
      fetchUserId();
    }, 1000); // Delay by 1000 ms (1 second)
  
    return () => clearTimeout(delayFetch); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(userId);
    

    if (!userId) {
      console.error('User ID not available');
      return;
    }

    const tripData = {
      userId: userId, // Include the user ID in the trip data
      title: tripName,
      startDate: dateRange[0].startDate.toLocaleDateString("en-CA"),
      endDate: dateRange[0].endDate.toLocaleDateString("en-CA"),
      activities: [], // Initialize as an empty array or adjust if needed
    };

    try {
      const token = localStorage.getItem('token'); // Replace with your token management logic

      // console.log('Creating trip:', tripData);
      
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
        const startDate = dateRange[0].startDate.toLocaleDateString("en-CA"); // Formát YYYY-MM-DD
        const endDate = dateRange[0].endDate.toLocaleDateString("en-CA"); // Formát YYYY-MM-DD
        
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
    // Získat token z URL, pokud je přítomen
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      // Uložit token do localStorage
      localStorage.setItem("token", token);

      // Odstranit token z URL, aby nebyl vidět v adrese
      navigate("/dashboard", { replace: true });
    } else {
      // Získat token z localStorage
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
      <div className="max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="w-full text-center overflow-x-scroll whitespace-nowrap space-x-4 md:space-x-8 mb-6 px-4">
          <button
            onClick={() => setActiveTab("createTrip")}
            className={`inline-block p-3 transition-all duration-300 ${activeTab === "createTrip" ? "text-blue-500 transition-none border-b-blue-600 border-b-2" : "text-gray-500 hover:text-blue-400 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"}`}
          >
            📝 Plan a Trip
          </button>
          <button 
            onClick={() => setActiveTab("upcomingTrips")}
            className={`inline-block p-3 transition-all duration-300 ${activeTab === "upcomingTrips" ? "text-blue-500 transition-none border-b-blue-600 border-b-2" : "text-gray-500 hover:text-blue-400 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"}`}
          >
            🗓️ Trips
          </button>
          {/* <button 
            onClick={() => setActiveTab("tripHistory")}
            className={`inline-block p-3 transition-all duration-300 ${activeTab === "tripHistory" ? "text-blue-500 transition-none border-b-blue-600 border-b-2" : "text-gray-500 hover:text-blue-400 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"}`}
          >
            📅 Trip History
          </button> */}
          <button 
            onClick={() => setActiveTab("statistics")}
            className={`inline-block p-3 transition-all duration-300 ${activeTab === "statistics" ? "text-blue-500 transition-none border-b-blue-600 border-b-2" : "text-gray-500 hover:text-blue-400 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"}`}
          >
            📊 Statistics
          </button>
          <button
            onClick={() => setActiveTab("budgetTracking")}
            className={`inline-block p-3 transition-all duration-300 ${activeTab === "budgetTracking" ? "text-blue-500 transition-none border-b-blue-600 border-b-2" : "text-gray-500 hover:text-blue-400 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"}`}
          >
            💰 Budget Tracking
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={`inline-block p-3 transition-all duration-300 ${activeTab === "map" ? "text-blue-500 transition-none border-b-blue-600 border-b-2" : "text-gray-500 hover:text-blue-400 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"}`}
          >
            🗺️ Map
          </button>
          <button 
            onClick={() => setActiveTab("accountInfo")}
            className={`inline-block p-3 transition-all duration-300 ${activeTab === "accountInfo" ? "text-blue-500 transition-none border-b-blue-600 border-b-2" : "text-gray-500 hover:text-blue-400 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"}`}
          >
            👤 Account Info
          </button>
        </div>


        {/* Tab Content */}
        <div className="flex justify-center transition-all duration-300">
          {activeTab === "upcomingTrips" && (
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">My Trips</h2>
              <UpcomingTrips userId={userId} />
        </div>
          )}

          {activeTab === "map" && (
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Map</h2>
              <p>Under construction...</p>
            </div>
          )}

          {activeTab === "budgetTracking" && (
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Budget Tracking</h2>
              {/* <p>Under construction...</p> */}
              <BudgetTracking userId={userId} />
            </div>
          )}


          {activeTab === "createTrip" && (
           <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
           <h2 className="text-2xl font-bold mb-4 text-blue-500">Plan a New Trip</h2>
           <form onSubmit={handleSubmit}>
             <div className="mb-4">
               <label htmlFor="tripName" className="block text-sm font-medium text-gray-700">Název výletu</label>
               <input
                 type="text"
                 id="tripName"
                 name="tripName"
                 className="mt-1 p-2 border border-gray-300 rounded w-full"
                 value={tripName}
                 onChange={(e) => setTripName(e.target.value)}
                 required
               />
             </div>
             <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700">Datum od - do</label>
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
                 locale={cs}
                 className="w-fit border border-gray-300 rounded m-auto relative left-2/4 transform -translate-x-2/4"   
               />
             </div>
             <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mt-4 hover:bg-blue-600">
               Vytvořit výlet
             </button>
           </form>
         </div>
          )}
          
          {/* {activeTab === "tripHistory" && (
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Trip History</h2>
              {tripHistory.length > 0 ? (
                <ul>
                  {tripHistory.map((trip, index) => (
                    <li key={index} className="border-b py-2">{trip.destination} on {trip.date}</li>
                  ))}
                </ul>
              ) : (
                <p>No past trips.</p>
              )}
            </div>
          )} */}

          {activeTab === "statistics" && (
            <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
              <h2 className="text-2xl font-bold mb-4 text-blue-500">Travel Statistics</h2>
              <p>Total distance traveled: <strong>{statistics.distance} km</strong></p>
              <p>Total time spent traveling: <strong>{statistics.time} hours</strong></p>
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
