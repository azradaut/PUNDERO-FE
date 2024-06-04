import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import ItemTable from '../../components/ItemTable';
import FilterBar from '../../components/FilterBar';
import AddDriver from '../../components/AddDriver';
import ViewAccount from '../../components/ViewAccount';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewAccount, setViewAccount] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/Driver/GetDriversCoordinator');
      const data = await response.json();
      setDrivers(data);
      setFilteredDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    const filteredResult = drivers.filter((driver) => {
      return Object.values(driver).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredDrivers(filteredResult);
  };

  const handleAddDriver = async (formData) => {
    try {
      console.log("Sending Form Data: ", formData);
      const response = await fetch('http://localhost:8515/api/Driver/AddDriver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchData();
        setShowAddDialog(false);
      } else {
        const errorData = await response.json();
        console.error('Error adding driver:', errorData);
      }
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  const handleViewDriver= (driver) => {
    setViewAccount(driver);
  };

  return (
    <div>
      <h2>Drivers</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {filteredDrivers.length > 0 ? (
        <ItemTable
          items={filteredDrivers}
          headers={Object.keys(drivers[0] || {}).map(header =>
            header === "assignedDriver" ? "assignedDriver.driverName" :
            header === "assignmentType" ? "assignmentType" : header)}
          customActions={(item) => (
            <Button onClick={() => handleViewDriver(item)}>View</Button>
          )}
        />
      ) : (
        <p>No drivers match the current filters.</p>
      )}
      {showAddDialog && (
        <AddDriver
          onAdd={handleAddDriver}
          onClose={() => setShowAddDialog(false)}
        />
      )}
      {viewAccount && (
        <ViewAccount
          account={viewAccount}
          onClose={() => setViewAccount(null)}
        />
      )}
    </div>
  );
}

export default Drivers;
