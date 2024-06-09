import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const EditAccount = ({ accountType, accountId, onAccountUpdated, additionalFields }) => {
    const [accountData, setAccountData] = useState({});
    const [stores, setStores] = useState([]);

    useEffect(() => {
        fetchAccountData();
        fetchStores();
    }, []);

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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setAccountData({ ...accountData, ImageFile: file });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('FirstName', accountData.FirstName);
        formData.append('LastName', accountData.LastName);
        formData.append('Email', accountData.Email);
        formData.append('Password', accountData.Password);

        if (accountData.ImageFile) {
            formData.append('ImageFile', accountData.ImageFile);
        }

        additionalFields.forEach(field => {
            formData.append(field.name, accountData[field.name]);
        });

        try {
            console.log(`Sending request to: http://localhost:8515/api/${accountType}/Update${accountType}/${accountId}`); // Added logging
            await axios.put(`http://localhost:8515/api/${accountType}/Update${accountType}/${accountId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onAccountUpdated();
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    return (
        <div>
            <TextField label="First Name" value={accountData.FirstName || ''} onChange={(e) => setAccountData({ ...accountData, FirstName: e.target.value })} fullWidth margin="normal" />
            <TextField label="Last Name" value={accountData.LastName || ''} onChange={(e) => setAccountData({ ...accountData, LastName: e.target.value })} fullWidth margin="normal" />
            <TextField label="Email" value={accountData.Email || ''} onChange={(e) => setAccountData({ ...accountData, Email: e.target.value })} fullWidth margin="normal" />
            <TextField label="Password" type="password" value={accountData.Password || ''} onChange={(e) => setAccountData({ ...accountData, Password: e.target.value })} fullWidth margin="normal" />

            {additionalFields.map(field => (
                <TextField
                    key={field.name}
                    label={field.label}
                    value={accountData[field.name] || ''}
                    onChange={(e) => setAccountData({ ...accountData, [field.name]: e.target.value })}
                    fullWidth
                    margin="normal"
                />
            ))}

            <FormControl fullWidth margin="normal">
                <InputLabel>Store</InputLabel>
                <Select
                    value={accountData.store || ''}
                    onChange={(e) => setAccountData({ ...accountData, store: e.target.value })}
                >
                    {stores.map(store => (
                        <MenuItem key={store.idStore} value={store.name}>
                            {store.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden onChange={handleImageUpload} />
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                Update {accountType}
            </Button>
        </div>
    );
};

export default EditAccount;
