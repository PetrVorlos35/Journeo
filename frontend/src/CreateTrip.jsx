import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { format, eachDayOfInterval } from "date-fns";
import cs from "date-fns/locale/cs"; // Pro zobrazení dne v týdnu v češtině

const CreateTrip = () => {
  const location = useLocation();
  const { tripName, startDate, endDate, tripId } = location.state || {};
  const [dailyPlans, setDailyPlans] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);

//   console.log(tripName, startDate, endDate, tripId);
  
  

  useEffect(() => {
    if (startDate && endDate) {
      const days = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      }).map((date) => ({
        date,
        plan: "",
      }));
      setDailyPlans(days);
    }
  }, [startDate, endDate]);

  const handleUpdate = async () => {
    console.log(dailyPlans);

    const token = localStorage.getItem("token");

    const response = await fetch('http://localhost:5001/updateActivities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            tripId,
            activities: dailyPlans,
        })
    });

    const result = await response.json();
    if (response.ok) {
        console.log(result);
    }

    };

  const handlePlanChange = (value) => {
    const updatedPlans = [...dailyPlans];
    updatedPlans[currentDayIndex].plan = value;
    setDailyPlans(updatedPlans);
  };

  const handleDayClick = (index) => {
    setCurrentDayIndex(index);
    setShowCalendar(false);
  };

  const handlePrevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDayIndex < dailyPlans.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">{tripName}</h1>

        {/* Desktopové zobrazení: Vedle sebe vytváření dne a kalendář */}
        <div className="hidden md:flex space-x-4">
          {/* Levý panel pro aktuální den */}
          <div className="relative w-2/3 border rounded-lg p-4 max-h-[400px] overflow-y-auto shadow-md bg-white">
            {dailyPlans.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Den {currentDayIndex + 1} - {format(dailyPlans[currentDayIndex].date, "dd.MM.yyyy")} <span className="text-center right-4 absolute">{format(dailyPlans[currentDayIndex].date, "EEEE", { locale: cs })}</span>
                </h2>
                <textarea
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Zadejte, co budete v tento den dělat..."
                  value={dailyPlans[currentDayIndex].plan}
                  onChange={(e) => handlePlanChange(e.target.value)}
                />

                {/* Tlačítka pro rychlé přecházení mezi dny ve spodních rozích */}
                <div className="absolute bottom-4 left-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                    onClick={handlePrevDay}
                    disabled={currentDayIndex === 0}
                  >
                    Předchozí den
                  </button>
                </div>
                <div className="absolute bottom-4 right-4">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                    onClick={handleNextDay}
                    disabled={currentDayIndex === dailyPlans.length - 1}
                  >
                    Další den
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pravý panel pro kalendář */}
          <div className="w-1/3 border rounded-lg p-4 shadow-md max-h-[400px] overflow-y-auto bg-white">
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
                placeholder="Zadejte, co budete v tento den dělat..."
                value={dailyPlans[currentDayIndex].plan}
                onChange={(e) => handlePlanChange(e.target.value)}
              />
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
            <div className="mt-4 text-center">
                <button onClick={handleUpdate} className="bg-blue-500 text-white font-bold py-2 w-full md:w-fit px-4 rounded hover:bg-blue-600">
                Uložit plán
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default CreateTrip;
