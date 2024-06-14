import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import axios from 'axios';
import AddAccount from '../../components/AddAccount';
import EditAccount from '../../components/EditAccount';
import Alerts from '../../components/Alerts';
import ViewAccount from '../../components/ViewAccount';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:8515/api/Client/GetClients');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleAddClient = () => {
        setIsEdit(false);
        setIsDialogOpen(true);
    };

    const handleEditClient = (client) => {
        setSelectedClient(client);
        setIsEdit(true);
        setIsDialogOpen(true);
    };

    const handleViewClient = (accountId) => {
        setSelectedClient(accountId);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClient = async (clientId) => {
        try {
            await axios.delete(`http://localhost:8515/api/Client/DeleteClient/${clientId}`);
            fetchClients();
            setAlertMessage('Client deleted successfully!');
            setAlertSeverity('success');
            setAlertOpen(true);
        } catch (error) {
            console.error('Error deleting client:', error);
            setAlertMessage('Error deleting client.');
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedClient(null);
    };

    const handleClientUpdated = () => {
        fetchClients();
        handleDialogClose();
        setAlertMessage(isEdit ? 'Client edited successfully!' : 'Client added successfully!');
        setAlertSeverity('success');
        setAlertOpen(true);
    };

    const handleCloseViewDialog = () => {
        setIsViewDialogOpen(false);
        setSelectedClient(null);
    };

    return (
        <div>
            <h2>Clients</h2>
            <Button variant="contained" color="primary" onClick={handleAddClient}>
                Add Client
            </Button>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Store</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.idClient}>
                            <TableCell>{client.idClient}</TableCell>
                            <TableCell>{`${client.firstName} ${client.lastName}`}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.store}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleViewClient(client.idAccount)}>View</Button>
                                <Button onClick={() => handleEditClient(client)}>Edit</Button>
                                <Button onClick={() => handleDeleteClient(client.idClient)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{isEdit ? 'Edit Client' : 'Add Client'}</DialogTitle>
                <DialogContent>
                    {isEdit && selectedClient ? (
                        <EditAccount
                            accountType="Client"
                            accountId={selectedClient.idAccount}
                            onAccountUpdated={handleClientUpdated}
                            onClose={handleDialogClose}
                            additionalFields={[]}
                        />
                    ) : (
                        <AddAccount
                            accountType="Client"
                            onAccountAdded={handleClientUpdated}
                            onClose={handleDialogClose}
                            additionalFields={[]}
                        />
                    )}
                </DialogContent>
            </Dialog>
            {isViewDialogOpen && <ViewAccount accountType="Client" accountId={selectedClient} onClose={handleCloseViewDialog} />}
            <Alerts
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={() => setAlertOpen(false)}
            />
        </div>
    );
};

export default Clients;
