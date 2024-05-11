import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

function ViewItemPopup({ item, onClose, onDelete }) {
  const handleDeleteClick = () => {
    // Call onDelete with the item for deletion
    onDelete(item);
    onClose(); // Close the popup after deletion
  };

  if (!item) {
    return null; // Return null if item is undefined or null
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>View Item</DialogTitle>
      <DialogContent>
        {Object.keys(item).map((key) => (
          <TextField
            key={key}
            label={key}
            value={item[key]}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            margin="normal"
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteClick} variant="contained" color="error">
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewItemPopup;
