import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, Select } from '@mui/material';
import axios from 'axios';

const PendingInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [notes, setNotes] = useState({});
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [availabilityDetails, setAvailabilityDetails] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchInvoices();
        fetchWarehouses();
        fetchDrivers();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://localhost:8515/api/Inv/pending');
            const invoices = response.data;

            const updatedInvoices = await Promise.all(invoices.map(async (invoice) => {
                const products = invoice.products || [];
                console.log('Products for invoice:', invoice.idInvoice, products); // Log the products
                const availabilityResponse = await axios.post('http://localhost:8515/api/Product/CheckAvailability', products.map(product => ({
                    productId: product.idProduct,
                    quantity: product.orderQuantity
                })));
                console.log('Availability response for invoice:', invoice.idInvoice, availabilityResponse.data); // Log the response
                invoice.allAvailable = availabilityResponse.data.allAvailable;
                return invoice;
            }));

            setInvoices(updatedInvoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    const fetchWarehouses = async () => {
        const response = await axios.get('http://localhost:8515/api/Warehouses/GetWarehouses');
        setWarehouses(response.data);
    };

    const fetchDrivers = async () => {
        const response = await axios.get('http://localhost:8515/api/Driver/GetDriversWithName');
        setDrivers(response.data);
    };

    const handleApprove = async (invoice) => {
        if (!invoice.selectedDriver || !invoice.selectedWarehouse) {
            alert("Please select both driver and warehouse.");
            return;
        }

        try {
            await axios.put(`http://localhost:8515/api/Inv/${invoice.idInvoice}/assign`, {
                warehouseId: invoice.selectedWarehouse,
                driverId: invoice.selectedDriver
            });

            await axios.put(`http://localhost:8515/api/Inv/${invoice.idInvoice}/approve`, { note: notes[invoice.idInvoice] || '' });

            setInvoices((prevInvoices) =>
                prevInvoices.filter((inv) => inv.idInvoice !== invoice.idInvoice)
            );
        } catch (error) {
            console.error('Error approving invoice:', error);
        }
    };

    const handleReject = async (invoice) => {
        if (!notes[invoice.idInvoice]) {
            alert("Please enter a note for rejection.");
            return;
        }

        try {
            await axios.put(`http://localhost:8515/api/Inv/${invoice.idInvoice}/reject`, { note: notes[invoice.idInvoice] });

            setInvoices(prev => prev.filter(inv => inv.idInvoice !== invoice.idInvoice));
        } catch (error) {
            console.error('Error rejecting invoice:', error);
        }
    };

    const checkAvailability = async (invoice) => {
        try {
            const products = invoice.products || [];
            console.log('Checking availability for products:', products); 
            const response = await axios.post('http://localhost:8515/api/Product/CheckAvailability', products.map(product => ({
                productId: product.idProduct,
                quantity: product.orderQuantity
            })));
            
            console.log('Availability Response:', response.data);

            setAvailabilityDetails(response.data.products || []);
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
                            <TableCell>Warehouse Name</TableCell>
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
                                <TableCell>
                                    <Select
                                        value={invoice.selectedWarehouse || ''}
                                        onChange={(e) => {
                                            const selectedWarehouse = e.target.value;
                                            setInvoices(prev => prev.map(inv => inv.idInvoice === invoice.idInvoice ? { ...inv, selectedWarehouse } : inv));
                                        }}
                                    >
                                        {warehouses.map(warehouse => (
                                            <MenuItem key={warehouse.idWarehouse} value={warehouse.idWarehouse}>{warehouse.nameWarehouse}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={invoice.selectedDriver || ''}
                                        onChange={(e) => {
                                            const selectedDriver = e.target.value;
                                            setInvoices(prev => prev.map(inv => inv.idInvoice === invoice.idInvoice ? { ...inv, selectedDriver } : inv));
                                        }}
                                    >
                                        {drivers.map(driver => (
                                            <MenuItem key={driver.idDriver} value={driver.idDriver}>{`${driver.firstName} ${driver.lastName}`}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell style={{ backgroundColor: invoice.allAvailable ? 'lightgreen' : 'lightcoral' }}>
                                    {invoice.allAvailable ? 'Available' : 'Not Available'}
                                    <Button onClick={() => checkAvailability(invoice)}>More</Button>
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        label="Note"
                                        value={notes[invoice.idInvoice] || ''}
                                        onChange={(e) => setNotes({ ...notes, [invoice.idInvoice]: e.target.value })}
                                        fullWidth
                                    />
                                    <Button onClick={() => handleApprove(invoice)}>Approve</Button>
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

export default PendingInvoices;
