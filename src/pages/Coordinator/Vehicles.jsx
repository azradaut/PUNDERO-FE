import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import ItemTable from '../../components/ItemTable';
import FilterBar from '../../components/FilterBar';
import AddItem from '../../components/AddItem';
import Alerts from '../../components/Alerts'; // Import the Alerts component

const vehicleFields = [
  { name: 'registration', label: 'Registration', required: true, pattern: '^[A-Z]\\d{2}-[A-Z]-\\d{3}$', errorMessage: "Registration format must be 'A11-B-222'" },
  { name: 'issueDate', label: 'Issue Date', required: true, type: 'date', placeholder: 'yyyy-MM-dd' },
  { name: 'expiryDate', label: 'Expiry Date', required: true, type: 'date', placeholder: 'yyyy-MM-dd' },
  { name: 'brand', label: 'Brand', required: true, maxLength: 20 },
  { name: 'model', label: 'Model', required: true, maxLength: 20 },
  { name: 'color', label: 'Color', required: true, maxLength: 20 }
];

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/Vehicle');
      const data = await response.json();
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    const filteredResult = vehicles.filter((vehicle) => {
      return Object.values(vehicle).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredVehicles(filteredResult);
  };

  const handleAddItem = async (formData) => {
    try {
      const response = await fetch('http://localhost:8515/api/Vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to add vehicle');
      }
      setAlertMessage('Vehicle added successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error adding vehicle.');
      setAlertSeverity('error');
      if (error.response && error.response.data && error.response.data.errors) {
        throw error.response.data.errors;
      } else {
        console.error('Error adding vehicle:', error);
      }
    } finally {
      setAlertOpen(true);
    }
  };

  const handleEditItem = async (formData) => {
    try {
      const response = await fetch(`http://localhost:8515/api/Vehicle/${formData.idVehicle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update vehicle');
      }
      setAlertMessage('Vehicle updated successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error updating vehicle.');
      setAlertSeverity('error');
      console.error('Error updating vehicle:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleDeleteItemClick = async (item) => {
    try {
      const response = await fetch(`http://localhost:8515/api/Vehicle/DeleteVehicle/${item.idVehicle}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete vehicle');
      }
      setAlertMessage('Vehicle deleted successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error deleting vehicle.');
      setAlertSeverity('error');
      console.error('Error deleting vehicle:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const categoryAttributes = vehicles.length > 0 ? Object.keys(vehicles[0]).filter(attr => attr !== 'id') : [];

  return (
    <div>
      <h2>Vehicles</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {showAddDialog && (
        <AddItem onAdd={handleAddItem} onClose={() => setShowAddDialog(false)} fields={vehicleFields} />
      )}
      {filteredVehicles.length > 0 ? (
        <ItemTable
          items={filteredVehicles}
          headers={Object.keys(vehicles[0] || {}).map(header =>
            header === "assignedDriver" ? "assignedDriver.driverName" :
            header === "assignmentType" ? "assignmentType" : header)}
          onDelete={handleDeleteItemClick}
          onEdit={handleEditItem}
          fields={vehicleFields}
        />
      ) : (
        <p>No vehicles match the current filters.</p>
      )}
      <Alerts open={alertOpen} message={alertMessage} severity={alertSeverity} onClose={handleAlertClose} />
    </div>
  );
}

export default Vehicles;
