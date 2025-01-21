import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
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
  const [chartType, setChartType] = useState('doughnut');
  const [savedChartType, setSavedChartType] = useState(null);

  const { t } = useTranslation();



  useEffect(() => {
    const fetchDefaultChartType = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/chart-type?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data.chartType) {
          setSavedChartType(response.data.chartType);
          setChartType(response.data.chartType);
        }
      } catch (error) {
        console.error('Error fetching default chart type:', error.message);
      }
    };
  
    fetchDefaultChartType();
  }, [userId]);
  

  
  const saveChartType = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/chart-type`,
        { userId, chartType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedChartType(chartType);
    } catch (error) {
      console.error('Error saving chart type:', error.message);
    }
  };
  
  

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

        const {
          totalTransport,
          totalFood,
          totalActivities,
          totalOther,
          totalAccommodation,
          totalOverallCost,
        } = response.data;

        setTotals({
          transport: totalTransport,
          food: totalFood,
          activities: totalActivities,
          other: totalOther,
          accommodation: totalAccommodation,
          totalOverallCost,
        });

        const chartDataset = {
          labels: [
            `${t('Transport')} (${totalTransport} CZK)`,
            `${t('Food')} (${totalFood} CZK)`,
            `${t('Activities')} (${totalActivities} CZK)`,
            `${t('Other')} (${totalOther} CZK)`,
            `${t('Accommodation')} (${totalAccommodation} CZK)`,
          ],
          datasets: [
            {
              label: 'Expenses (% of Total)',
              data: [
                totalTransport,
                totalFood,
                totalActivities,
                totalOther,
                totalAccommodation,
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
  }, [userId, t]);

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
    <div className="budget-tracking">
      {totals && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-700">{t('totalCost')}</h3>
          <p className="text-lg text-blue-500">{totals?.totalOverallCost || 0} CZK</p>
        </div>
      )}

      <div className="flex justify-center items-center mb-6">
        <label htmlFor="chartType" className="mr-3 text-gray-700 font-medium">
        {t('budgetChart')}
        </label>
        <select
          id="chartType"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="doughnut">{t('Doughnut')}</option>
          <option value="bar">{t('Bar')}</option>
          <option value="pie">{t('Pie')}</option>
          <option value="radar">{t('Radar')}</option>
          <option value="polarArea">{t('PolarArea')}</option>
          <option value="line">{t('Line')}</option>
        </select>
  {chartType !== savedChartType && (
    <button
      onClick={saveChartType}
      className="ml-3 p-2 text-blue-500 hover:text-blue-700 focus:outline-none"
      title="Save selected chart type"
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 52.5879 83.252"
        className="w-6 h-6"
      >
        <g>
          <rect height="83.252" opacity="0" width="52.5879" x="0" y="0" />
          <path
            d="M4.44336 83.1055C6.49414 83.1055 7.71484 81.8848 11.7188 78.0273L25.9277 64.2578C26.123 64.0625 26.5137 64.0625 26.6602 64.2578L40.8691 78.0273C44.9219 81.8848 46.0938 83.1055 48.1934 83.1055C50.9766 83.1055 52.5879 81.25 52.5879 77.9785L52.5879 11.377C52.5879 3.80859 48.8281 0 41.3574 0L11.2305 0C3.75977 0 0 3.80859 0 11.377L0 77.9785C0 81.25 1.61133 83.1055 4.44336 83.1055ZM8.00781 71.1426C7.4707 71.6309 6.88477 71.4844 6.88477 70.752L6.88477 11.4746C6.88477 8.44727 8.49609 6.88477 11.5723 6.88477L41.0156 6.88477C44.0918 6.88477 45.7031 8.44727 45.7031 11.4746L45.7031 70.752C45.7031 71.4844 45.1172 71.6309 44.6289 71.1426L28.5156 55.8594C27.1484 54.541 25.4395 54.541 24.0723 55.8594Z"
            fill="black"
            fillOpacity="0.85"
          />
        </g>
      </svg>
    </button>
  )}

  {chartType === savedChartType && (
    <div className="ml-3 p-2">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 52.5879 83.252"
        className="w-6 h-6 text-green-500"
      >
        <g>
          <rect height="83.252" opacity="0" width="52.5879" x="0" y="0" />
          <path
            d="M4.44336 83.1055C6.49414 83.1055 7.71484 81.8848 11.7188 78.0273L25.9277 64.2578C26.123 64.0625 26.5137 64.0625 26.6602 64.2578L40.8691 78.0273C44.9219 81.8848 46.0938 83.1055 48.1934 83.1055C50.9766 83.1055 52.5879 81.25 52.5879 77.9785L52.5879 11.377C52.5879 3.80859 48.8281 0 41.3574 0L11.2305 0C3.75977 0 0 3.80859 0 11.377L0 77.9785C0 81.25 1.61133 83.1055 4.44336 83.1055Z"
            fill="black"
            fillOpacity="0.85"
          />
        </g>
      </svg>
    </div>
  )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-inner">{renderChart()}</div>
    </div>
  );
};

BudgetTracking.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default BudgetTracking;
