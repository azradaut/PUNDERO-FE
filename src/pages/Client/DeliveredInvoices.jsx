import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

function DeliveredInvoices() {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const storeName = localStorage.getItem('storeName');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8515/api/Inv/deliveredToClient/${storeName}`);
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const handleViewInvoice = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8515/api/Inv/${id}`);
            setSelectedInvoice(response.data);
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error fetching invoice details:', error);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedInvoice(null);
    };

    const handleAccept = async (id) => {
        if (window.confirm('Are you sure you want to mark this invoice as completed?')) {
            try {
                await axios.put(`http://localhost:8515/api/Inv/${id}/complete`);
                fetchData();
                handleCloseDialog();
            } catch (error) {
                console.error('Error marking invoice as completed:', error);
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Are you sure you want to mark this invoice as failed?')) {
            try {
                await axios.put(`http://localhost:8515/api/Inv/${id}/fail`);
                fetchData();
                handleCloseDialog();
            } catch (error) {
                console.error('Error marking invoice as failed:', error);
            }
        }
    };

    return (
        <div>
            <h2>Delivered Invoices</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id Invoice</TableCell>
                            <TableCell>Issue Date</TableCell>
                            <TableCell>Store</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.idInvoice}>
                                <TableCell>{invoice.idInvoice}</TableCell>
                                <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                                <TableCell>{invoice.storeName}</TableCell>
                                <TableCell>{invoice.statusName}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleViewInvoice(invoice.idInvoice)}>View</Button>
                                    <Button onClick={() => handleAccept(invoice.idInvoice)} color="primary">Accept</Button>
                                    <Button onClick={() => handleReject(invoice.idInvoice)} color="secondary">Reject</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Invoice Details</DialogTitle>
                <DialogContent>
                    {selectedInvoice && (
                        <div>
                            <p><strong>Invoice ID:</strong> {selectedInvoice.idInvoice}</p>
                            <p><strong>Issue Date:</strong> {new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                            <p><strong>Store:</strong> {selectedInvoice.storeName}</p>
                            <p><strong>Driver:</strong> {selectedInvoice.driverName}</p>
                            <p><strong>Status:</strong> {selectedInvoice.statusName}</p>
                            <p><strong>Note:</strong> {selectedInvoice.note}</p>
                            <h4>Products:</h4>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Order Quantity</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Total Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedInvoice.products.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{product.nameProduct}</TableCell>
                                            <TableCell>{product.orderQuantity}</TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell>{product.totalPrice}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <p><strong>Total Amount:</strong> {selectedInvoice.totalAmount}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeliveredInvoices;
