// src/pages/Client/CreateOrder.jsx
import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function CreateOrder({ cart, setCart }) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const clientId = 1; // Replace with actual client ID from context or authentication
    const products = cart.map((item) => ({ productId: item.idProduct, quantity: item.quantity }));

    const request = {
      clientId,
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
        navigate('/client/dashboard');
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Review Order</Typography>
      {cart.map((item) => (
        <div key={item.idProduct}>
          <Typography>{item.nameProduct}</Typography>
          <Typography>Quantity: {item.quantity}</Typography>
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Order
      </Button>
    </div>
  );
}

export default CreateOrder;
