import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Alerts from './Alerts';

const EditAccount = ({ accountType, accountId, onAccountUpdated, onClose, additionalFields }) => {
    const [accountData, setAccountData] = useState({});
    const [stores, setStores] = useState([]);
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });

    useEffect(() => {
        fetchAccountData();
        if (accountType === 'Client') {
            fetchStores();
        }
    }, [accountType]);

    const fetchAccountData = async () => {
        try {
            const response = await axios.get(`http://localhost:8515/api/${accountType}/Get${accountType}ByIdAccount/${accountId}`);
            setAccountData(response.data);
        } catch (error) {
            console.error('Error fetching account data:', error);
        }
    };

    const fetchStores = async () => {
        try {
            const response = await axios.get('http://localhost:8515/api/Stores/GetStores');
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const handleImageUpload = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setAccountData({ ...accountData, ImageFile: file });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleImageUpload,
        accept: 'image/*'
    });

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('FirstName', accountData.firstName);
        formData.append('LastName', accountData.lastName);
        formData.append('Email', accountData.email);
        formData.append('Password', accountData.password);

        if (accountData.ImageFile) {
            formData.append('ImageFile', accountData.ImageFile);
        }

        additionalFields.forEach(field => {
            formData.append(field.name, accountData[field.name]);
        });

        try {
            console.log('Form data being sent:', Array.from(formData.entries()));
            await axios.put(`http://localhost:8515/api/${accountType}/Update${accountType}/${accountId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAlert({ open: true, message: 'Account updated successfully', severity: 'success' });
            onAccountUpdated();
        } catch (error) {
            console.error('Error updating account:', error);
            console.log('Response data:', error.response.data);
            setAlert({ open: true, message: 'Error updating account', severity: 'error' });
        }
    };

    return (
        <div>
            <TextField label="First Name" value={accountData.firstName || ''} onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })} fullWidth margin="normal" />
            <TextField label="Last Name" value={accountData.lastName || ''} onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })} fullWidth margin="normal" />
            <TextField label="Email" value={accountData.email || ''} onChange={(e) => setAccountData({ ...accountData, email: e.target.value })} fullWidth margin="normal" />

            {accountType === 'Client' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel>Store</InputLabel>
                    <Select
                        value={accountData.store || ''}
                        onChange={(e) => setAccountData({ ...accountData, store: e.target.value })}
                    >
                        {stores.map((store) => (
                            <MenuItem key={store.idStore} value={store.name}>
                                {store.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {accountType === 'Driver' && (
                <>
                    <TextField
                        label="License Number"
                        value={accountData.licenseNumber || ''}
                        onChange={(e) => setAccountData({ ...accountData, licenseNumber: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="License Category"
                        value={accountData.licenseCategory || ''}
                        onChange={(e) => setAccountData({ ...accountData, licenseCategory: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Tachograph Label"
                        value={accountData.tachographLabel || ''}
                        onChange={(e) => setAccountData({ ...accountData, tachographLabel: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Tachograph Issue Date"
                        type="date"
                        value={accountData.tachographIssueDate || ''}
                        onChange={(e) => setAccountData({ ...accountData, tachographIssueDate: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Tachograph Expiry Date"
                        type="date"
                        value={accountData.tachographExpiryDate || ''}
                        onChange={(e) => setAccountData({ ...accountData, tachographExpiryDate: e.target.value })}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                </>
            )}

            <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop an image here, or click to select one</p>
                )}
                {accountData.image && <img src={`http://localhost:8515${accountData.image}`} alt="Profile" style={{ marginTop: '20px', maxWidth: '200px' }} />}
                {accountData.ImageFile && <p>{accountData.ImageFile.name}</p>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Confirm
                </Button>
                <Button onClick={onClose} variant="outlined" color="primary">
                    Cancel
                </Button>
            </div>

            <Alerts open={alert.open} message={alert.message} severity={alert.severity} onClose={() => setAlert({ open: false, message: '', severity: '' })} />
        </div>
    );
};

export default EditAccount;
