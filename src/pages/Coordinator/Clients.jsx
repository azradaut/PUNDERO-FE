import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import axios from 'axios';
import AddAccount from '../../components/AddAccount';
import EditAccount from '../../components/EditAccount';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

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

    const handleDeleteClient = async (clientId) => {
        try {
            await axios.delete(`http://localhost:8515/api/Client/DeleteClient/${clientId}`);
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedClient(null);
    };

    const handleClientUpdated = () => {
        fetchClients();
        handleDialogClose();
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
                            additionalFields={[{ name: 'Store', label: 'Store' }]}
                        />
                    ) : (
                        <AddAccount
                            accountType="Client"
                            onAccountAdded={handleClientUpdated}
                            additionalFields={[{ name: 'Store', label: 'Store' }]}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Clients;
