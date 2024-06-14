import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import FilterBar from '../../components/FilterBar';
import AddItem from '../../components/AddItem';
import EditItem from '../../components/EditItem';
import ViewItemPopup from '../../components/ViewItemPopup';
import Alerts from '../../components/Alerts';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

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
  const [vehicleAssignments, setVehicleAssignments] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewVehicle, setViewVehicle] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    fetchData();
    fetchAssignments();
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

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/VehicleDriver/GetVehicleAssignments');
      const data = await response.json();
      setVehicleAssignments(data);
    } catch (error) {
      console.error('Error fetching vehicle assignments:', error);
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
        const errorData = await response.json();
        console.error('Error adding vehicle:', errorData.errors);
        throw new Error('Failed to add vehicle');
      }
      setAlertMessage('Vehicle added successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error adding vehicle.');
      setAlertSeverity('error');
      console.error('Error adding vehicle:', error);
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
      setSelectedVehicle(null);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewItemClick = async (item) => {
    const enrichedVehicle = {
      ...item,
      driverName: getDriverName(item.registration),
      assignmentType: await getAssignmentType(item.registration)
    };
    setViewVehicle(enrichedVehicle);
  };

  const handleDeleteItemButtonClick = (item) => {
    setDeleteItem(item);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteItemClick(deleteItem);
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };

  const getDriverName = (registration) => {
    const assignment = vehicleAssignments.find(a => a.vehicleRegistration === registration);
    return assignment ? assignment.driverName : 'No Driver';
  };

  const getAssignmentType = async (registration) => {
    try {
      const response = await fetch(`http://localhost:8515/api/VehicleDriver/GetDriverAndAssignmentType/${registration}`);
      if (!response.ok) {
        return 'unassigned';
      }
      const data = await response.json();
      return data.assignmentType;
    } catch (error) {
      console.error('Error fetching assignment type:', error);
      return 'unassigned';
    }
  };

  const displayHeaders = {
    idVehicle: 'ID',
    registration: 'Registration',
    brand: 'Brand',
    model: 'Model',
    assignmentType: 'Assignment Type'
  };

  return (
    <div>
      <h2>Vehicles</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {showAddDialog && (
        <AddItem onAdd={handleAddItem} onClose={() => setShowAddDialog(false)} fields={vehicleFields} />
      )}
      {selectedVehicle && (
        <EditItem item={selectedVehicle} onSave={handleEditItem} onClose={() => setSelectedVehicle(null)} fields={vehicleFields} />
      )}
      {viewVehicle && (
        <ViewItemPopup item={viewVehicle} onClose={() => setViewVehicle(null)} />
      )}
      {filteredVehicles.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Object.keys(displayHeaders).map((header) => (
                    <TableCell key={header}>{displayHeaders[header]}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredVehicles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredVehicles
                ).map((item) => (
                  <TableRow key={item.idVehicle}>
                    {Object.keys(displayHeaders).map((header) => (
                      <TableCell key={`${item.idVehicle}-${header}`}>
                        {header === 'assignmentType' ? item.assignmentType : item[header]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button onClick={() => handleViewItemClick(item)}>View</Button>
                      <Button onClick={() => setSelectedVehicle(item)}>Edit</Button>
                      <Button onClick={() => handleDeleteItemButtonClick(item)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 50, 100]}
            component="div"
            count={filteredVehicles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete}>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this item?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete}>Cancel</Button>
              <Button onClick={handleConfirmDelete}>Delete</Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <p>No vehicles match the current filters.</p>
      )}
      <Alerts open={alertOpen} message={alertMessage} severity={alertSeverity} onClose={handleAlertClose} />
    </div>
  );
}

export default Vehicles;
