import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

function EditItem({ item, onSave, onClose, fields }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (item && !isInitialized) {
      setFormData(item);
      setIsInitialized(true);
    }
  }, [item, isInitialized]);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    const field = fields.find(f => f.name === name);
    let error = "";
    if (field) {
      if (field.required && !value) {
        error = `${field.label} is required`;
      } else if (field.maxLength && value.length > field.maxLength) {
        error = `${field.label} cannot be longer than ${field.maxLength} characters`;
      }
    }
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      if (error && error.data) {
        const validationErrors = error.data.errors || {};
        setErrors(validationErrors);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDialogClose = () => {
    onClose();
  };

  return (
    <Dialog open={true} onClose={handleDialogClose}>
      <DialogTitle>Edit Item</DialogTitle>
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
        <Button onClick={handleSave} variant="contained" color="primary" disabled={isSaving}>Save</Button>
        <Button onClick={handleDialogClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditItem;
