import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { format, eachDayOfInterval } from "date-fns";
import cs from "date-fns/locale/cs";
import MapComponent from "./MapComponent";
import { Autocomplete, LoadScript } from "@react-google-maps/api";

const libraries = ["places"]; // Nutné pro Autocomplete


const CreateTrip = () => {
  const location = useLocation();
  const { tripName, startDate, endDate, tripId } = location.state || {};
  const [dailyPlans, setDailyPlans] = useState([]);
  const [currentDayData, setCurrentDayData] = useState(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
//   const [activityDescription, setActivityDescription] = useState('');
//   const [locationData, setLocationData] = useState('');
//   const [routeData, setRouteData] = useState({ start: '', end: '', stops: [] });
  const [inputType, setInputType] = useState('location'); // "location" or "route"
  const [dailyBudgets, setDailyBudgets] = useState([]); // Nový stav pro denní rozpočty
  const [accommodationCost, setAccommodationCost] = useState(0); // Náklady na ubytování



  const navigate = useNavigate();

  const handleClearMap = () => {
    setCurrentDayData(null); // Reset aktuální data
  };



  useEffect(() => {
    if (startDate && endDate) {
      const days = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      }).map((date) => ({
        date,
        plan: '',
        location: '',
        route: { start: '', end: '', stops: [] },
      }));
      const budgets = days.map(() => ({ transport: 0, food: 0, activities: 0, other: 0 }));
      setDailyBudgets(budgets);
      setDailyPlans(days);
    }
  }, [startDate, endDate]);

  const handleUpdate = async () => {
    // console.log(dailyPlans);

    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/updateActivities`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            tripId,
            activities: dailyPlans,
            budgets: dailyBudgets,
            accommodationCost,
            totalCost: calculateTripTotal(),
        })
    });

    const result = await response.json();
    if (response.ok) {
        console.log(result);
        navigate('/dashboard');
    }

    };

    const handlePlanChange = (value) => {
        const updatedPlans = [...dailyPlans];
        updatedPlans[currentDayIndex].plan = value;
        setDailyPlans(updatedPlans);
      };

      const [autocomplete, setAutocomplete] = useState(null);

      const handlePlaceChanged = () => {
        if (autocomplete) {
          const place = autocomplete.getPlace();
          const location = place?.formatted_address || "";

          if (location) {
            handleLocationChange(location, currentDayIndex);
          }
        }
      };


      const handleLocationChange = (value, index) => {
        const updatedPlans = [...dailyPlans];
        updatedPlans[currentDayIndex].location = value;
        updatedPlans[currentDayIndex].route = { start: '', end: '', stops: [] }; // Resetuje trasu, pokud se zadá lokace
        setDailyPlans(updatedPlans);
        setAutocomplete(null); // Resetuje autocomplete
        setTimeout(() => {
            setCurrentDayData(dailyPlans[index]);
          }, 0); // Zpoždění, aby se mapě dal čas na reset
      };

      const handleBudgetChange = (category, value) => {
        const updatedBudgets = [...dailyBudgets];
        updatedBudgets[currentDayIndex][category] = parseFloat(value) || 0;
        setDailyBudgets(updatedBudgets);
      };

      const calculateDailyTotal = (budget) =>
        Object.values(budget).reduce((sum, cost) => sum + cost, 0);

      const calculateTripTotal = () =>
        dailyBudgets.reduce((total, budget) => total + calculateDailyTotal(budget), 0) +
        parseFloat(accommodationCost);


        const handleRouteChange = (field, value) => {
          const updatedPlans = [...dailyPlans];
          if (field === 'stops') {
            updatedPlans[currentDayIndex].route.stops = value;
          } else {
            updatedPlans[currentDayIndex].route[field] = value;
          }
          updatedPlans[currentDayIndex].location = ''; // Resetuje lokaci, pokud se zadá trasa
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

      const [autocompleteStart, setAutocompleteStart] = useState(null);
    const [autocompleteEnd, setAutocompleteEnd] = useState(null);
    const [autocompleteLocation, setAutocompleteLocation] = useState(null);
    const [autocompleteStops, setAutocompleteStops] = useState([]);
    const [locationInputs, setLocationInputs] = useState(dailyPlans.map(plan => plan.location || ''));
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [stops, setStops] = useState([]);
    const [directions, setDirections] = useState(null);

    useEffect(() => {
      // Ensure locationInputs is updated when dailyPlans changes
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

const handleLocationInputConfirm = () => {
  if (autocompleteLocation !== null) {
      const place = autocompleteLocation.getPlace();
      const formattedAddress = place.formatted_address;
      handleLocationChange(formattedAddress, currentDayIndex);
      const newLocationInputs = [...locationInputs];
      newLocationInputs[currentDayIndex] = formattedAddress;
      setLocationInputs(newLocationInputs);
  }
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

      const handleDayClick = (index) => {
        handleClearMap(); // Vymaž aktuální mapu
        setTimeout(() => {
          setCurrentDayIndex(index);
          setCurrentDayData(dailyPlans[index]);
        }, 0); // Zpoždění, aby se mapě dal čas na reset

        // Dynamicky nastavíme inputType podle dat daného dne
        const dayData = dailyPlans[index];
        if (dayData.location) {
          setInputType('location');
        } else if (dayData.route.start || dayData.route.end || dayData.route.stops.length > 0) {
          setInputType('route');
        }

        setShowCalendar(false);
      };

      const handlePrevDay = () => {
        if (currentDayIndex > 0) {
          const prevIndex = currentDayIndex - 1;
          handleClearMap(); // Vymaž aktuální mapu
          setTimeout(() => {
            setCurrentDayIndex(prevIndex);
            setCurrentDayData(dailyPlans[prevIndex]);
          }, 0); // Zpoždění, aby se mapě dal čas na reset

          // Dynamicky nastavíme inputType podle dat předchozího dne
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
          handleClearMap(); // Vymaž aktuální mapu
          setTimeout(() => {
            setCurrentDayIndex(nextIndex);
            setCurrentDayData(dailyPlans[nextIndex]);
          }, 0); // Zpoždění, aby se mapě dal čas na reset

          // Dynamicky nastavíme inputType podle dat následujícího dne
          const dayData = dailyPlans[nextIndex];
          if (dayData.location) {
            setInputType('location');
          } else if (dayData.route.start || dayData.route.end || dayData.route.stops.length > 0) {
            setInputType('route');
          }
        }
      };

      const translations = {
        transport: "Doprava",
        food: "Jídlo",
        activities: "Aktivity",
        other: "Ostatní",
      };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <Navbar />
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <a
            href="/dashboard"
            className="text-blue-500 hover:text-blue-600 font-bold px-4 py-2 rounded"
        >
            ← Zpět
        </a>
        <h1 className="text-3xl font-bold text-center flex-grow">{tripName}</h1>
        </div>
        {/* Desktopové zobrazení: Vedle sebe vytváření dne a kalendář */}
        <div className="hidden md:flex space-x-4">
          {/* Levý panel pro aktuální den */}
          <div className="relative w-2/3 border rounded-lg p-4 max-h-[600px] overflow-y-auto shadow-md bg-white">
            {dailyPlans.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Den {currentDayIndex + 1} - {format(dailyPlans[currentDayIndex].date, "dd.MM.yyyy")} <span className="text-center right-4 absolute">{format(dailyPlans[currentDayIndex].date, "EEEE", { locale: cs })}</span>
                </h2>

                <div className="mb-4">
                    <label htmlFor="activityDescription" className="block text-gray-700 font-bold mb-2">
                        Denní aktivita:
                    </label>
                    <textarea
                        id="activityDescription"
                        value={dailyPlans[currentDayIndex]?.plan || ''}
                        onChange={(e) => handlePlanChange(e.target.value)}
                        className="w-full border rounded p-2"
                        placeholder="Popis denní aktivity..."
                    ></textarea>
                </div>

                {/* Sekce pro denní rozpočet */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg">Denní rozpočet</h3>
                  <div className="flex flex-col gap-2">
                    {["transport", "food", "activities", "other"].map((category) => (
                      <div key={category} className="flex justify-between items-center">
                        <label className="font-medium capitalize">{translations[category]}:</label>
                        <input
                          type="number"
                          className="border rounded p-1 w-1/2"
                          value={dailyBudgets[currentDayIndex]?.[category] || ''}
                          placeholder="0"
                          onChange={(e) => handleBudgetChange(category, e.target.value)}
                        />
                      </div>
                    ))}
                    <div className="flex justify-between items-center font-bold mt-2">
                      <span>Celkový denní rozpočet:</span>
                      <span>{calculateDailyTotal(dailyBudgets[currentDayIndex])} CZK</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Zvolte možnost:</label>
                    <div className="flex space-x-4">
                        <button
                        className={`py-2 px-4 rounded ${inputType === 'location' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleInputTypeChange('location')}
                        >
                        Lokace
                        </button>
                        <button
                        className={`py-2 px-4 rounded ${inputType === 'route' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleInputTypeChange('route')}
                        >
                        Trasa
                        </button>
                    </div>
                </div>

                {/* Dynamické zobrazení uložené lokace */}
                {inputType === 'location' && (
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Zadejte lokaci:</label>
                    <Autocomplete
                    onLoad={onLoadLocation}
                    onPlaceChanged={onPlaceChangedLocation}
                    >
                      <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="Např. Praha, Český Krumlov..."
                      value={locationInputs[currentDayIndex]}
                      onChange={handleLocationInputChange}
                      />
                    </Autocomplete>
                </div>
                )}

                {/* Dynamické zobrazení uložené trasy */}
                {inputType === 'route' && (
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Zadejte trasu:</label>
                    <div className="flex flex-col gap-2">
                    {/* Startovní bod */}
                    <Autocomplete
                        onLoad={onLoadStart}
                        onPlaceChanged={onPlaceChangedStart}
                    >
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="Startovní bod"
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
                                className="w-full border rounded p-2"
                                placeholder={`Zastávka ${index + 1}`}
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
                        className="p-2 flex items-center self-center text-blue-500 hover:text-blue-600"
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
                          className="w-full border rounded p-2"
                          placeholder="Cílový bod"
                          value={dailyPlans[currentDayIndex]?.route.end || ''}
                          onChange={(e) => handleRouteChange('end', e.target.value)}
                      />
                     </Autocomplete>
                    </div>
                </div>
                )}

                <div className="mt-6 mb-4">
                    <MapComponent
                        location={inputType === 'location' ? dailyPlans[currentDayIndex]?.location : null}
                        route={inputType === 'route' ? dailyPlans[currentDayIndex]?.route : { start: '', end: '', stops: [] }}
                        clearMap={!currentDayData}
                        />
                </div>

                {/* Tlačítka pro rychlé přecházení mezi dny ve spodních rozích */}
                <div className="flex justify-between items-center bottom-4">
                <div className="text-left">
                    <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                    onClick={handlePrevDay}
                    disabled={currentDayIndex === 0}
                    >
                    Předchozí den
                    </button>
                </div>
                <div className="text-right">
                    <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                    onClick={handleNextDay}
                    disabled={currentDayIndex === dailyPlans.length - 1}
                    >
                    Další den
                    </button>
                </div>
                </div>

              </div>
            )}
          </div>

          {/* Pravý panel pro kalendář */}
          <div className="w-1/3 border rounded-lg p-4 shadow-md max-h-[600px] overflow-y-auto bg-white">
            <h3 className="text-lg font-semibold mb-2">Kalendář</h3>
            <div className="space-y-2">
              {dailyPlans.map((day, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-2 border rounded ${index === currentDayIndex ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                  onClick={() => handleDayClick(index)}
                >
                  Den {index + 1} ({format(dailyPlans[index].date, "EEEE", { locale: cs })}) - {format(day.date, "dd.MM.yyyy")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobilní zobrazení */}
        <div className="md:hidden">
          {dailyPlans.length > 0 && (
            <div className="border rounded-lg p-4 shadow-md mb-4 bg-white">
              <h2 className="text-xl font-semibold mb-2">
                Den {currentDayIndex + 1} - {format(dailyPlans[currentDayIndex].date, "dd.MM.yyyy")} <span className="absolute right-9">{format(dailyPlans[currentDayIndex].date, "EEEE", { locale: cs })}</span>
              </h2>
              <textarea
                className="w-full border rounded p-2 mb-4"
                placeholder="Popis denní aktivity..."
                value={dailyPlans[currentDayIndex].plan || ''}
                onChange={(e) => handlePlanChange(e.target.value)}
              />

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Zvolte možnost:</label>
                    <div className="flex space-x-4">
                        <button
                        className={`py-2 px-4 rounded ${inputType === 'location' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleInputTypeChange('location')}
                        >
                        Lokace
                        </button>
                        <button
                        className={`py-2 px-4 rounded ${inputType === 'route' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleInputTypeChange('route')}
                        >
                        Trasa
                        </button>
                    </div>
                </div>

                {inputType === 'location' && (
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Zadejte lokaci:</label>
                    {/* <Autocomplete
                    onLoad={onLoadLocation}
                    onPlaceChanged={onPlaceChangedLocation}
                    > */}
                      <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="Např. Praha, Český Krumlov..."
                      value={locationInputs[currentDayIndex]}
                      onChange={handleLocationInputChange}
                      />
                    {/* </Autocomplete> */}
                </div>
                )}

                 {/* Dynamické zobrazení uložené trasy */}
                 {inputType === 'route' && (
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Zadejte trasu:</label>
                    <div className="flex flex-col gap-2">
                    {/* Startovní bod */}
                    {/* <Autocomplete
                        onLoad={onLoadStart}
                        onPlaceChanged={onPlaceChangedStart}
                    > */}
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="Startovní bod"
                            value={dailyPlans[currentDayIndex]?.route.start || ''}
                            onChange={(e) => handleRouteChange('start', e.target.value)}
                        />
                    {/* </Autocomplete> */}
                    {/* Zastávky */}
                    {dailyPlans[currentDayIndex]?.route.stops.map((stop, index) => (
                        <div key={index} className="flex items-center gap-2">
                        {/* <Autocomplete
                            onLoad={(autocomplete) => onLoadStop(autocomplete, index)}
                            onPlaceChanged={() => onPlaceChangedStop(index)}
                        > */}
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                placeholder={`Zastávka ${index + 1}`}
                                value={stop}
                                onChange={(e) => {
                                    const updatedStops = [...dailyPlans[currentDayIndex].route.stops];
                                    updatedStops[index] = e.target.value;
                                    handleRouteChange('stops', updatedStops);
                                }}
                            />
                        {/* </Autocomplete> */}
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
                        className="p-2 flex items-center self-center text-blue-500 hover:text-blue-600"
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
                    {/* <Autocomplete
                    onLoad={onLoadEnd}
                    onPlaceChanged={onPlaceChangedEnd}
                    > */}
                      <input
                          type="text"
                          className="w-full border rounded p-2"
                          placeholder="Cílový bod"
                          value={dailyPlans[currentDayIndex]?.route.end || ''}
                          onChange={(e) => handleRouteChange('end', e.target.value)}
                      />
                     {/* </Autocomplete> */}
                    </div>
                </div>
                )}

                <div className="mt-6">
                <MapComponent
                        location={inputType === 'location' ? dailyPlans[currentDayIndex]?.location : null}
                        route={inputType === 'route' ? dailyPlans[currentDayIndex]?.route : { start: '', end: '', stops: [] }}
                        clearMap={!currentDayData}
                    />
                </div>

            </div>


          )}

          {/* Tlačítka pro přepínání dnů */}
          <div className="flex justify-between mb-4">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
              onClick={handlePrevDay}
              disabled={currentDayIndex === 0}
            >
              Předchozí den
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
              onClick={handleNextDay}
              disabled={currentDayIndex === dailyPlans.length - 1}
            >
              Další den
            </button>
          </div>

          {/* Tlačítko pro zobrazení kalendáře */}
          <div className="mb-4">
            <button
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {showCalendar ? 'Skrýt kalendář' : 'Zobrazit kalendář'}
            </button>
          </div>

          {/* Kalendář pro mobilní zobrazení */}
          {showCalendar && (
            <div className="border rounded-lg p-4 shadow-md max-h-[400px] overflow-y-auto bg-white">
              <h3 className="text-lg font-semibold mb-2">Kalendář</h3>
              <div className="space-y-2">
                {dailyPlans.map((day, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-2 border rounded ${index === currentDayIndex ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                    onClick={() => handleDayClick(index)}
                  >
                    Den {index + 1} - {format(day.date, "dd.MM.yyyy")}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {(currentDayIndex === dailyPlans.length - 1) && (
            <div className="mt-6 p-4 bg-white rounded shadow-md text-center">
              <h3 className="font-bold text-lg">Celkový rozpočet</h3>
              <div className="flex justify-between items-center">
                <label className="font-medium">Náklady na ubytování:</label>
                <input
                  type="number"
                  className="border rounded p-1 w-1/2"
                  value={accommodationCost || ''}
                  placeholder="0"
                  onChange={(e) => setAccommodationCost(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center font-bold mt-2">
                <span>Celkový rozpočet:</span>
                <span>{calculateTripTotal()} CZK</span>
              </div>
                <button onClick={handleUpdate} className="bg-blue-500 text-white font-bold py-2 w-full md:w-fit px-4 rounded hover:bg-blue-600">
                Uložit plán
                </button>
            </div>
        )}

      </div>
      </LoadScript>
    </div>
  );
};

export default CreateTrip;
