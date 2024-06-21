import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
);

const Dashboard = () => {
  const [forecastSumData, setForecastSumData] = useState([]);
  const [forecastProductData, setForecastProductData] = useState([]);
  const [forecastStoreData, setForecastStoreData] = useState([]);
 // const [forecastStoreProductData, setForecastStoreProductData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const sumResult = await axios.get('http://localhost:8515/api/SalesForecasting/forecast-sum?horizon=10');
      const productResult = await axios.get('http://localhost:8515/api/SalesForecasting/forecast-product?productId=3&horizon=10');
      const storeResult = await axios.get('http://localhost:8515/api/SalesForecasting/forecast-store?storeId=3&horizon=10');

      setForecastSumData(sumResult.data);
      setForecastProductData(productResult.data);
      setForecastStoreData(storeResult.data);
      //setForecastStoreProductData(storeProductResult.data);
    };
    fetchData();
  }, []);

  const createChartData = (data, label) => ({
    labels: Array.from({ length: data.length }, (_, i) => `Period ${i + 1}`),
    datasets: [
      {
        label: label,
        data: data,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  });

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Period',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Order Quantity',
        },
      },
    },
  };

  return (
    <div>
      <h2>Sales Forecast</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Line data={createChartData(forecastSumData, 'Total Forecasted Order Quantity')} options={options} />
      </div>
      <h2>Product Forecast</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Line data={createChartData(forecastProductData, 'Forecasted Order Quantity for Product ID 3')} options={options} />
      </div>
      <h2>Store Forecast</h2>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Line data={createChartData(forecastStoreData, 'Forecasted Order Quantity for Store ID 3')} options={options} />
      </div>
      <h2>Store-Product Forecast</h2>
      
    </div>
  );
};

export default Dashboard;
