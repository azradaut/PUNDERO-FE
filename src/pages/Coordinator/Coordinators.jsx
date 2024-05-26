import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import ItemTable from '../../components/ItemTable';
import FilterBar from '../../components/FilterBar';
import AddCoordinator from '../../components/AddCoordinator';
import ViewAccount from '../../components/ViewAccount';

function Coordinators() {
  const [coordinators, setCoordinators] = useState([]);
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewAccount, setViewAccount] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/Coordinator/GetCoordinators');
      const data = await response.json();
      setCoordinators(data);
      setFilteredCoordinators(data);
    } catch (error) {
      console.error('Error fetching coordinators:', error);
    }
  };

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    const filteredResult = coordinators.filter((coordinator) => {
      return Object.values(coordinator).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredCoordinators(filteredResult);
  };

  const handleAddCoordinator = async (formData) => {
    try {
      console.log("Sending Form Data: ", formData);
      const response = await fetch('http://localhost:8515/api/Coordinator/AddCoordinator', {
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
        console.error('Error adding coordinator:', errorData);
      }
    } catch (error) {
      console.error('Error adding coordinator:', error);
    }
  };

  const handleViewCoordinator = (coordinator) => {
    setViewAccount(coordinator);
  };

  return (
    <div>
      <h2>Coordinators</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {filteredCoordinators.length > 0 ? (
        <ItemTable
          items={filteredCoordinators}
          headers={Object.keys(coordinators[0] || {}).map(header =>
            header === "assignedDriver" ? "assignedDriver.driverName" :
            header === "assignmentType" ? "assignmentType" : header)}
          customActions={(item) => (
            <Button onClick={() => handleViewCoordinator(item)}>View</Button>
          )}
        />
      ) : (
        <p>No coordinators match the current filters.</p>
      )}
      {showAddDialog && (
        <AddCoordinator
          onAdd={handleAddCoordinator}
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

export default Coordinators;
