import React from 'react';
import { Button, Typography, Box, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { success, message } = location.state || {};

  const handleGoBack = () => {
    navigate('/client/products');
  };

  return (
    <Box paddingY={5} display="flex" justifyContent="center">
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {success ? 'Order Submitted Successfully' : 'Order Submission Failed'}
        </Typography>
        <Stepper activeStep={2} style={{ marginBottom: '20px' }}>
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
        <Typography variant="body1" gutterBottom>
          {success ? (
            <>
              Your order has been submitted successfully. You will be notified when your order is processed.
              Please ensure to check the products upon delivery and accept or reject the order if something is wrong.
            </>
          ) : (
            <>
              There was an error submitting your order. {message}
            </>
          )}
        </Typography>
        <Box marginTop={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoBack}
          >
            Go Back to Products
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderConfirmation;
