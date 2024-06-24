import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

function AddItem({ onAdd, onClose, fields }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8515/api/Client/GetClients');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    const field = fields.find(f => f.name === name);
    if (field) {
      if (field.required && !value) {
        error = `${field.label} is required`;
      } else if (field.maxLength && value.length > field.maxLength) {
        error = `${field.label} cannot be longer than ${field.maxLength} characters`;
      }
    }
    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleConfirm = async () => {
    setErrors({});
    const newErrors = {};
    fields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = [error];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onAdd(formData);
      setFormData({});
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        const validationErrors = error.response.data.errors || {};
        setErrors(validationErrors);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add Item</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          field.type === 'select' ? (
            <TextField
              key={field.name}
              select
              name={field.name}
              label={field.label}
              value={formData[field.name] || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              InputLabelProps={{ shrink: true }}
            >
              {clients.map(client => (
                <MenuItem key={client.idClient} value={`${client.firstName} ${client.lastName}`}>
                  {client.firstName} {client.lastName}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              key={field.name}
              name={field.name}
              label={field.label}
              value={formData[field.name] || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              type={field.type || 'text'}
              InputLabelProps={{ shrink: true }}
            />
          )
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained" color="primary">Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddItem;
