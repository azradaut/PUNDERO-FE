import React, { useState, useEffect } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel, TextField
} from '@mui/material';
import FilterBar from '../../components/FilterBar';
import Alerts from '../../components/Alerts';
import ViewItemPopup from '../../components/ViewItemPopup';

const AssignMobile = () => {
  const [assignments, setAssignments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [unassignedMobiles, setUnassignedMobiles] = useState([]);
  const [assignmentTypes, setAssignmentTypes] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchDrivers();
    fetchUnassignedMobiles();
    fetchAssignmentTypes();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/MobileDriver/GetMobileAssignments');
      const data = await response.json();
      setAssignments(data);
      setFilteredAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/MobileDriver/GetDriversWithName');
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchUnassignedMobiles = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/MobileDriver/GetUnassignedMobiles');
      const data = await response.json();
      setUnassignedMobiles(data);
    } catch (error) {
      console.error('Error fetching unassigned mobiles:', error);
    }
  };

  const fetchAssignmentTypes = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/MobileDriver/GetAssignmentTypes');
      const data = await response.json();
      setAssignmentTypes(data);
    } catch (error) {
      console.error('Error fetching assignment types:', error);
    }
  };

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    const filteredResult = assignments.filter((assignment) => {
      return Object.values(assignment).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredAssignments(filteredResult);
  };

  const handleAddItem = async (formData) => {
    try {
      const response = await fetch('http://localhost:8515/api/MobileDriver/AddMobileAssignment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add assignment');
      }
      setAlertMessage('Assignment added successfully!');
      setAlertSeverity('success');
      fetchAssignments();
    } catch (error) {
      setAlertMessage('Error adding assignment.');
      setAlertSeverity('error');
      console.error('Error adding assignment:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleEditItem = async (formData) => {
    try {
      const response = await fetch(`http://localhost:8515/api/MobileDriver/EditMobileAssignment/${formData.idMobileDriver}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update assignment');
      }
      setAlertMessage('Assignment updated successfully!');
      setAlertSeverity('success');
      fetchAssignments();
    } catch (error) {
      setAlertMessage('Error updating assignment.');
      setAlertSeverity('error');
      console.error('Error updating assignment:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleDeleteItemClick = async (item) => {
    try {
      setAssignmentToDelete(item);
      setIsConfirmDialogOpen(true);
    } catch (error) {
      setAlertMessage('Error deleting assignment.');
      setAlertSeverity('error');
      console.error('Error deleting assignment:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8515/api/MobileDriver/DeleteMobileAssignment/${assignmentToDelete.idMobileDriver}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete assignment');
      }
      setAlertMessage('Assignment deleted successfully!');
      setAlertSeverity('success');
      fetchAssignments();
    } catch (error) {
      setAlertMessage('Error deleting assignment.');
      setAlertSeverity('error');
      console.error('Error deleting assignment:', error);
    } finally {
      setAlertOpen(true);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleViewItem = (assignment) => {
    setSelectedAssignment(assignment);
    setIsViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setIsViewDialogOpen(false);
    setSelectedAssignment(null);
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setAssignmentToDelete(null);
  };

  return (
    <div>
      <h2>Mobile Assignments</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add Assignment</Button>
      {showAddDialog && (
        <AddEditItem
          onSave={handleAddItem}
          onClose={() => setShowAddDialog(false)}
          item={null}
          fields={[
            { name: 'driverName', label: 'Driver', type: 'select', required: true, options: drivers.map(driver => ({ value: driver.fullName, label: driver.fullName })) },
            { name: 'mobilePhoneNumber', label: 'Phone Number', type: 'select', required: true, options: unassignedMobiles.map(mobile => ({ value: mobile.phoneNumber, label: mobile.phoneNumber })) },
            { name: 'assignmentStartDate', label: 'Assignment Start Date', type: 'date', required: true },
            { name: 'assignmentEndDate', label: 'Assignment End Date', type: 'date', required: true },
            { name: 'assignmentType', label: 'Assignment Type', type: 'select', required: true, options: assignmentTypes.map(type => ({ value: type.description, label: type.description })) },
            { name: 'note', label: 'Note', type: 'text', required: false }
          ]}
        />
      )}
      {selectedAssignment && (
        <AddEditItem
          onSave={handleEditItem}
          onClose={() => setSelectedAssignment(null)}
          item={selectedAssignment}
          fields={[
            { name: 'driverName', label: 'Driver', type: 'select', required: true, options: drivers.map(driver => ({ value: driver.fullName, label: driver.fullName })) },
            { name: 'mobilePhoneNumber', label: 'Phone Number', type: 'select', required: true, options: unassignedMobiles.map(mobile => ({ value: mobile.phoneNumber, label: mobile.phoneNumber })) },
            { name: 'assignmentStartDate', label: 'Assignment Start Date', type: 'date', required: true },
            { name: 'assignmentEndDate', label: 'Assignment End Date', type: 'date', required: true },
            { name: 'assignmentType', label: 'Assignment Type', type: 'select', required: true, options: assignmentTypes.map(type => ({ value: type.description, label: type.description })) },
            { name: 'note', label: 'Note', type: 'text', required: false }
          ]}
        />
      )}
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="assignments table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Driver Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Assignment Start Date</TableCell>
              <TableCell>Assignment End Date</TableCell>
              <TableCell>Assignment Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow key={assignment.idMobileDriver}>
                <TableCell>{assignment.idMobileDriver}</TableCell>
                <TableCell>{assignment.driverName}</TableCell>
                <TableCell>{assignment.mobilePhoneNumber}</TableCell>
                <TableCell>{assignment.assignmentStartDate}</TableCell>
                <TableCell>{assignment.assignmentEndDate === "9999-12-31T00:00:00" ? "/" : assignment.assignmentEndDate}</TableCell>
                <TableCell>{assignment.assignmentType}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewItem(assignment)}>View</Button>
                  <Button onClick={() => setSelectedAssignment(assignment)}>Edit</Button>
                  <Button onClick={() => handleDeleteItemClick(assignment)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Alerts open={alertOpen} message={alertMessage} severity={alertSeverity} onClose={handleAlertClose} />
      {isViewDialogOpen && (
        <ViewItemPopup
          item={selectedAssignment}
          onClose={handleViewDialogClose}
        />
      )}
      <Dialog open={isConfirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this assignment?</DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const AddEditItem = ({ onSave, onClose, item, fields }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{item ? 'Edit Assignment' : 'Add Assignment'}</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <FormControl key={field.name} fullWidth margin="normal">
            {field.type === 'select' ? (
              <>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                >
                  {field.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </>
            ) : (
              <TextField
                name={field.name}
                label={field.label}
                type={field.type}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
              />
            )}
          </FormControl>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignMobile;
