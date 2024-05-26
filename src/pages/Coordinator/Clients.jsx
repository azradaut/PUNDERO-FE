import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import ItemTable from '../../components/ItemTable';
import FilterBar from '../../components/FilterBar';
import AddClient from '../../components/AddClient';
import ViewAccount from '../../components/ViewAccount';

function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewAccount, setViewAccount] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/Client');
      const data = await response.json();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    const filteredResult = clients.filter((client) => {
      return Object.values(client).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredClients(filteredResult);
  };

  const handleAddClient = async (formData) => {
    try {
      console.log("Sending Form Data: ", formData);
      const response = await fetch('http://localhost:8515/api/Client/AddClient', {
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
        console.error('Error adding client:', errorData);
      }
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleViewClient = (client) => {
    setViewAccount(client);
  };

  return (
    <div>
      <h2>Clients</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {filteredClients.length > 0 ? (
        <ItemTable
          items={filteredClients}
          headers={Object.keys(clients[0] || {}).map(header => header)}
          customActions={(item) => (
            <Button onClick={() => handleViewClient(item)}>View</Button>
          )}
        />
      ) : (
        <p>No clients match the current filters.</p>
      )}
      {showAddDialog && (
        <AddClient
          onAdd={handleAddClient}
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

export default Clients;
