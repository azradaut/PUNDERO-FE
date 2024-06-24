import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import axios from 'axios';
import AddAccount from '../../components/AddAccount';
import EditAccount from '../../components/EditAccount';
import Alerts from '../../components/Alerts';
import ViewAccount from '../../components/ViewAccount';

const Coordinators = () => {
    const [coordinators, setCoordinators] = useState([]);
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    useEffect(() => {
        fetchCoordinators();
    }, []);

    const fetchCoordinators = async () => {
        try {
            const response = await axios.get('http://localhost:8515/api/Coordinator/GetCoordinators');
            setCoordinators(response.data);
        } catch (error) {
            console.error('Error fetching coordinators:', error);
        }
    };

    const handleAddCoordinator = () => {
        setIsEdit(false);
        setIsDialogOpen(true);
    };

    const handleEditCoordinator = (coordinator) => {
        setSelectedCoordinator(coordinator);
        setIsEdit(true);
        setIsDialogOpen(true);
    };

    const handleViewCoordinator = (accountId) => {
        setSelectedCoordinator(accountId);
        setIsViewDialogOpen(true);
    };

    const handleDeleteCoordinator = async (coordinatorId) => {
        try {
            await axios.delete(`http://localhost:8515/api/Coordinator/DeleteCoordinator/${coordinatorId}`);
            fetchCoordinators();
            setAlertMessage('Coordinator deleted successfully!');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (error) {
            console.error('Error deleting coordinator:', error);
            setAlertMessage('Error deleting coordinator.');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedCoordinator(null);
    };

    const handleCoordinatorUpdated = () => {
        fetchCoordinators();
        handleDialogClose();
        setAlertMessage(isEdit ? 'Coordinator edited successfully!' : 'Coordinator added successfully!');
        setAlertSeverity('success');
        setAlertOpen(true);
    };

    const handleCloseViewDialog = () => {
        setIsViewDialogOpen(false);
        setSelectedCoordinator(null);
    };

    return (
        <div>
            <h2>Coordinators</h2>
            <Button variant="contained" color="primary" onClick={handleAddCoordinator}>
                Add Coordinator
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Qualification</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {coordinators.map((coordinator) => (
                        <TableRow key={coordinator.idCoordinator}>
                            <TableCell>{coordinator.idCoordinator}</TableCell>
                            <TableCell>{`${coordinator.firstName} ${coordinator.lastName}`}</TableCell>
                            <TableCell>{coordinator.email}</TableCell>
                            <TableCell>{coordinator.qualification}</TableCell>
                            <TableCell>{coordinator.description}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleViewCoordinator(coordinator.idAccount)}>View</Button>
                                <Button onClick={() => handleEditCoordinator(coordinator)}>Edit</Button>
                                <Button onClick={() => handleDeleteCoordinator(coordinator.idCoordinator)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{isEdit ? 'Edit Coordinator' : 'Add Coordinator'}</DialogTitle>
                <DialogContent>
                    {isEdit && selectedCoordinator ? (
                        <EditAccount
                            accountType="Coordinator"
                            accountId={selectedCoordinator.idAccount}
                            onAccountUpdated={handleCoordinatorUpdated}
                            onClose={handleDialogClose}
                            additionalFields={[
                                { name: 'qualification', label: 'Qualification' },
                                { name: 'description', label: 'Description' }
                            ]}
                        />
                    ) : (
                        <AddAccount
                            accountType="Coordinator"
                            onAccountAdded={handleCoordinatorUpdated}
                            onClose={handleDialogClose}
                            additionalFields={[
                                { name: 'qualification', label: 'Qualification' },
                                { name: 'description', label: 'Description' }
                            ]}
                        />
                    )}
                </DialogContent>
            </Dialog>
            {isViewDialogOpen && <ViewAccount accountType="Coordinator" accountId={selectedCoordinator} onClose={handleCloseViewDialog} />}
            <Alerts
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={() => setAlertOpen(false)}
            />
        </div>
    );
};

export default Coordinators;
