import React, { useState, useEffect } from 'react';
import ItemTable from '../components/ItemTable';
import FilterBar from '../components/FilterBar';
import AddItem from '../components/AddItem';
import EditItem from '../components/EditItem';
import { Button } from '@mui/material';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

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

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    // Filter vehicles based on search text
    const filteredResult = vehicles.filter((vehicle) => {
      // Check if any property of the vehicle includes the search text
      return Object.values(vehicle).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredVehicles(filteredResult); // Update filteredVehicles state
  };

  const handleAddItem = async (formData) => {
    try {
      const response = await fetch('https://localhost:44306/api/Vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to add vehicle');
      }
      // Refetch data to update the table
      fetchData();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  };

  const handleEditItem = (item) => {
    setEditItem(item); // Set the item to be edited
  };

  const handleSaveEdit = async (formData) => {
    try {
      const response = await fetch(`https://localhost:44306/api/Vehicle/${formData.idVehicle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
  
      // If the response is successful, we should first setEditItem(null) to close the edit dialog,
      // and then fetch the updated data to ensure the table reflects the changes.
      setEditItem(null); // Close the edit dialog after saving changes
      fetchData(); // Refetch data to update the table
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };
  
  const categoryAttributes = vehicles.length > 0 ? Object.keys(vehicles[0]).filter(attr => attr !== 'id') : [];
  
  return (
    <div>
      <h2>Vehicles</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {showAddDialog && (
        <AddItem 
          onAdd={handleAddItem} 
          onClose={() => setShowAddDialog(false)} 
          categoryAttributes={categoryAttributes} 
        />
      )}
      {editItem && (
        <EditItem
          item={editItem}
          fields={categoryAttributes}
          onSave={handleSaveEdit}
          onCancel={() => setEditItem(null)}
        />
      )}
      {filteredVehicles.length > 0 ? (
        <ItemTable
          items={filteredVehicles}
          headers={Object.keys(vehicles[0] || {})}
          onEdit={handleEditItem} // Pass the edit function to the ItemTable
        />
      ) : (
        <p>No vehicles match the current filters.</p>
      )}
    </div>
  );
}

export default Vehicles;