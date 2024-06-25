import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

function ViewItemPopup({ item, onClose }) {
  if (!item) {
    return null; 
  }

  // fields we will not include
  const fieldsToExclude = ['mobileDrivers'];

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>View Item</DialogTitle>
      <DialogContent>
        {Object.keys(item)
          .filter((key) => !fieldsToExclude.includes(key))
          .map((key) => (
            <TextField
              key={key}
              label={
                key === 'clientName' ? 'Client Name' :
                key === 'idWarehouseNavigation' ? 'Warehouse' :
                key.charAt(0).toUpperCase() + key.slice(1)
              }
              value={
                key === 'idWarehouseNavigation' && item[key]
                  ? item[key].nameWarehouse
                  : item[key]
              }
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
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewItemPopup;
