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
import {
  Box,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  TextField,
  Grid,
} from '@mui/material';

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

const CoordinatorDashboard = () => {
  const [forecastSumData, setForecastSumData] = useState([]);
  const [forecastProductData, setForecastProductData] = useState([]);
  const [forecastStoreData, setForecastStoreData] = useState([]);
  const [forecastStoreProductData, setForecastStoreProductData] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [storeProductStore, setStoreProductStore] = useState('');
  const [storeProductProduct, setStoreProductProduct] = useState('');

  const user = {
    firstName: localStorage.getItem('firstName') || 'Samir',
    lastName: localStorage.getItem('lastName') || 'Fazlinovic',
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const storesResult = await axios.get('http://localhost:8515/api/Stores/GetStores');
      const productsResult = await axios.get('http://localhost:8515/api/Product/GetProductsByName/GetProducts');
      setStores(storesResult.data);
      setProducts(productsResult.data);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchSumData = async () => {
      const sumResult = await axios.get('http://localhost:8515/api/SalesForecasting/forecast-sum?horizon=10');
      setForecastSumData(sumResult.data);
    };

    fetchSumData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedProduct) {
        const productResult = await axios.get('http://localhost:8515/api/SalesForecasting/forecast-product', {
          params: {
            productId: selectedProduct,
            horizon: 10,
          },
        });
        setForecastProductData(productResult.data);
      }

      if (selectedStore) {
        const storeResult = await axios.get('http://localhost:8515/api/SalesForecasting/forecast-store', {
          params: {
            storeId: selectedStore,
            horizon: 10,
          },
        });
        setForecastStoreData(storeResult.data);
      }

      if (storeProductStore && storeProductProduct) {
        const storeProductResult = await axios.get('http://localhost:8515/api/SalesForecasting/forecast-store-product', {
          params: {
            storeId: storeProductStore,
            productId: storeProductProduct,
            horizon: 10,
          },
        });
        setForecastStoreProductData(storeProductResult.data);
      }
    };

    fetchData();
  }, [selectedStore, selectedProduct, storeProductStore, storeProductProduct]);

  const createChartData = (data, label) => ({
    labels: Array.from({ length: data.length }, (_, i) => `Period ${i + 1}`),
    datasets: [
      {
        label: label,
        data: data,
        fill: false,
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        borderColor: 'rgba(25, 118, 210, 1)',
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
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4">Welcome, {user.firstName}</Typography>
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6">Total Sales Forecast</Typography>
          <Line data={createChartData(forecastSumData, 'Total Forecasted Order Quantity')} options={options} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="store-select-label">Store</InputLabel>
            <Select
              labelId="store-select-label"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              label="Store"
            >
              {stores.map((store) => (
                <MenuItem key={store.idStore} value={store.idStore}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.nameProduct}
            onChange={(event, newValue) => setSelectedProduct(newValue ? newValue.idProduct : '')}
            renderInput={(params) => <TextField {...params} label="Product" />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Store Sales Forecast</Typography>
          <Line data={createChartData(forecastStoreData, 'Forecasted Order Quantity for Store')} options={options} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Product Sales Forecast</Typography>
          <Line data={createChartData(forecastProductData, 'Forecasted Order Quantity for Product')} options={options} />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="store-product-store-select-label">Store</InputLabel>
                <Select
                  labelId="store-product-store-select-label"
                  value={storeProductStore}
                  onChange={(e) => setStoreProductStore(e.target.value)}
                  label="Store"
                >
                  {stores.map((store) => (
                    <MenuItem key={store.idStore} value={store.idStore}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => option.nameProduct}
                onChange={(event, newValue) => setStoreProductProduct(newValue ? newValue.idProduct : '')}
                renderInput={(params) => <TextField {...params} label="Product" />}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Store-Product Sales Forecast</Typography>
          <Line data={createChartData(forecastStoreProductData, 'Forecasted Order Quantity for Store-Product')} options={options} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CoordinatorDashboard;
