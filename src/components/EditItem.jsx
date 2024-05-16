// EditItem.jsx

import React, { useState } from 'react';
import { Button, TextField, DialogActions } from '@mui/material';

function EditItem({ item, fields, onSave, onCancel }) {
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({ ...editedItem, [name]: value });
  };

  const handleSave = () => {
    onSave(editedItem);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <h2>Edit Item</h2>
      {fields.map((field) => (
        <TextField
          key={field}
          name={field}
          label={field}
          value={editedItem[field] || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      ))}
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </div>
  );
}

export default EditItem;
