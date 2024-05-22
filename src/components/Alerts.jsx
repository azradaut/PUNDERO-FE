import React from 'react';
import { Alert, Snackbar } from '@mui/material';

function Alerts({ open, message, severity, onClose }) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Alerts;
