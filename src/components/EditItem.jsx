import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function EditItem({ item, onSave, onClose, fields }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      console.log("Editing item: ", item);
      setFormData(item);
    }
  }, [item]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const field = fields.find(f => f.name === name);
    let error = "";
    if (field) {
      if (field.required && !value) {
        error = `${field.label} is required`;
      } else if (field.pattern && !new RegExp(field.pattern).test(value)) {
        error = field.errorMessage || `Invalid format for ${field.label}`;
      } else if (field.maxLength && value.length > field.maxLength) {
        error = `${field.label} cannot be longer than ${field.maxLength} characters`;
      }
    }
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleSave = async () => {
    setErrors({});
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
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            label={`${field.label} ${field.pattern ? `(format: ${field.placeholder})` : ''}`}
            value={formData[field.name] || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors[field.name]}
            helperText={errors[field.name] ? errors[field.name][0] : ''}
            type={field.type || 'text'}
            InputLabelProps={{ shrink: true }}
            placeholder={formData[field.name] || field.placeholder || ''}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditItem;
