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

const mobileFields = [
  { name: 'phoneNumber', label: 'Phone Number', required: true },
  { name: 'brand', label: 'Brand', required: true, maxLength: 20 },
  { name: 'model', label: 'Model', required: true, maxLength: 20 },
  { name: 'imei', label: 'IMEI', required: true, pattern: '^[0-9]{15}$', errorMessage: "IMEI must be 15 digits" }
];

function Mobiles() {
  const [mobiles, setMobiles] = useState([]);
  const [mobileAssignments, setMobileAssignments] = useState([]);
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState(null);
  const [viewMobile, setViewMobile] = useState(null);
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
      const response = await fetch('http://localhost:8515/api/Mobile');
      const data = await response.json();
      setMobiles(data);
      setFilteredMobiles(data);
    } catch (error) {
      console.error('Error fetching mobiles:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/MobileDriver/GetMobileAssignments');
      const data = await response.json();
      setMobileAssignments(data);
    } catch (error) {
      console.error('Error fetching mobile assignments:', error);
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
      const response = await fetch(`http://localhost:8515/api/Mobile/Update/${formData.idMobile}`, {
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
      setSelectedMobile(null);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewItemClick = (item) => {
    setViewMobile(item);
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

  const getAssignmentType = (phoneNumber) => {
    const assignment = mobileAssignments.find(a => a.phoneNumber === phoneNumber);
    return assignment ? assignment.assignmentType : 'unassigned';
  };

  const getDriverName = (phoneNumber) => {
    const assignment = mobileAssignments.find(a => a.phoneNumber === phoneNumber);
    return assignment ? assignment.driverName : 'No Driver';
  };

  const getDisplayHeaders = () => {
    return {
      idMobile: 'ID',
      phoneNumber: 'Phone Number',
      brand: 'Brand',
      model: 'Model',
      imei: 'IMEI',
      assignmentType: 'Assignment'
    };
  };

  const enrichMobilesWithAssignments = () => {
    return filteredMobiles.map(mobile => {
      return {
        ...mobile,
        assignmentType: getAssignmentType(mobile.phoneNumber),
        driverName: getDriverName(mobile.phoneNumber)
      };
    });
  };

  return (
    <div>
      <h2>Mobiles</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {showAddDialog && (
        <AddItem onAdd={handleAddItem} onClose={() => setShowAddDialog(false)} fields={mobileFields} />
      )}
      {selectedMobile && (
        <EditItem item={selectedMobile} onSave={handleEditItem} onClose={() => setSelectedMobile(null)} fields={mobileFields} />
      )}
      {viewMobile && (
        <ViewItemPopup item={viewMobile} onClose={() => setViewMobile(null)} />
      )}
      {filteredMobiles.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Object.keys(getDisplayHeaders()).map((header) => (
                    <TableCell key={header}>{getDisplayHeaders()[header]}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? enrichMobilesWithAssignments().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : enrichMobilesWithAssignments()
                ).map((item) => (
                  <TableRow key={item.idMobile}>
                    {Object.keys(getDisplayHeaders()).map((header) => (
                      <TableCell key={`${item.idMobile}-${header}`}>
                        {header === 'assignmentType' ? (
                          item.assignmentType
                        ) : header === 'driverName' ? (
                          item.driverName
                        ) : (
                          item[header]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button onClick={() => handleViewItemClick(item)}>View</Button>
                      <Button onClick={() => setSelectedMobile(item)}>Edit</Button>
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
            count={filteredMobiles.length}
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
        <p>No mobiles match the current filters.</p>
      )}
      <Alerts open={alertOpen} message={alertMessage} severity={alertSeverity} onClose={handleAlertClose} />
    </div>
  );
}

export default Mobiles;
