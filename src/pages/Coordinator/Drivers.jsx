import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import axios from 'axios';
import AddAccount from '../../components/AddAccount';
import EditAccount from '../../components/EditAccount';
import Alerts from '../../components/Alerts';
import ViewAccount from '../../components/ViewAccount';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:8515/api/Driver/GetDrivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const handleAddDriver = () => {
        setIsEdit(false);
        setIsDialogOpen(true);
    };

    const handleEditDriver = (driver) => {
        setSelectedDriver(driver);
        setIsEdit(true);
        setIsDialogOpen(true);
    };

    const handleViewDriver = (driverId) => {
        setSelectedDriver(driverId);
        setIsViewDialogOpen(true);
    };

    const handleDeleteDriver = async (driverId) => {
        try {
            await axios.delete(`http://localhost:8515/api/Driver/DeleteDriver/${driverId}`);
            fetchDrivers();
            setAlertMessage('Driver deleted successfully!');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (error) {
            console.error('Error deleting driver:', error);
            setAlertMessage('Error deleting driver.');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedDriver(null);
    };

    const handleDriverUpdated = () => {
        fetchDrivers();
        handleDialogClose();
        setAlertMessage(isEdit ? 'Driver edited successfully!' : 'Driver added successfully!');
        setAlertSeverity('success');
        setAlertOpen(true);
    };

    const handleCloseViewDialog = () => {
        setIsViewDialogOpen(false);
        setSelectedDriver(null);
    };

    return (
        <div>
            <h2>Drivers</h2>
            <Button variant="contained" color="primary" onClick={handleAddDriver}>
                Add Driver
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>License Category</TableCell>
                        <TableCell>Tachograph Label</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {drivers.map((driver) => (
                        <TableRow key={driver.idDriver}>
                            <TableCell>{driver.idDriver}</TableCell>
                            <TableCell>{`${driver.firstName} ${driver.lastName}`}</TableCell>
                            <TableCell>{driver.email}</TableCell>
                            <TableCell>{driver.licenseCategory}</TableCell>
                            <TableCell>{driver.tachographLabel}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleViewDriver(driver.idAccount)}>View</Button>
                                <Button onClick={() => handleEditDriver(driver)}>Edit</Button>
                                <Button onClick={() => handleDeleteDriver(driver.idDriver)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{isEdit ? 'Edit Driver' : 'Add Driver'}</DialogTitle>
                <DialogContent>
                    {isEdit && selectedDriver ? (
                        <EditAccount
                            accountType="Driver"
                            accountId={selectedDriver.idAccount}
                            onAccountUpdated={handleDriverUpdated}
                            onClose={handleDialogClose}
                            additionalFields={[
                                { name: 'licenseNumber', label: 'License Number' },
                                { name: 'licenseCategory', label: 'License Category' },
                                { name: 'tachographLabel', label: 'Tachograph Label' },
                                { name: 'tachographIssueDate', label: 'Tachograph Issue Date' },
                                { name: 'tachographExpiryDate', label: 'Tachograph Expiry Date' }
                            ]}
                        />
                    ) : (
                      <AddAccount
                      accountType="Driver"
                      onAccountAdded={handleDriverUpdated}
                      onClose={handleDialogClose}
                      additionalFields={[
                          { name: 'licenseNumber', label: 'License Number' },
                          { name: 'licenseCategory', label: 'License Category' },
                          { name: 'tachographLabel', label: 'Tachograph Label' },
                          { name: 'tachographIssueDate', label: 'Tachograph Issue Date' },
                          { name: 'tachographExpiryDate', label: 'Tachograph Expiry Date' }
                      ]}
                  />
                  
                    )}
                </DialogContent>
            </Dialog>
            {isViewDialogOpen && <ViewAccount accountType="Driver" accountId={selectedDriver} onClose={handleCloseViewDialog} />}
            <Alerts
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={() => setAlertOpen(false)}
            />
        </div>
    );
};

export default Drivers;
