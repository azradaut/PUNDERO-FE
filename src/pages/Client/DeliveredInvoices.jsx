import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';

const DeliveredInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [availabilityDetails, setAvailabilityDetails] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { setNotifications } = useNotification();

    const storeName = localStorage.getItem('storeName'); // Assuming the store name is stored locally

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get(`http://localhost:8515/api/Invoice/GetDeliveredInvoicesForStore/store/${localStorage.storeName}`);
            const invoices = response.data;
            setInvoices(invoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const handleAccept = async (invoice) => {
        try {
            await axios.put(`http://localhost:8515/api/Invoice/AcceptInvoice/${invoice.idInvoice}/complete`);
            setInvoices(prevInvoices => prevInvoices.filter(inv => inv.idInvoice !== invoice.idInvoice));
            setNotifications(prev => [...prev, { message: 'Invoice accepted', seen: false }]);
        } catch (error) {
            console.error('Error accepting invoice:', error);
        }
    };

    const handleReject = async (invoice) => {
        try {
            await axios.put(`http://localhost:8515/api/Invoice/RejectInvoice/${invoice.idInvoice}/fail`);
            setInvoices(prev => prev.filter(inv => inv.idInvoice !== invoice.idInvoice));
            setNotifications(prev => [...prev, { message: 'Invoice rejected', seen: false }]);
        } catch (error) {
            console.error('Error rejecting invoice:', error);
        }
    };

    const checkAvailability = async (invoice) => {
        try {
            const response = await axios.post('http://localhost:8515/api/Product/CheckAvailability', invoice.invoiceProducts.map(product => ({
                productId: product.idProduct,
                quantity: product.orderQuantity
            })));
            setAvailabilityDetails(response.data.products);
            setSelectedInvoice(invoice);
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Error checking availability:', error);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedInvoice(null);
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <TableContainer component={Paper}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id Invoice</TableCell>
                            <TableCell>Issue Date</TableCell>
                            <TableCell>Store Name</TableCell>
                            <TableCell>Driver Name</TableCell>
                            <TableCell>Product Availability</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.idInvoice}>
                                <TableCell>{invoice.idInvoice}</TableCell>
                                <TableCell>{new Date(invoice.issueDate).toLocaleString()}</TableCell>
                                <TableCell>{invoice.storeName || "N/A"}</TableCell>
                                <TableCell>{`${invoice.idDriverNavigation?.firstName} ${invoice.idDriverNavigation?.lastName}`}</TableCell>
                                <TableCell>
                                    <Button onClick={() => checkAvailability(invoice)}>Check</Button>
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleAccept(invoice)}>Accept</Button>
                                    <Button onClick={() => handleReject(invoice)}>Reject</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Product Availability</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell>Order Quantity</TableCell>
                                    <TableCell>Available Quantity</TableCell>
                                    <TableCell>Barcode</TableCell>
                                    <TableCell>Available</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {availabilityDetails.map(product => (
                                    <TableRow key={product.idProduct} style={{ backgroundColor: product.availableQuantity >= product.orderQuantity ? 'white' : 'lightcoral' }}>
                                        <TableCell>{product.nameProduct}</TableCell>
                                        <TableCell>{product.orderQuantity}</TableCell>
                                        <TableCell>{product.availableQuantity}</TableCell>
                                        <TableCell>{product.barcode}</TableCell>
                                        <TableCell>{product.availableQuantity >= product.orderQuantity ? 'Yes' : 'No'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <Button onClick={handleDialogClose}>Close</Button>
            </Dialog>
        </div>
    );
};

export default DeliveredInvoices;
