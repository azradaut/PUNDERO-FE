import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';

function ViewAccount({ accountId, accountType, onClose }) {
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    fetchAccountData();
  }, [accountId, accountType]);

  const fetchAccountData = async () => {
    try {
      const response = await axios.get(`http://localhost:8515/api/${accountType}/Get${accountType}ByIdAccount/${accountId}`);
      setAccountData(response.data);
    } catch (error) {
      console.error(`Error fetching ${accountType.toLowerCase()} data:`, error);
    }
  };

  if (!accountData) {
    return null;
  }

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>View {accountType}</DialogTitle>
      <DialogContent>
        <TextField
          label="ID"
          value={accountType === 'Client' ? accountData.idClient : accountData.idDriver}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="First Name"
          value={accountData.firstName}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={accountData.lastName}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="Email"
          value={accountData.email}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          variant="outlined"
          margin="normal"
        />
        {accountType === 'Client' && (
          <>
            <TextField
              label="Type"
              value="Client"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Store"
              value={accountData.store}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </>
        )}
        {accountType === 'Driver' && (
          <>
            <TextField
              label="License Number"
              value={accountData.licenseNumber}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="License Category"
              value={accountData.licenseCategory}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Tachograph Label"
              value={accountData.tachographLabel}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Tachograph Issue Date"
              value={accountData.tachographIssueDate}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Tachograph Expiry Date"
              value={accountData.tachographExpiryDate}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Type"
              value="Driver"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              margin="normal"
            />
          </>
        )}
        {accountData.image && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <img src={`http://localhost:8515${accountData.image}`} alt="Profile" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewAccount;
