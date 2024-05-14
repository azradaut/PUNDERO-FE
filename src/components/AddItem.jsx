import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function AddItem({ onAdd, onClose, categoryAttributes }) {
  // Exclude 'id' attribute from categoryAttributes
  const attributesWithoutId = categoryAttributes.filter(attr => attr !== 'id');

  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirm = () => {
    // Call the onAdd function with the form data
    onAdd(formData);
    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add Item</DialogTitle>
      <DialogContent>
        {attributesWithoutId.map(attribute => (
          <TextField
            key={attribute}
            name={attribute}
            label={attribute}
            value={formData[attribute] || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
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