import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@mui/material';
import FilterBar from '../../components/FilterBar';
import axios from 'axios';

function ClientInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const storeName = localStorage.getItem('storeName'); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8515/api/Inv/store/${storeName}`);
      setInvoices(response.data);
      setFilteredInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleSearchChange = (newSearchText) => {
    const filtered = invoices.filter((invoice) =>
      invoice.storeName.toLowerCase().includes(newSearchText.toLowerCase())
    );
    setFilteredInvoices(filtered);
  };

  const handleStatusChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    if (status === '') {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter((invoice) => invoice.statusName === status);
      setFilteredInvoices(filtered);
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

  return (
    <div>
      <h2>Invoices</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Select value={statusFilter} onChange={handleStatusChange} fullWidth margin="normal">
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="Approved">Approved</MenuItem>
        <MenuItem value="Denied">Denied</MenuItem>
      </Select>
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
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.idInvoice}>
                <TableCell>{invoice.idInvoice}</TableCell>
                <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                <TableCell>{invoice.storeName}</TableCell>
                <TableCell>{invoice.statusName}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewInvoice(invoice.idInvoice)}>View</Button>
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

export default ClientInvoices;
