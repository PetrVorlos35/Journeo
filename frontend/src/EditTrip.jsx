import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useState, useEffect, useRef } from "react";
import { format, eachDayOfInterval, set } from "date-fns";
import { cs, enUS } from "date-fns/locale";
import MapComponent from "./MapComponent";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer, Slide } from "react-toastify";
import OverviewMap from "./OverviewMap";

const libraries = ["places"];


const CreateTrip = () => {
  const location = useLocation();
  const { tripName = '', startDate = '', endDate = '', tripId = null } = location.state || {};
  const [tripTitle, setTripTitle] = useState(tripName);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [dailyPlans = [], setDailyPlans] = useState([]);
  const [currentDayData, setCurrentDayData] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [accommodationSegment, setAccommodationSegment] = useState("");
  const [inputType, setInputType] = useState('location'); 
  const [dailyBudgets = [], setDailyBudgets] = useState([]); 
  const [accommodationCost, setAccommodationCost] = useState(location.state.accommodationCost || 0);
  const [accommodationEntries, setAccommodationEntries] = useState(location.state.accommodationEntries || []);
  const [tempPlan, setTempPlan] = useState("");
  const [showOverview, setShowOverview] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isEditingDayTitle, setIsEditingDayTitle] = useState(false);
  const [tempDayTitle, setTempDayTitle] = useState("");


  const { t, i18n } = useTranslation();
  
useEffect(() => { 
  fetch(`${import.meta.env.VITE_API_URL}/account`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  .then((response) => response.json())
  .then((data) => {
    setUserId(data.id);
    handleDayClick(0);
  })
  .catch((error) => {
    console.error('Error fetching user data:', error);
  });
}
, []
);

  const navigate = useNavigate();

  const handleClearMap = () => {
    setCurrentDayData(null);
  };

  useEffect(() => {
    setTempPlan(dailyPlans[currentDayIndex]?.plan || ''); 
  }, [currentDayIndex, dailyPlans]);

  const handleTitleChange = (e) => {
    setTripTitle(e.target.value);
  };
  
  const handleBlur = () => {
    setIsEditingTitle(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditingTitle(false);
    }
  };

  const handleDayTitleClick = () => {
    setTempDayTitle(dailyPlans[currentDayIndex]?.title || "");
    setIsEditingDayTitle(true);
  };
  
  const handleDayTitleChange = (e) => {
    setTempDayTitle(e.target.value);
  };
  
  const handleDayTitleBlur = () => {
    saveDayTitle();
  };
  
  const handleDayTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveDayTitle();
    }
  };
  
  const saveDayTitle = () => {
    const updatedPlans = [...dailyPlans];
    updatedPlans[currentDayIndex].title = tempDayTitle.trim() || `${t('day')} ${currentDayIndex + 1}`;
    setDailyPlans(updatedPlans);
    setIsEditingDayTitle(false);
  };
  
  const convertDailyPlans = (activities, startDate, endDate) => {
    const dateRange = eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate),
    });
  
    return dateRange.map((date, index) => ({
      date,
      plan: activities[index]?.plan || '',
      location: activities[index]?.location || '',
      route: activities[index]?.route || { start: '', end: '', stops: [] },
      title: activities[index]?.title || `${t('day')} ${index + 1}`,
    }));
  };

  const getLocale = () => {
    switch (i18n.language) {
      case "cs":
        return cs;
      case "en":
      default:
        return enUS;
    }
  };
  
  const convertDailyBudgets = (dailyBudgets, length) => {
    return Array.from({ length }, (_, index) => ({
      expenses: dailyBudgets[index]?.expenses?.map(expense => ({
        category: expense.category || "other",
        amount: expense.amount || 0,
        description: expense.description || "",
      })) || [],
    }));
  };
  
  

  useEffect(() => {
    if (startDate && endDate) {
      const days = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      });
  
      const budgets = days.map(() => ({ expenses: [] }));
  
      const activities = location.state.activities 
        ? JSON.parse(location.state.activities) 
        : [];
  
      const budgetsData = location.state.budgets 
        ? JSON.parse(location.state.budgets) 
        : budgets;
  
      const convertedPlans = convertDailyPlans(activities, startDate, endDate);
      const convertedBudgets = convertDailyBudgets(budgetsData, days.length);
  
      setDailyPlans(convertedPlans);
      setDailyBudgets(convertedBudgets);
      setAccommodationEntries(location.state.accommodationEntries ? JSON.parse(location.state.accommodationEntries) : []);
    }
  }, [startDate, endDate]);
  
  

  useEffect(() => {
    if (dailyPlans.length > 0) {
        setTimeout(() => {
            handleDayClick(0);
        }, 100);
    }
}, []);

const hasInitialized = useRef(false);

useEffect(() => {
  if (dailyPlans.length > 0 && !hasInitialized.current) {
    handleDayClick(0); // Spustí se jen jednou při prvním načtení a až bude dailyPlans připraveno
    hasInitialized.current = true; // Nastavíme flag, aby se to už nespustilo znovu
  }
}, [dailyPlans]);



const handleUpdate = async () => {
  const token = localStorage.getItem("token");

  // Vytvoříme pole slibů pro výpočet tras
  const routePromises = dailyPlans.map((plan, index) => {
      if (plan.route.start && plan.route.end) {
          return new Promise((resolve, reject) => {
              const directionsService = new google.maps.DirectionsService();
              directionsService.route(
                  {
                      origin: plan.route.start,
                      destination: plan.route.end,
                      travelMode: google.maps.TravelMode.DRIVING,
                      waypoints: plan.route.stops.map((stop) => ({ location: stop, stopover: true })),
                      provideRouteAlternatives: true,
                  },
                  (result, status) => {
                      if (status === "OK" && result.routes.length > 0) {
                          const routeLegs = result.routes[0].legs;
                          const totalDistance = routeLegs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000; // v km
                          const totalDuration = routeLegs.reduce((acc, leg) => acc + leg.duration.value, 0); // v sekundách
                          const formattedDuration = `${Math.floor(totalDuration / 3600)} h ${Math.floor((totalDuration % 3600) / 60)} min`;

                          resolve({
                              index,
                              distance: `${totalDistance.toFixed(1)} km`,
                              duration: formattedDuration,
                          });
                      } else {
                          resolve({ index, distance: "0 km", duration: "0 h 0 min" }); // Defaultní hodnoty
                      }
                  }
              );
          });
      } else {
          return Promise.resolve({ index, distance: "0 km", duration: "0 h 0 min" });
      }
  });

  try {
      // Počkáme na všechny výsledky tras
      const routeInfos = await Promise.all(routePromises);

      // Aktualizujeme dailyPlans s trasovými informacemi
      const updatedPlans = [...dailyPlans];
      routeInfos.forEach(({ index, distance, duration }) => {
          updatedPlans[index].routeInfo = { distance, duration };
      });

      // Odeslání dat do API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/updateActivities`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              tripId,
              activities: updatedPlans,
              budgets: dailyBudgets,
              accommodationEntries,
              accommodationCost: calculateAccommodationTotal(),
              totalCost: calculateTripTotal(),
              startDate: format(dailyPlans[0].date, "yyyy-MM-dd"),
              endDate: format(dailyPlans[dailyPlans.length - 1].date, "yyyy-MM-dd"),
              tripName: tripTitle,
          })
      });

      const result = await response.json();
      if (response.ok) {
          console.log(result);
          navigate('/dashboard');
      }

  } catch (error) {
      console.error("Error calculating route statistics:", error);
  }
};

const handleSave = async () => {
  const token = localStorage.getItem("token");

  // Vytvoříme pole slibů pro výpočet tras
  const routePromises = dailyPlans.map((plan, index) => {
      if (plan.route.start && plan.route.end) {
          return new Promise((resolve, reject) => {
              const directionsService = new google.maps.DirectionsService();
              directionsService.route(
                  {
                      origin: plan.route.start,
                      destination: plan.route.end,
                      travelMode: google.maps.TravelMode.DRIVING,
                      waypoints: plan.route.stops.map((stop) => ({ location: stop, stopover: true })),
                      provideRouteAlternatives: true,
                  },
                  (result, status) => {
                      if (status === "OK" && result.routes.length > 0) {
                          const routeLegs = result.routes[0].legs;
                          const totalDistance = routeLegs.reduce((acc, leg) => acc + leg.distance.value, 0) / 1000; // v km
                          const totalDuration = routeLegs.reduce((acc, leg) => acc + leg.duration.value, 0); // v sekundách
                          const formattedDuration = `${Math.floor(totalDuration / 3600)} h ${Math.floor((totalDuration % 3600) / 60)} min`;

                          resolve({
                              index,
                              distance: `${totalDistance.toFixed(1)} km`,
                              duration: formattedDuration,
                          });
                      } else {
                          resolve({ index, distance: "0 km", duration: "0 h 0 min" }); // Defaultní hodnoty
                      }
                  }
              );
          });
      } else {
          return Promise.resolve({ index, distance: "0 km", duration: "0 h 0 min" });
      }
  });

  try {
      // Počkáme na všechny výsledky tras
      const routeInfos = await Promise.all(routePromises);

      // Aktualizujeme dailyPlans s trasovými informacemi
      const updatedPlans = [...dailyPlans];
      routeInfos.forEach(({ index, distance, duration }) => {
          updatedPlans[index].routeInfo = { distance, duration };
      });

      // Odeslání dat do API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/updateActivities`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
              tripId,
              activities: updatedPlans,
              budgets: dailyBudgets,
              accommodationEntries,
              accommodationCost: calculateAccommodationTotal(),
              totalCost: calculateTripTotal(),
              startDate: format(dailyPlans[0].date, "yyyy-MM-dd"),
              endDate: format(dailyPlans[dailyPlans.length - 1].date, "yyyy-MM-dd"),   
              tripName: tripTitle,   
          })
      });

      const result = await response.json();
      if (response.ok) {
          console.log(result);
          toast.success(t('savedPlanSuccess'), {
            position: "top-right", 
            autoClose: 3000, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Slide,
          });
      }

  } catch (error) {
      console.error("Error calculating route statistics:", error);
  }
};




      const handleLocationChange = (value, index) => {
        const updatedPlans = [...dailyPlans];
        updatedPlans[currentDayIndex].location = value;
        updatedPlans[currentDayIndex].route = { start: '', end: '', stops: [] }; 
        setDailyPlans(updatedPlans);
        setTimeout(() => {
            setCurrentDayData(dailyPlans[index]);
          }, 0); 
      };

      const calculateDailyTotal = (budget) => {
        return (budget.expenses || []).reduce((sum, expense) => sum + expense.amount, 0);
      };
      

      const calculateAccommodationTotal = () => 
        accommodationEntries.reduce((sum, entry) => sum + entry.cost, 0);
      
      const calculateTripTotal = () =>
        dailyBudgets.reduce((total, budget) => total + calculateDailyTotal(budget), 0) +
        calculateAccommodationTotal();
      


        const handleRouteChange = (field, value) => {
          const updatedPlans = [...dailyPlans];
          if (field === 'stops') {
            updatedPlans[currentDayIndex].route.stops = value;
          } else {
            updatedPlans[currentDayIndex].route[field] = value;
          }
          updatedPlans[currentDayIndex].location = '';
          setDailyPlans(updatedPlans);
        };


      const addStop = () => {
        const updatedPlans = [...dailyPlans];
        updatedPlans[currentDayIndex].route.stops.push('');
        setDailyPlans(updatedPlans);
      };

      const removeStop = (index) => {
        const updatedPlans = [...dailyPlans];
        updatedPlans[currentDayIndex].route.stops = updatedPlans[currentDayIndex].route.stops.filter((_, i) => i !== index);
        setDailyPlans(updatedPlans);
      };

      const [showExitModal, setShowExitModal] = useState(false);
      const [showConfirmModal, setShowConfirmModal] = useState(false);
      const [dayToRemove, setDayToRemove] = useState(null);

      const confirmRemoveDay = (position) => {
        setDayToRemove(position);
        setShowConfirmModal(true);
      };

      const removeDay = () => {
        let newIndex = currentDayIndex; // Store the new index after removal
      
        if (dayToRemove === "start") {
          if (dailyPlans.length > 1) {
            const updatedPlans = dailyPlans.slice(1).map((plan, index) => ({
              ...plan,
              title: plan.title.match(/^(Den|Day) \d+$/) ? `${t('day')} ${index + 1}` : plan.title,
            }));
            setDailyPlans(updatedPlans);
            setDailyBudgets(dailyBudgets.slice(1));
      
            if (currentDayIndex === 0) {
              newIndex = 0; // Stay at the first day
            } else {
              newIndex = Math.max(0, currentDayIndex - 1); // Move back if possible
            }
          }
        } else if (dayToRemove === "end") {
          if (dailyPlans.length > 1) {
            setDailyPlans(dailyPlans.slice(0, -1));
            setDailyBudgets(dailyBudgets.slice(0, -1));
      
            if (currentDayIndex === dailyPlans.length - 1) {
              newIndex = Math.max(0, currentDayIndex - 1); // Move to the previous day if it was the last one
            }
          }
        }
      
        setCurrentDayIndex(newIndex); // Ensure we move to a valid day
        setTimeout(() => {
          setCurrentDayData(dailyPlans[newIndex]); // Update day data after removal
        }, 0);
      
        setShowConfirmModal(false);
      };
      
      

      const addDayAtStart = () => {
        const newDate = new Date(dailyPlans[0].date);
        newDate.setDate(newDate.getDate() - 1);
      
        const newDay = {
          date: newDate,
          plan: '',
          location: '',
          route: { start: '', end: '', stops: [] },
          title: `${t('day')} 1`,
        };
      
        const updatedPlans = [newDay, ...dailyPlans].map((plan, index) => ({
          ...plan,
          title: plan.title.match(/^(Den|Day) \d+$/) ? `${t('day')} ${index + 1}` : plan.title,
        }));
      
        setDailyPlans(updatedPlans);
        setDailyBudgets([{ expenses: [] }, ...dailyBudgets]);
      };
      

      const addDayAtEnd = () => {
        const newDate = new Date(dailyPlans[dailyPlans.length - 1].date);
        newDate.setDate(newDate.getDate() + 1);
        
        const newDay = {
          date: newDate,
          plan: '',
          location: '',
          route: { start: '', end: '', stops: [] },
          title: `${t('day')} ${dailyPlans.length + 1}`,
        };
      
        setDailyPlans([...dailyPlans, newDay]);
        setDailyBudgets([...dailyBudgets, { expenses: [] }]);
      };

      const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [autocompleteLocation, setAutocompleteLocation] = useState(null);
    const [autocompleteStops, setAutocompleteStops] = useState([]);
    const [locationInputs, setLocationInputs] = useState(dailyPlans.map(plan => plan.location || ''));

    useEffect(() => {
      setLocationInputs(dailyPlans.map(plan => plan.location || ''));
  }, [dailyPlans]);

    const onLoadStart = (autocomplete) => {
        setAutocompleteStart(autocomplete);
    };

    const onPlaceChangedStart = () => {
        if (autocompleteStart !== null) {
            const place = autocompleteStart.getPlace();
            handleRouteChange('start', place.formatted_address);
        }
    };

    const onLoadEnd = (autocomplete) => {
        setAutocompleteEnd(autocomplete);
    };

    const onPlaceChangedEnd = () => {
        if (autocompleteEnd !== null) {
            const place = autocompleteEnd.getPlace();
            handleRouteChange('end', place.formatted_address);
        }
    };

    const onLoadLocation = (autocomplete) => {
      setAutocompleteLocation(autocomplete);
  };


  const onPlaceChangedLocation = () => {
    if (autocompleteLocation !== null) {
        const place = autocompleteLocation.getPlace();
        const formattedAddress = place.formatted_address;
        handleLocationChange(formattedAddress, currentDayIndex);
        const newLocationInputs = [...locationInputs];
        newLocationInputs[currentDayIndex] = formattedAddress;
        setLocationInputs(newLocationInputs);
    }
};

const handleLocationInputChange = (e) => {
  const newLocationInputs = [...locationInputs];
  newLocationInputs[currentDayIndex] = e.target.value;
  setLocationInputs(newLocationInputs);
};


  const onLoadStop = (autocomplete, index) => {
      const newAutocompleteStops = [...autocompleteStops];
      newAutocompleteStops[index] = autocomplete;
      setAutocompleteStops(newAutocompleteStops);
  };

  const onPlaceChangedStop = (index) => {
      if (autocompleteStops[index] !== null) {
          const place = autocompleteStops[index].getPlace();
          const updatedStops = [...dailyPlans[currentDayIndex].route.stops];
          updatedStops[index] = place.formatted_address;
          handleRouteChange('stops', updatedStops);
      }
  };


      const handleInputTypeChange = (type) => {
        setInputType(type);
      };

      const handleDayClick = (index, scroll) => {
        if (index === 'accommodation') {
          setAccommodationSegment('accommodation'); // Aktivujeme segment ubytování
          setCurrentDayData(null);
          setCurrentDayIndex(null); // Nevybíráme žádný den
          } else {
          setAccommodationSegment(null);
          handleClearMap();
          setCurrentDayIndex(index);
          setTimeout(() => {
            setCurrentDayData(dailyPlans[index]);
          }, 0);
        }

        if (scroll){
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      
        const dayData = dailyPlans[index];
        if (dayData?.location) {
          setInputType('location');
        } else if (dayData?.route?.start || dayData?.route?.end || dayData?.route?.stops.length > 0) {
          setInputType('route');
        }
      };
      

      const handlePrevDay = () => {
        if (currentDayIndex > 0) {
          const prevIndex = currentDayIndex - 1;
          handleClearMap();
          setTimeout(() => {
            setCurrentDayIndex(prevIndex);
            setCurrentDayData(dailyPlans[prevIndex]);
          }, 0); 

          const dayData = dailyPlans[prevIndex];
          if (dayData.location) {
            setInputType('location');
          } else if (dayData.route.start || dayData.route.end || dayData.route.stops.length > 0) {
            setInputType('route');
          }
        }
      };

      const handleNextDay = () => {
        if (currentDayIndex < dailyPlans.length - 1) {
          const nextIndex = currentDayIndex + 1;
          handleClearMap(); 
          setTimeout(() => {
            setCurrentDayIndex(nextIndex);
            setCurrentDayData(dailyPlans[nextIndex]);
          }, 0); 

          const dayData = dailyPlans[nextIndex];
          if (dayData.location) {
            setInputType('location');
          } else if (dayData.route.start || dayData.route.end || dayData.route.stops.length > 0) {
            setInputType('route');
          }
        }
      };

      const addExpense = () => {
        const updatedBudgets = [...dailyBudgets];
        updatedBudgets[currentDayIndex].expenses = [
          ...(updatedBudgets[currentDayIndex].expenses || []),
          { category: "transport", amount: 0, description: "" },
        ];
        setDailyBudgets(updatedBudgets);
      };

      const addAccommodation = () => {
        setAccommodationEntries([...accommodationEntries, { cost: 0, description: "" }]);
      };
      
      const removeAccommodation = (index) => {
        const updatedEntries = [...accommodationEntries];
        updatedEntries.splice(index, 1);
        setAccommodationEntries(updatedEntries);
        toast.success(t('deletedAccommodationSuccess'), {
          position: "top-right", 
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        });
      };
      
      const handleAccommodationChange = (index, field, value) => {
        const updatedEntries = [...accommodationEntries];
        updatedEntries[index][field] = field === "cost" ? parseFloat(value) || 0 : value;
        setAccommodationEntries(updatedEntries);
      };
      

      const handleExpenseChange = (index, field, value) => {
        const updatedBudgets = [...dailyBudgets];
        const updatedExpenses = [...(updatedBudgets[currentDayIndex].expenses || [])];
        updatedExpenses[index][field] = field === "amount" ? parseFloat(value) || 0 : value;
        updatedBudgets[currentDayIndex].expenses = updatedExpenses;
        setDailyBudgets(updatedBudgets);
      };

      const handleSaveDayTitle = (index) => {
        const updatedPlans = [...dailyPlans];
      
        // Ensure title exists and isn't just whitespace
        if (!updatedPlans[index].title.trim()) {
          updatedPlans[index].title = `${t('day')} ${index + 1}`;
        }
      
        setDailyPlans(updatedPlans);
      };
      

      const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

      useEffect(() => {
        const updateTheme = () => {
          setTheme(localStorage.getItem('theme') || 'light');
        };

        window.addEventListener('storage', updateTheme); // Listen for storage changes
        return () => window.removeEventListener('storage', updateTheme);
      }, []);

      const removeExpense = (index) => {
        const updatedBudgets = [...dailyBudgets];
        const updatedExpenses = [...(updatedBudgets[currentDayIndex].expenses || [])];
        updatedExpenses.splice(index, 1);
        updatedBudgets[currentDayIndex].expenses = updatedExpenses;
        setDailyBudgets(updatedBudgets);
        toast.success(t('deletedExpenseSuccess'), {
          position: "top-right", 
          autoClose: 3000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          transition: Slide,
        });
      };

      const textareaRef = useRef(null);

      useEffect(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"; // Reset výšky
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Nastavení podle obsahu
        }
      }, [tempPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 dark:from-black dark:to-gray-900">
      <Navbar />
      <ToastContainer theme={theme} />
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
  {/* Odkaz zpět */}
  <div>
    <button
      onClick={() => setShowExitModal(true)}
      className="text-blue-500 hover:text-blue-600 font-bold flex items-center space-x-2 px-2 py-2 rounded"
    >
      <span>←</span>
      <span>{t('back')}</span>
    </button>
  </div>
  <div className="flex items-center justify-between w-full md:w-auto space-x-4">
  {isEditingTitle ? (
  <input
    type="text"
    value={tripTitle}
    onChange={handleTitleChange}
    onBlur={handleBlur}
    onKeyDown={handleKeyDown}
    autoFocus
    className="text-xl md:text-3xl font-bold text-center md:text-left dark:text-white bg-transparent border-b border-blue-500 focus:outline-none focus:ring-0"
  />
) : (
  <h1
    className="text-xl md:text-3xl font-bold text-center md:text-left dark:text-white cursor-pointer hover:opacity-80 transition"
    onClick={() => setIsEditingTitle(true)}
  >
    {tripTitle}
  </h1>
)}
    
    <button
      onClick={() => {
        const shareUrl = `${import.meta.env.VITE_APP_URL}/trip/${tripId}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
          window.open(shareUrl, "_blank");
        });
      }}
      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-white"
      title={t('shareTrip')}
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
    <button 
      onClick={handleSave}
      title={t('savePlan')}
      className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition dark:bg-gray-700 dark:hover:bg-gray-800 dark:text-white"
    >
      <svg         
        width="24"
        height="24" 
        viewBox="0 0 68.7012 98.6816" 
        xmlns="http://www.w3.org/2000/svg" 
      >
        <g> 
          <rect height="98.6816" opacity="0" width="68.7012" x="0" y="0"/> 
            <path d="M68.7012 41.1133L68.7012 78.6621C68.7012 86.8652 64.5996 90.918 56.25 90.918L12.4512 90.918C4.15039 90.918 0 86.8652 0 78.6621L0 41.1133C0 32.9102 4.15039 28.8574 12.4512 28.8574L23.1934 28.8574L23.1934 35.8887L12.5488 35.8887C9.0332 35.8887 7.03125 37.793 7.03125 41.5039L7.03125 78.2715C7.03125 81.9824 9.0332 83.8867 12.5488 83.8867L56.1523 83.8867C59.6191 83.8867 61.6699 81.9824 61.6699 78.2715L61.6699 41.5039C61.6699 37.793 59.6191 35.8887 56.1523 35.8887L45.459 35.8887L45.459 28.8574L56.25 28.8574C64.5996 28.8574 68.7012 32.959 68.7012 41.1133Z" fill="currentColor" /> 
            <path d="M34.3262 7.76367C32.4707 7.76367 30.8594 9.32617 30.8594 11.1328L30.8594 49.2188L31.1523 55.0293L29.1992 52.9297L23.7793 47.0703C23.1934 46.3867 22.2656 46.0449 21.3867 46.0449C19.5801 46.0449 18.2617 47.3145 18.2617 49.1211C18.2617 50.0488 18.6035 50.7324 19.2871 51.416L31.8359 63.3789C32.7148 64.2578 33.4473 64.5508 34.3262 64.5508C35.2539 64.5508 35.9863 64.2578 36.8652 63.3789L49.4141 51.416C50.0488 50.7324 50.4395 50.0488 50.4395 49.1211C50.4395 47.3145 49.0723 46.0449 47.2656 46.0449C46.3867 46.0449 45.5078 46.3867 44.873 47.0703L39.502 52.9297L37.5488 55.0293L37.8418 49.2188L37.8418 11.1328C37.8418 9.32617 36.2305 7.76367 34.3262 7.76367Z" fill="currentColor" /> 
        </g> 
      </svg>
    </button>
  </div>

  {/* Tlačítko pro přehled výletu */}
  <button 
    onClick={() => setShowOverview(true)}
    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 w-full md:w-auto"
  >
    {t('tripOverview')}
  </button>
</div>

        <div className=" md:flex md:space-x-4 flex-col md:flex-row">
          {/* Levý panel pro aktuální den */}
          <div className="relative md:w-2/3 w-full border rounded-lg p-4 overflow-y-auto shadow-md bg-white dark:bg-gray-900 dark:border-gray-700">
          {accommodationSegment === 'accommodation' ? (
            <div className="p-6 bg-white rounded-xl dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white">{t('accomodationCost')}</h2>

            {accommodationEntries.map((entry, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-inner dark:bg-gray-800 mb-2 flex flex-col md:flex-row md:items-center gap-2">
              <input
                type="number"
                className="w-full md:w-1/3 border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none 
                          focus:ring-2 focus:ring-blue-400 transition-all dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                placeholder={t('amount')}
                value={entry.cost || ''}
                onChange={(e) => handleAccommodationChange(index, "cost", e.target.value)}
              />
              <input
                type="text"
                className="w-full md:flex-1 border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none 
                          focus:ring-2 focus:ring-blue-400 transition-all dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                placeholder={t('AccommodationDescription')}
                value={entry.description}
                onChange={(e) => handleAccommodationChange(index, "description", e.target.value)}
              />
              <button
                className="text-red-500 hover:text-red-600 md:ml-4 flex items-center justify-center h-full self-center md:self-auto"
                onClick={() => removeAccommodation(index)}
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74.6094 92.8223" className="h-6 w-6">
                  <g>
                    <rect height="92.8223" opacity="0" width="74.6094" x="0" y="0" />
                    <path d="M26.0254 73.0957C27.6855 73.0957 28.7598 72.0703 28.7109 70.5566L27.5879 30.5176C27.5391 28.9551 26.4648 27.9785 24.9023 27.9785C23.291 27.9785 22.168 29.0039 22.2168 30.5176L23.3398 70.5566C23.3887 72.1191 24.4629 73.0957 26.0254 73.0957ZM37.3047 73.0957C38.9648 73.0957 40.0879 72.0703 40.0879 70.5566L40.0879 30.5176C40.0879 29.0039 38.9648 27.9785 37.3047 27.9785C35.6445 27.9785 34.5215 29.0039 34.5215 30.5176L34.5215 70.5566C34.5215 72.0703 35.6445 73.0957 37.3047 73.0957ZM48.6328 73.0957C50.1465 73.0957 51.2695 72.1191 51.3184 70.5566L52.3926 30.5176C52.4414 29.0039 51.3672 27.9785 49.707 27.9785C48.1445 27.9785 47.0703 29.0039 47.0215 30.5176L45.9473 70.5566C45.8984 72.0703 46.9727 73.0957 48.6328 73.0957ZM20.2637 18.0176L27.1973 18.0176L27.1973 9.81445C27.1973 7.8125 28.6133 6.49414 30.6641 6.49414L43.8965 6.49414C45.8984 6.49414 47.3145 7.8125 47.3145 9.81445L47.3145 18.0176L54.2969 18.0176L54.2969 9.32617C54.2969 3.56445 50.5371 0 44.3848 0L30.127 0C24.0234 0 20.2637 3.56445 20.2637 9.32617ZM3.22266 21.4844L71.3867 21.4844C73.1934 21.4844 74.6094 20.0195 74.6094 18.2129C74.6094 16.4062 73.1445 14.9414 71.3867 14.9414L3.22266 14.9414C1.51367 14.9414 0 16.4062 0 18.2129C0 20.0195 1.51367 21.4844 3.22266 21.4844ZM19.6777 85.6934L54.9805 85.6934C60.791 85.6934 64.5508 82.0801 64.8438 76.2207L67.3828 20.752L60.4004 20.752L57.959 75.4883C57.8613 77.6855 56.3965 79.1504 54.248 79.1504L20.3125 79.1504C18.2617 79.1504 16.748 77.6367 16.6504 75.4883L14.0625 20.752L7.22656 20.752L9.81445 76.2695C10.1074 82.1289 13.7695 85.6934 19.6777 85.6934Z" fill="currentColor" />
                  </g>
                </svg>
              </button>
            </div>
            ))}

            <button
              onClick={addAccommodation}
              className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md 
                        hover:bg-blue-600 transition-all dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {t('addAccommodation')}
            </button>

            <div className="flex justify-between items-center font-semibold text-lg text-gray-800 mt-4 p-3 border-t dark:border-gray-700 dark:text-gray-300">
              <span>{t('accomodationCost')}</span>
              <span className="text-blue-600 text-xl font-bold dark:text-blue-400">
                {calculateAccommodationTotal()} CZK
              </span>
            </div>

            <div className="flex justify-between items-center font-semibold text-lg text-gray-800 mt-2 p-3 border-t dark:border-gray-700 dark:text-gray-300">
              <span>{t('totalBudget')}</span>
              <span className="text-blue-600 text-xl font-bold dark:text-blue-400">
                {calculateTripTotal()} CZK
              </span>
            </div>

            <button 
              onClick={handleUpdate} 
              className="mt-6 w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md 
                        hover:bg-blue-600 transition-all dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {t('savePlan')}
            </button>
          </div>
        
        
        ) : (
            dailyPlans.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2 dark:text-white">
                  {isEditingDayTitle ? (
                    <input 
                      type="text" 
                      className="border rounded p-1 dark:bg-gray-800 dark:border-gray-600 dark:text-white w-fit focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={tempDayTitle}
                      onChange={handleDayTitleChange}
                      onBlur={handleDayTitleBlur}
                      onKeyDown={handleDayTitleKeyDown}
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="cursor-pointer hover:opacity-80 transition"
                      onClick={handleDayTitleClick}
                    >
                      {dailyPlans[currentDayIndex]?.title || `${t('day')} ${currentDayIndex + 1}`}
                    </span>
                  )}
                  <span className="ml-2">{format(dailyPlans[currentDayIndex].date, "dd.MM.yyyy")}</span>
                  <span className="text-center right-4 absolute">{format(dailyPlans[currentDayIndex].date, "EEEE", { locale: getLocale() })}</span>
                </h2>
                <div className="mb-4">
                    <label htmlFor="activityDescription" className="block text-gray-700 font-bold mb-2 dark:text-white">
                    {t('dailyActivity')}
                    </label>
                    <textarea
                      ref={textareaRef}
                      id="activityDescription"
                      value={tempPlan} 
                      onChange={(e) => setTempPlan(e.target.value)} 
                      onBlur={() => {
                        const updatedPlans = [...dailyPlans];
                        updatedPlans[currentDayIndex].plan = tempPlan; 
                        setDailyPlans(updatedPlans);
                      }}
                      className="w-full border rounded p-2 dark:bg-black dark:border-gray-800 dark:text-gray-100"
                      placeholder={t('dailyActivityDes')}
                    ></textarea>
                </div>

                {/* Sekce pro denní rozpočet */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg dark:text-white">{t('dailyBudget')}</h3>
                  <div className="flex flex-col gap-3">
                    {dailyBudgets[currentDayIndex]?.expenses?.map((expense, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row items-center gap-2 md:gap-4 p-3 border rounded-lg dark:border-gray-600 bg-gray-50 dark:bg-gray-800 shadow-sm"
                      >
                        {/* Kategorie výdajů */}
                        <select
                          value={expense.category}
                          onChange={(e) => handleExpenseChange(index, "category", e.target.value)}
                          className="border rounded-md p-2 w-full md:w-1/4 dark:bg-black dark:border-gray-700 dark:text-gray-100"
                        >
                          <option value="transport">{t("transport")}</option>
                          <option value="food">{t("food")}</option>
                          <option value="activities">{t("activities")}</option>
                          <option value="other">{t("other")}</option>
                        </select>

                        {/* Částka */}
                        <input
                          type="number"
                          value={expense.amount || ""}
                          onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
                          placeholder={t("amount")}
                          className="border rounded-md p-2 w-full md:w-1/4 dark:bg-black dark:border-gray-700 dark:text-gray-100"
                        />

                        {/* Popis */}
                        <input
                          type="text"
                          value={expense.description}
                          onChange={(e) => handleExpenseChange(index, "description", e.target.value)}
                          placeholder={t("BudgetDescription")}
                          className="border rounded-md p-2 w-full md:w-1/3 dark:bg-black dark:border-gray-700 dark:text-gray-100"
                        />

                        {/* Tlačítko na smazání */}
                        <button
                          onClick={() => removeExpense(index)}
                          className="text-red-500 hover:text-red-600 p-2 transition duration-300"
                        >
                          <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 74.6094 92.8223"
                            className="h-6 w-6"
                          >
                            <g>
                              <rect height="92.8223" opacity="0" width="74.6094" x="0" y="0" />
                              <path
                                d="M26.0254 73.0957C27.6855 73.0957 28.7598 72.0703 28.7109 70.5566L27.5879 30.5176C27.5391 28.9551 26.4648 27.9785 24.9023 27.9785C23.291 27.9785 22.168 29.0039 22.2168 30.5176L23.3398 70.5566C23.3887 72.1191 24.4629 73.0957 26.0254 73.0957ZM37.3047 73.0957C38.9648 73.0957 40.0879 72.0703 40.0879 70.5566L40.0879 30.5176C40.0879 29.0039 38.9648 27.9785 37.3047 27.9785C35.6445 27.9785 34.5215 29.0039 34.5215 30.5176L34.5215 70.5566C34.5215 72.0703 35.6445 73.0957 37.3047 73.0957ZM48.6328 73.0957C50.1465 73.0957 51.2695 72.1191 51.3184 70.5566L52.3926 30.5176C52.4414 29.0039 51.3672 27.9785 49.707 27.9785C48.1445 27.9785 47.0703 29.0039 47.0215 30.5176L45.9473 70.5566C45.8984 72.0703 46.9727 73.0957 48.6328 73.0957ZM20.2637 18.0176L27.1973 18.0176L27.1973 9.81445C27.1973 7.8125 28.6133 6.49414 30.6641 6.49414L43.8965 6.49414C45.8984 6.49414 47.3145 7.8125 47.3145 9.81445L47.3145 18.0176L54.2969 18.0176L54.2969 9.32617C54.2969 3.56445 50.5371 0 44.3848 0L30.127 0C24.0234 0 20.2637 3.56445 20.2637 9.32617ZM3.22266 21.4844L71.3867 21.4844C73.1934 21.4844 74.6094 20.0195 74.6094 18.2129C74.6094 16.4062 73.1445 14.9414 71.3867 14.9414L3.22266 14.9414C1.51367 14.9414 0 16.4062 0 18.2129C0 20.0195 1.51367 21.4844 3.22266 21.4844ZM19.6777 85.6934L54.9805 85.6934C60.791 85.6934 64.5508 82.0801 64.8438 76.2207L67.3828 20.752L60.4004 20.752L57.959 75.4883C57.8613 77.6855 56.3965 79.1504 54.248 79.1504L20.3125 79.1504C18.2617 79.1504 16.748 77.6367 16.6504 75.4883L14.0625 20.752L7.22656 20.752L9.81445 76.2695C10.1074 82.1289 13.7695 85.6934 19.6777 85.6934Z"
                                fill="currentColor"
                              />
                            </g>
                          </svg>
                        </button>
                      </div>

                    ))}
                    <button
                      onClick={addExpense}
                      className="bg-blue-500 text-white w-full md:w-fit font-bold py-2 px-4 rounded hover:bg-blue-600"
                    >
                      {t('addExpense')}
                    </button>
                  </div>
                  <div className="flex justify-between items-center font-bold mt-2">
                    <span className="dark:text-white">{t('totalDailyExpense')}</span>
                    <span className="dark:text-white">{calculateDailyTotal(dailyBudgets[currentDayIndex])} CZK</span>
                  </div>
                </div>


                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2 dark:text-white">{t('option')}</label>
                    <div className="flex space-x-4">
                        <button
                        className={`py-2 px-4 rounded ${inputType === 'location' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
                        onClick={() => handleInputTypeChange('location')}
                        >
                        {t('location')}
                        </button>
                        <button
                        className={`py-2 px-4 rounded ${inputType === 'route' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 dark:text-white'}`}
                        onClick={() => handleInputTypeChange('route')}
                        >
                        {t('route')}
                        </button>
                    </div>
                </div>

                {/* Dynamické zobrazení uložené lokace */}
                {inputType === 'location' && (
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2 dark:text-white">{t('enterLocation')}</label>
                    <Autocomplete
                    onLoad={onLoadLocation}
                    onPlaceChanged={onPlaceChangedLocation}
                    >
                      <input
                      type="text"
                      className="w-full border rounded p-2 dark:bg-black dark:border-gray-800 dark:text-gray-100"
                      placeholder={t('locationPlaceHolder')}
                      value={locationInputs[currentDayIndex]}
                      onChange={handleLocationInputChange}
                      />
                    </Autocomplete>
                </div>
                )}

                {/* Dynamické zobrazení uložené trasy */}
                {inputType === 'route' && (
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2 dark:text-white">{t('enterRoute')}</label>
                    <div className="flex flex-col gap-2">
                    {/* Startovní bod */}
                    <Autocomplete
                        onLoad={onLoadStart}
                        onPlaceChanged={onPlaceChangedStart}
                    >
                        <input
                            type="text"
                            className="w-full border rounded p-2 dark:bg-black dark:border-gray-800 dark:text-gray-100"
                            placeholder={t('routePlaceHolderStart')}
                            value={dailyPlans[currentDayIndex]?.route.start || ''}
                            onChange={(e) => handleRouteChange('start', e.target.value)}
                        />
                    </Autocomplete>
                    {/* Zastávky */}
                    {dailyPlans[currentDayIndex]?.route.stops.map((stop, index) => (
                        <div key={index} className="flex items-center gap-2">
                        <Autocomplete
                            onLoad={(autocomplete) => onLoadStop(autocomplete, index)}
                            onPlaceChanged={() => onPlaceChangedStop(index)}
                        >
                            <input
                                type="text"
                                className="w-full border rounded p-2 dark:bg-black dark:border-gray-800 dark:text-gray-100"
                                placeholder={`${t('routePlaceHolderStops')} ${index + 1}`}
                                value={stop}
                                onChange={(e) => {
                                    const updatedStops = [...dailyPlans[currentDayIndex].route.stops];
                                    updatedStops[index] = e.target.value;
                                    handleRouteChange('stops', updatedStops);
                                }}
                            />
                        </Autocomplete>
                        <button onClick={() => removeStop(index)} className="p-2 text-red-500 hover:text-red-600">
                            <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 78.8574 78.8574"
                            className="w-6 h-6"
                            >
                            <g>
                                <rect height="78.8574" opacity="0" width="78.8574" x="0" y="0" />
                                <path
                                d="M78.8574 39.4043C78.8574 61.1328 61.1816 78.8086 39.4043 78.8086C17.6758 78.8086 0 61.1328 0 39.4043C0 17.6758 17.6758 0 39.4043 0C61.1816 0 78.8574 17.6758 78.8574 39.4043ZM24.5605 35.6445C21.875 35.6445 20.166 37.0117 20.166 39.502C20.166 41.9434 21.9727 43.2617 24.5605 43.2617L54.3457 43.2617C56.9336 43.2617 58.6426 41.9434 58.6426 39.502C58.6426 37.0117 57.0312 35.6445 54.3457 35.6445Z"
                                fill="currentColor"
                                />
                            </g>
                            </svg>
                        </button>
                        </div>
                    ))}

                    {/* Přidání zastávky */}
                    <button
                        onClick={addStop}
                        className="p-2 flex items-center text-blue-500 hover:text-blue-600 w-fit"
                    >
                        <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 78.8574 78.8574"
                        className="w-8 h-8"
                        >
                        <g>
                            <rect height="78.8574" opacity="0" width="78.8574" x="0" y="0" />
                            <path
                            d="M78.8574 39.4043C78.8574 61.1328 61.1816 78.8086 39.4043 78.8086C17.6758 78.8086 0 61.1328 0 39.4043C0 17.6758 17.6758 0 39.4043 0C61.1816 0 78.8574 17.6758 78.8574 39.4043ZM35.6445 24.1699L35.6445 35.5957L24.2188 35.5957C21.9238 35.5957 20.3125 37.1582 20.3125 39.4531C20.3125 41.6992 21.9238 43.2129 24.2188 43.2129L35.6445 43.2129L35.6445 54.6387C35.6445 56.8848 37.1094 58.4961 39.3555 58.4961C41.6504 58.4961 43.2129 56.9336 43.2129 54.6387L43.2129 43.2129L54.6875 43.2129C56.9336 43.2129 58.5449 41.6992 58.5449 39.4531C58.5449 37.1582 56.9336 35.5957 54.6875 35.5957L43.2129 35.5957L43.2129 24.1699C43.2129 21.875 41.6504 20.3125 39.3555 20.3125C37.1094 20.3125 35.6445 21.875 35.6445 24.1699Z"
                            fill="currentColor"
                            />
                        </g>
                        </svg>
                    </button>
                    {/* Cílový bod */}
                    <Autocomplete
                    onLoad={onLoadEnd}
                    onPlaceChanged={onPlaceChangedEnd}
                    >
                      <input
                          type="text"
                          className="w-full border rounded p-2 dark:bg-black dark:border-gray-800 dark:text-gray-100"
                          placeholder={t('routePlaceHolderEnd')}
                          value={dailyPlans[currentDayIndex]?.route.end || ''}
                          onChange={(e) => handleRouteChange('end', e.target.value)}
                      />
                     </Autocomplete>
                    </div>

                    <div className="relative group">

                    <button 
                      onClick={() => handleDayClick(currentDayIndex, false)} 
                      className="mt-4 self px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300 shadow-md relative flex items-center gap-2"
                      data-tooltip={t('clickToGetRoute')}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 30.5664 86.4746" 
                        className="w-4 h-4 fill-white opacity-85"
                      >
                        <g>
                          <rect height="86.4746" opacity="0" width="30.5664" x="0" y="0"/>
                          <path d="M30.5664 15.332C30.5664 22.3633 25.8301 28.3203 19.3359 30.127L19.3359 63.1836C19.3359 76.0742 17.041 83.1543 15.2832 83.1543C13.4766 83.1543 11.1816 76.0254 11.1816 63.1836L11.1816 30.127C4.6875 28.2715 0 22.3633 0 15.332C0 6.88477 6.78711 0 15.2832 0C23.7793 0 30.5664 6.88477 30.5664 15.332ZM5.76172 10.9863C5.76172 13.8184 8.20312 16.2598 10.9863 16.2598C13.8672 16.2598 16.2109 13.8184 16.2109 10.9863C16.2109 8.1543 13.8672 5.76172 10.9863 5.76172C8.20312 5.76172 5.76172 8.1543 5.76172 10.9863Z"/>
                        </g>
                      </svg>
                      {t("getRoute")}
                      <style>{`
                        button::after {
                          content: attr(data-tooltip);
                          position: absolute;
                          left: 50%;
                          top: 100%;
                          margin-top: 8px;
                          transform: translateX(-50%);
                          background-color: #2d3748;
                          color: white;
                          font-size: 0.75rem;
                          padding: 4px 8px;
                          border-radius: 4px;
                          white-space: nowrap;
                          opacity: 0;
                          transition: opacity 0.3s ease-in-out;
                          z-index: 1000;
                        }
                        button:hover::after {
                          opacity: 1;
                        }
                      `}</style>
                    </button>
                  </div>

                </div>
                )}

                <div className="mt-6 mb-4">
                    <MapComponent
                        location={inputType === 'location' ? dailyPlans[currentDayIndex]?.location : null}
                        route={inputType === 'route' ? dailyPlans[currentDayIndex]?.route : { start: '', end: '', stops: [] }}
                        clearMap={!currentDayData}
                        overviewMode={false}
                        isDarkMode={theme === 'dark'}
                        />
                </div>

                {showOverview && <OverviewMap tripId={tripId} userId={userId} allPlans={dailyPlans} onClose={() => setShowOverview(false)} tripName={tripTitle} />}



                {/* Tlačítka pro rychlé přecházení mezi dny ve spodních rozích */}
                <div className="flex justify-between items-center bottom-4">
                <div className="text-left">
                    <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 w-full md:w-auto dark:bg-black dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-900"
                    onClick={handlePrevDay}
                    disabled={currentDayIndex === 0}
                    >
                    {t('previousDay')}
                    </button>
                </div>
                <div className="text-right">
                    <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 w-full md:w-auto dark:bg-black dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-900"
                    onClick={handleNextDay}
                    disabled={currentDayIndex === dailyPlans.length - 1}
                    >
                    {t('nextDay')}
                    </button>
                </div>
                </div>

              </div>
            ))}
          </div>

          {/* Pravý panel pro kalendář */}
          <div className="md:w-1/3 w-full border rounded-lg p-6 shadow-lg mt-6 md:mt-0 overflow-y-auto bg-white dark:bg-gray-900 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{t("calendar")}</h3>

            <div className="space-y-3">
              {dailyPlans.map((day, index) => (
                <div 
                  key={index} 
                  className={`relative flex items-center p-3 border rounded-lg font-medium transition-all shadow-sm
                              ${index === currentDayIndex ? "bg-blue-100 dark:bg-blue-800" : "hover:bg-gray-100 dark:hover:bg-gray-700"} 
                              dark:border-gray-700 dark:text-gray-300`}
                >
                  {/* Název dne */}
                  <button 
                    className="w-full text-left pr-12" 
                    onClick={() => handleDayClick(index, true)}
                  >
                    {day.title 
                      ? `${day.title} - ${format(dailyPlans[index].date, "dd.MM.yyyy")} (${format(day.date, "EEEE", { locale: getLocale() })})` 
                      : `${t("day")} ${index + 1} - ${format(day.date, "dd.MM.yyyy")}`}
                  </button>

                  {/* Ikony na přidání a odstranění (vedle sebe, vpravo) */}
                  {(index === 0 || index === dailyPlans.length - 1) && (
                    <div className="absolute right-2 flex items-center gap-2">
                      {/* Přidat den */}
                      <button 
                        onClick={index === 0 ? addDayAtStart : addDayAtEnd} 
                        className="text-gray-500 hover:text-green-600 transition-all"
                        title={index === 0 ? t("addDayStart") : t("addDayEnd")}
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="24" height="24" fill="currentColor">
                        <path d="M0 32c0 2.15 1.81 3.96 3.96 3.96h24.02v24.02c0 2.1 1.81 3.96 3.96 3.96s3.91-1.86 3.91-3.96V35.96h24.07c2.1 0 3.91-1.81 3.91-3.96s-1.81-3.96-3.91-3.96H35.85V3.96C35.85 1.86 34.04 0 31.89 0s-3.91 1.81-3.91 3.96v24.07H3.96C1.81 28.03 0 29.85 0 32z"/>
                      </svg>

                      </button>

                      {/* Odstranit den */}
                      {dailyPlans.length > 1 && (
                        <button 
                          onClick={() => confirmRemoveDay(index === 0 ? "start" : "end")} 
                          className="text-gray-500 hover:text-red-600 transition-all"
                          title={index === 0 ? t("removeDayStart") : t("removeDayEnd")}
                        >
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74.6094 92.8223" className="h-6 w-6">
                    <g>
                      <rect height="92.8223" opacity="0" width="74.6094" x="0" y="0" />
                      <path d="M26.0254 73.0957C27.6855 73.0957 28.7598 72.0703 28.7109 70.5566L27.5879 30.5176C27.5391 28.9551 26.4648 27.9785 24.9023 27.9785C23.291 27.9785 22.168 29.0039 22.2168 30.5176L23.3398 70.5566C23.3887 72.1191 24.4629 73.0957 26.0254 73.0957ZM37.3047 73.0957C38.9648 73.0957 40.0879 72.0703 40.0879 70.5566L40.0879 30.5176C40.0879 29.0039 38.9648 27.9785 37.3047 27.9785C35.6445 27.9785 34.5215 29.0039 34.5215 30.5176L34.5215 70.5566C34.5215 72.0703 35.6445 73.0957 37.3047 73.0957ZM48.6328 73.0957C50.1465 73.0957 51.2695 72.1191 51.3184 70.5566L52.3926 30.5176C52.4414 29.0039 51.3672 27.9785 49.707 27.9785C48.1445 27.9785 47.0703 29.0039 47.0215 30.5176L45.9473 70.5566C45.8984 72.0703 46.9727 73.0957 48.6328 73.0957ZM20.2637 18.0176L27.1973 18.0176L27.1973 9.81445C27.1973 7.8125 28.6133 6.49414 30.6641 6.49414L43.8965 6.49414C45.8984 6.49414 47.3145 7.8125 47.3145 9.81445L47.3145 18.0176L54.2969 18.0176L54.2969 9.32617C54.2969 3.56445 50.5371 0 44.3848 0L30.127 0C24.0234 0 20.2637 3.56445 20.2637 9.32617ZM3.22266 21.4844L71.3867 21.4844C73.1934 21.4844 74.6094 20.0195 74.6094 18.2129C74.6094 16.4062 73.1445 14.9414 71.3867 14.9414L3.22266 14.9414C1.51367 14.9414 0 16.4062 0 18.2129C0 20.0195 1.51367 21.4844 3.22266 21.4844ZM19.6777 85.6934L54.9805 85.6934C60.791 85.6934 64.5508 82.0801 64.8438 76.2207L67.3828 20.752L60.4004 20.752L57.959 75.4883C57.8613 77.6855 56.3965 79.1504 54.248 79.1504L20.3125 79.1504C18.2617 79.1504 16.748 77.6367 16.6504 75.4883L14.0625 20.752L7.22656 20.752L9.81445 76.2695C10.1074 82.1289 13.7695 85.6934 19.6777 85.6934Z" fill="currentColor" />
                    </g>
                  </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

  <div className="w-full border-t border-gray-300 dark:border-gray-700 mt-5 mb-5"></div>

  <button
    className={`w-full text-left p-3 border rounded-lg font-medium transition-all
                ${accommodationSegment === 'accommodation' ? 'bg-blue-100 dark:bg-blue-800' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} 
                dark:border-gray-700 dark:text-gray-300`}
    onClick={() => handleDayClick('accommodation', true)}
  >
    {t('accomodationCost')}
  </button>

  <button 
    onClick={handleUpdate} 
    className="mt-5 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all 
              dark:bg-blue-700 dark:hover:bg-blue-800"
  >
    {t('savePlan')}
  </button>
</div>

</div>

        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md transform transition-all duration-300 scale-95 sm:scale-100">
            {/* Ikona upozornění */}
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12" y2="16" />
              </svg>
            </div>

            {/* Nadpis a text */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">{t("confirmDeletion")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 text-center leading-relaxed">
              {t("deleteDayWarning")}
            </p>

            {/* Akční tlačítka */}
            <div className="flex justify-center mt-6 space-x-4">
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="px-5 py-2 rounded-lg font-semibold text-gray-800 bg-gray-300 hover:bg-gray-400 transition-all dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                {t("cancel")}
              </button>
              <button 
                onClick={removeDay} 
                className="px-5 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-all shadow-md"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
        )}

        {showExitModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-[90%] max-w-md transform transition-all duration-300 scale-95 sm:scale-100">
          <button
        className="no-print absolute top-4 right-4 text-gray-700 cursor-pointer dark:text-white dark:hover:text-red-500 hover:text-red-500 transition-all duration-200"
        onClick={() => setShowExitModal(false)}
      >
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 61.3893 61.4014"
          width="24"
          height="24"
          fill="currentColor"
        >
          <g>
            <rect height="61.4014" opacity="0" width="61.3893" x="0" y="0" />
            <path d="M1.15364 60.2661C2.71614 61.7798 5.2552 61.7798 6.76887 60.2661L30.6947 36.2915L54.6693 60.2661C56.1341 61.7798 58.722 61.7798 60.2357 60.2661C61.7493 58.7036 61.7493 56.1646 60.2357 54.6997L36.2611 30.7251L60.2357 6.79932C61.7493 5.28564 61.7982 2.69775 60.2357 1.18408C58.6732-0.280762 56.1341-0.280762 54.6693 1.18408L30.6947 25.1587L6.76887 1.18408C5.2552-0.280762 2.66731-0.32959 1.15364 1.18408C-0.311207 2.74658-0.311207 5.28564 1.15364 6.79932L25.1282 30.7251L1.15364 54.6997C-0.311207 56.1646-0.360035 58.7524 1.15364 60.2661Z" />
          </g>
        </svg>
      </button>
            {/* Ikona upozornění */}
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12" y2="16" />
              </svg>
            </div>

            {/* Nadpis a text */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">{t("confirmExit")}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 text-center leading-relaxed">
              {t("exitWarning")}
            </p>

            {/* Akční tlačítka */}
            <div className="flex justify-center mt-6 space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2 rounded-lg font-semibold text-gray-800 bg-gray-300 hover:bg-gray-400 transition-all dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                {t('exit')}
              </button>
              <button 
                onClick={handleUpdate}
                className="px-5 py-2 rounded-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all shadow-md"
              >
                {t('saveAndExit')}
              </button>
            </div>
          </div>
        </div>
        )}

        

        {/* {(currentDayIndex === dailyPlans.length - 1) && (
            <div className="mt-6 p-4 bg-white rounded shadow-md text-center">
              <h3 className="font-bold text-lg">{t('totalBudget')}</h3>
              <div className="flex justify-between items-center">
                <label className="font-medium">{t('accomodationCost')}</label>
                <input
                  type="number"
                  className="border rounded p-1 w-1/2"
                  value={accommodationCost || ''}
                  placeholder="0"
                  onChange={(e) => setAccommodationCost(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center font-bold mt-2">
                <span>{t('totalBudget')}</span>
                <span>{calculateTripTotal()} CZK</span>
              </div>
                <button onClick={handleUpdate} className="bg-blue-500 text-white font-bold py-2 w-full md:w-fit px-4 rounded hover:bg-blue-600">
                {t('savePlan')}
                </button>
            </div>
        )} */}

      </div>
      </LoadScript>
    </div>
  );
};

export default CreateTrip;
