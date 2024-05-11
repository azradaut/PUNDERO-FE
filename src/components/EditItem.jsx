import React, { useState } from 'react';
import { Button, TextField, DialogActions } from '@mui/material';

function EditItem({ item, fields, onSave, onCancel }) {
  const [editedItem, setEditedItem] = useState({ ...item }); // Initialize editedItem state with the item data

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({ ...editedItem, [name]: value }); // Update the editedItem state with the changed field value
  };

  const handleSave = () => {
    onSave(editedItem); // Call the onSave function passed from the parent component (Vehicles)
  };

  return (
    <div>
      <h2>Edit Item</h2>
      {fields.map((field) => (
        <TextField
          key={field}
          name={field}
          label={field}
          value={editedItem[field] || ''} // Set the value from the editedItem state
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      ))}
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </div>
  );
}

export default EditItem;
