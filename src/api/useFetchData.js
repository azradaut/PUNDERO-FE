import { useState, useEffect } from 'react';
import axios from 'axios'; // Or use another library like 'fetch' for API calls

function useFetchData(url, initialParams = {}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (params) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(url, { params }); // Send params as query string
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(initialParams);
  }, [initialParams]);

  return { data, isLoading, error, fetchData };
}

export default useFetchData;
