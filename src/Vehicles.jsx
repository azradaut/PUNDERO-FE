import React, { useState, useEffect } from 'react';
import ItemTable from './components/ItemTable'; // Import ItemTable component
import FilterBar from './components/FilterBar'; // Import FilterBar component

function Vehicles() {
  const [vehicles, setVehicles] = useState([]); // State to store fetched vehicles
  const [filteredVehicles, setFilteredVehicles] = useState([]); // State to store filtered vehicles
  const [filters, setFilters] = useState({ category: '', status: '', searchText: '' }); // State to store filter selections

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:44306/api/Vehicle');
        const data = await response.json();
        setVehicles(data);
        setFilteredVehicles(data); // Initialize filteredVehicles with all vehicles
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        // Handle errors gracefully, e.g., display an error message to the user
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    const filteredResult = vehicles.filter((vehicle) => {
      let matches = true;

      // Filter by category (if selected)
      if (newFilters.category && vehicle.category !== newFilters.category) {
        matches = false;
      }

      // Filter by status (if selected)
      if (newFilters.status && vehicle.status !== newFilters.status) {
        matches = false;
      }

      // Filter by search text (if provided)
      if (newFilters.searchText) {
        const searchTextLower = newFilters.searchText.toLowerCase();
        // Check if any property of the vehicle includes the search text
        matches = Object.values(vehicle).some((value) =>
          typeof value === 'string' && value.toLowerCase().includes(searchTextLower)
        );
      }

      return matches;
    });

    setFilteredVehicles(filteredResult); // Update filteredVehicles state
  };

  // Get table headers only if there's data (vehicles.length > 0) to avoid undefined access
  const headers = vehicles.length > 0 ? Object.keys(vehicles[0] || {}) : [];

  return (
    <div>
      <h2>Vehicles</h2>
      <FilterBar onFilterChange={handleFilterChange} />
      {filteredVehicles.length > 0 ? (
        <ItemTable items={filteredVehicles} headers={headers} onRowClick={handleRowClick} />
      ) : (
        <p>No vehicles match the current filters.</p>
      )}
    </div>
  );
}

// Optional: Define onRowClick handler (replace with your desired action)
function handleRowClick(id) {
  console.log('Vehicle clicked:', id);
  // You can navigate to a detail page here using useNavigate or Link from react-router-dom
  // Example: navigate(`/vehicles/${id}`); // Assuming a detail route for each vehicle
}

export default Vehicles;
