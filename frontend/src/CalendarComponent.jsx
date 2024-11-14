import { useState } from "react";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

const CalendarComponent = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">Select Date Range</h2>
        <DateRangePicker
          startDate={startDate}
          startDateId="startDate"
          endDate={endDate}
          endDateId="endDate"
          onDatesChange={({ startDate, endDate }) => {
            setStartDate(startDate);
            setEndDate(endDate);
          }}
          focusedInput={focusedInput}
          onFocusChange={(input) => setFocusedInput(input)}
          numberOfMonths={1} // Show only one month for better mobile support
          minimumNights={0} // Allow selecting a single day
        />
      </div>
    </div>
  );
};

export default CalendarComponent;
