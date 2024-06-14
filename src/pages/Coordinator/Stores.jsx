import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import FilterBar from '../../components/FilterBar';
import AddItem from '../../components/AddItem';
import EditItem from '../../components/EditItem';
import Alerts from '../../components/Alerts';
import ViewItemPopup from '../../components/ViewItemPopup';
import axios from 'axios';

const storeFields = [
  { name: 'name', label: 'Name', required: true, maxLength: 50 },
  { name: 'address', label: 'Address', required: true, maxLength: 100 },
  { name: 'longitude', label: 'Longitude', required: true, type: 'number' },
  { name: 'latitude', label: 'Latitude', required: true, type: 'number' },
  { name: 'clientName', label: 'Client', type: 'select', options: [] }
];

function Stores() {
  const [stores, setStores] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewStore, setViewStore] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
    fetchClients();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/Stores');
      const data = await response.json();
      setStores(data);
      setFilteredStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8515/api/Client/GetClients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    storeFields.find(field => field.name === 'clientName').options = clients.map(client => ({
      value: `${client.firstName} ${client.lastName}`,
      label: `${client.firstName} ${client.lastName}`
    }));
  }, [clients]);

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    const filteredResult = stores.filter((store) => {
      return Object.values(store).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredStores(filteredResult);
  };

  const handleAddItem = async (formData) => {
    try {
      const response = await fetch('http://localhost:8515/api/Stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to add store');
      }
      setAlertMessage('Store added successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error adding store.');
      setAlertSeverity('error');
      console.error('Error adding store:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleEditItem = async (formData) => {
    try {
      const response = await fetch(`http://localhost:8515/api/Stores/${formData.idStore}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update store');
      }
      setAlertMessage('Store updated successfully!');
      setAlertSeverity('success');
      fetchData();
      setSelectedStore(null); // Close the edit dialog after successful update
    } catch (error) {
      setAlertMessage('Error updating store.');
      setAlertSeverity('error');
      console.error('Error updating store:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleDeleteItemClick = async (item) => {
    try {
      const response = await fetch(`http://localhost:8515/api/Stores/${item.idStore}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete store');
      }
      setAlertMessage('Store deleted successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error deleting store.');
      setAlertSeverity('error');
      console.error('Error deleting store:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewItemClick = (item) => {
    setViewStore(item);
  };

  const displayHeaders = {
    idStore: 'ID',
    name: 'Name',
    address: 'Address',
    clientName: 'Client'
  };

  return (
    <div>
      <h2>Stores</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {showAddDialog && (
        <AddItem
          onAdd={handleAddItem}
          onClose={() => setShowAddDialog(false)}
          fields={storeFields}
        />
      )}
      {selectedStore && (
        <EditItem
          item={selectedStore}
          onSave={handleEditItem}
          onClose={() => setSelectedStore(null)}
          fields={storeFields}
        />
      )}
      {viewStore && (
        <ViewItemPopup
          item={viewStore}
          onClose={() => setViewStore(null)}
          additionalFields={[
            { name: 'clientName', label: 'Client' }
          ]}
        />
      )}
      {filteredStores.length > 0 ? (
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {Object.keys(displayHeaders).map((key) => (
                  <TableCell key={key}>{displayHeaders[key]}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((store) => (
                <TableRow key={store.idStore}>
                  {Object.keys(displayHeaders).map((key) => (
                    <TableCell key={key}>{store[key]}</TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => handleViewItemClick(store)}>View</Button>
                    <Button onClick={() => setSelectedStore(store)}>Edit</Button>
                    <Button onClick={() => handleDeleteItemClick(store)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 50, 100]}
            component="div"
            count={filteredStores.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        <p>No stores match the current filters.</p>
      )}
      <Alerts open={alertOpen} message={alertMessage} severity={alertSeverity} onClose={handleAlertClose} />
    </div>
  );
}

export default Stores;
