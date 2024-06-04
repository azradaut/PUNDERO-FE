import React from 'react';
import { Button, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Box, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ReviewOrder({ cart, setCart }) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/client/products');
  };

  const handleClearAll = () => {
    setCart([]);
    navigate('/client/products');
  };

  const handleSubmit = async () => {
    const clientId = localStorage.getItem('clientId');
    const storeName = localStorage.getItem('storeName'); 
    const products = cart.map((item) => ({ productId: item.idProduct, quantity: item.quantity }));

    const request = {
      clientId,
      storeName,
      products,
    };

    try {
      const response = await fetch('http://localhost:8515/api/Inv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        setCart([]);
        navigate('/client/order-confirmation', { state: { success: true } }); // Navigate to confirmation page with success state
      } else {
        const errorMessage = await response.text();
        console.error('Failed to create order', errorMessage);
        navigate('/client/order-confirmation', { state: { success: false, message: errorMessage } }); // Navigate to confirmation page with error state
      }
    } catch (error) {
      console.error('Error creating order:', error);
      navigate('/client/order-confirmation', { state: { success: false, message: error.message } }); // Navigate to confirmation page with error state
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <Box paddingY={5}>
      <Typography variant="h4" gutterBottom>Step 2: Review Order</Typography>
      <Stepper activeStep={1} style={{ marginBottom: '20px' }}>
        <Step>
          <StepLabel>Add Products</StepLabel>
        </Step>
        <Step>
          <StepLabel>Review Order</StepLabel>
        </Step>
        <Step>
          <StepLabel>Confirmation</StepLabel>
        </Step>
      </Stepper>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="order table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.idProduct}>
                <TableCell>{item.nameProduct}</TableCell>
                <TableCell>{item.price.toFixed(2)} BAM</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{(item.price * item.quantity).toFixed(2)} BAM</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="right"><strong>Total</strong></TableCell>
              <TableCell><strong>{calculateTotal()} BAM</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box marginTop={5} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoBack}
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Submit Order
        </Button>
      </Box>
    </Box>
  );
}

export default ReviewOrder;
