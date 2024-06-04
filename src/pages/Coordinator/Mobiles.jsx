import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import ItemTable from '../../components/ItemTable';
import FilterBar from '../../components/FilterBar';
import AddItem from '../../components/AddItem';
import Alerts from '../../components/Alerts'; 

const mobileFields = [
  { name: 'phoneNumber', label: 'Phone Number', required: true },
  { name: 'brand', label: 'Brand', required: true, maxLength: 20 },
  { name: 'model', label: 'Model', required: true, maxLength: 20 },
  { name: 'imei', label: 'IMEI', required: true, pattern: '^[0-9]{15}$', errorMessage: "IMEI must be 15 digits" }
];

function Mobiles() {
  const [mobiles, setMobiles] = useState([]);
  const [filteredMobiles, setFilteredMobiles] = useState([]);
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
      const response = await fetch('http://localhost:8515/api/Mobile');
      const data = await response.json();
      setMobiles(data);
      setFilteredMobiles(data);
    } catch (error) {
      console.error('Error fetching mobiles:', error);
    }
  };

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    const filteredResult = mobiles.filter((mobile) => {
      return Object.values(mobile).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredMobiles(filteredResult);
  };

  const handleAddItem = async (formData) => {
    try {
      console.log('Form Data:', formData); 
      const response = await fetch('http://localhost:8515/api/Mobile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding mobile:', errorData.errors); 
        throw new Error('Failed to add mobile');
      }
      setAlertMessage('Mobile added successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error adding mobile.');
      setAlertSeverity('error');
      console.error('Error adding mobile:', error);
    } finally {
      setAlertOpen(true);
    }
  };
  
  

  const handleEditItem = async (formData) => {
    try {
      const response = await fetch(`http://localhost:8515/api/Mobile/${formData.idMobile}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update mobile');
      }
      setAlertMessage('Mobile updated successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error updating mobile.');
      setAlertSeverity('error');
      console.error('Error updating mobile:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleDeleteItemClick = async (item) => {
    try {
      const response = await fetch(`http://localhost:8515/api/Mobile/${item.idMobile}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete mobile');
      }
      setAlertMessage('Mobile deleted successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error deleting mobile.');
      setAlertSeverity('error');
      console.error('Error deleting mobile:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const categoryAttributes = mobiles.length > 0 ? Object.keys(mobiles[0]).filter(attr => attr !== 'id') : [];

  return (
    <div>
      <h2>Mobiles</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {showAddDialog && (
        <AddItem onAdd={handleAddItem} onClose={() => setShowAddDialog(false)} fields={mobileFields} />
      )}
      {filteredMobiles.length > 0 ? (
        <ItemTable
          items={filteredMobiles}
          headers={Object.keys(mobiles[0] || {}).map(header =>
            header === "assignedDriver" ? "assignedDriver.driverName" :
            header === "assignmentType" ? "assignmentType" : header)}
          onDelete={handleDeleteItemClick}
          onEdit={handleEditItem}
          fields={mobileFields}
        />
      ) : (
        <p>No mobiles match the current filters.</p>
      )}
      <Alerts open={alertOpen} message={alertMessage} severity={alertSeverity} onClose={handleAlertClose} />
    </div>
  );
}

export default Mobiles;
