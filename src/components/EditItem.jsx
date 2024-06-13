import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function EditItem({ item, onSave, onClose, fields }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false); // Add this state to prevent multiple calls
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (item && !isInitialized) {
      setFormData(item);
      setIsInitialized(true);
      console.log("EditItem - formData set: ", item);
    }
  }, [item, isInitialized]);

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
    if (isSaving) return; // Prevent multiple calls
    setIsSaving(true);
    console.log("EditItem - handleSave called");
    try {
      await onSave(formData);
      console.log("EditItem - onSave completed");
      onClose(); // Ensure the dialog is closed after successful save
    } catch (error) {
      console.log("EditItem - error: ", error);
      if (error && error.data) {
        const validationErrors = error.data.errors || {};
        setErrors(validationErrors);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  const handleDialogClose = () => {
    console.log("EditItem - handleDialogClose called");
    onClose();
  };

  return (
    <Dialog open={true} onClose={handleDialogClose}>
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            value={formData[field.name] || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors[field.name]}
            helperText={errors[field.name] ? errors[field.name][0] : ''}
            type={field.type || 'text'}
            InputLabelProps={{ shrink: true }}
            placeholder={field.placeholder || ''}
          />
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
