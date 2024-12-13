import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Bar, Doughnut, Pie, Radar, PolarArea, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

const BudgetTracking = ({ userId }) => {
  const [totals, setTotals] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState('doughnut'); // Default chart type

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/budget?id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data) {
          throw new Error('No budget data found');
        }

        const data = response.data;

        // Set the totals for display
        setTotals(data);

        // Calculate percentages
        const totalOverallCost = data.totalOverallCost;
        const percentages = {
          transport: ((data.totalTransport / totalOverallCost) * 100).toFixed(2),
          food: ((data.totalFood / totalOverallCost) * 100).toFixed(2),
          activities: ((data.totalActivities / totalOverallCost) * 100).toFixed(2),
          other: ((data.totalOther / totalOverallCost) * 100).toFixed(2),
          accommodation: ((data.totalAccommodation / totalOverallCost) * 100).toFixed(2),
        };

        // Prepare the data for the chart
        const chartDataset = {
          labels: [
            `Transport (${data.totalTransport} CZK)`,
            `Food (${data.totalFood} CZK)`,
            `Activities (${data.totalActivities} CZK)`,
            `Other (${data.totalOther} CZK)`,
            `Accommodation (${data.totalAccommodation} CZK)`,
          ],
          datasets: [
            {
              label: 'Expenses (% of Total)',
              data: [
                percentages.transport,
                percentages.food,
                percentages.activities,
                percentages.other,
                percentages.accommodation,
              ],
              backgroundColor: [
                'rgba(75,192,192,0.6)',
                'rgba(255,99,132,0.6)',
                'rgba(54,162,235,0.6)',
                'rgba(255,206,86,0.6)',
                'rgba(153,102,255,0.6)',
              ],
              borderColor: [
                'rgba(75,192,192,1)',
                'rgba(255,99,132,1)',
                'rgba(54,162,235,1)',
                'rgba(255,206,86,1)',
                'rgba(153,102,255,1)',
              ],
              borderWidth: 1,
            },
          ],
        };

        setChartData(chartDataset);
      } catch (error) {
        console.error('Error fetching budget data:', error.message);
      }
    };

    fetchBudgetData();
  }, [userId]);

  const renderChart = () => {
    if (!chartData) return <p className="text-gray-500">Loading chart...</p>;

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />;
      case 'pie':
        return <Pie data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />;
      case 'radar':
        return <Radar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />;
      case 'polarArea':
        return <PolarArea data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />;
      case 'line':
        return <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />;
      default:
        return <p className="text-red-500">Invalid chart type selected.</p>;
    }
  };

  return (
    <div className="budget-tracking ">
      {/* <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Budget Tracking</h2> */}

      {/* Display the Overall Cost */}
      {totals && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Total Overall Cost</h3>
          <p className="text-lg text-blue-500">{totals.totalOverallCost} CZK</p>
        </div>
      )}

      {/* Chart type toggle */}
      <div className="flex justify-center items-center mb-6">
        <label htmlFor="chartType" className="mr-3 text-gray-700 font-medium">
          Choose Chart Type:
        </label>
        <select
          id="chartType"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="doughnut">Doughnut</option>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
          <option value="radar">Radar</option>
          <option value="polarArea">Polar Area</option>
          <option value="line">Line</option>
        </select>
      </div>

      {/* Render the selected chart */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
        {renderChart()}
      </div>
    </div>
  );
};

BudgetTracking.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default BudgetTracking;