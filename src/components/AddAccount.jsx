import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const AddAccount = ({ accountType, onAccountAdded, additionalFields }) => {
    const [accountData, setAccountData] = useState({});

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setAccountData({ ...accountData, image: file });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('firstName', accountData.firstName);
        formData.append('lastName', accountData.lastName);
        formData.append('email', accountData.email);
        formData.append('password', accountData.password);

        if (accountData.image) {
            formData.append('image', accountData.image, `${accountType}${new Date().getTime()}.jpg`);
        }

        additionalFields.forEach(field => {
            formData.append(field.name, accountData[field.name]);
        });

        try {
            await axios.post(`http://localhost:8515/api/${accountType}/Add${accountType}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            onAccountAdded();
        } catch (error) {
            console.error('Error adding account:', error);
        }
    };

    return (
        <div>
            <TextField label="First Name" value={accountData.firstName || ''} onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })} fullWidth margin="normal" />
            <TextField label="Last Name" value={accountData.lastName || ''} onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })} fullWidth margin="normal" />
            <TextField label="Email" value={accountData.email || ''} onChange={(e) => setAccountData({ ...accountData, email: e.target.value })} fullWidth margin="normal" />
            <TextField label="Password" type="password" value={accountData.password || ''} onChange={(e) => setAccountData({ ...accountData, password: e.target.value })} fullWidth margin="normal" />

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

            <Button variant="contained" component="label">
                Upload Image
                <input type="file" hidden onChange={handleImageUpload} />
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                Add {accountType}
            </Button>
        </div>
    );
};

export default AddAccount;
