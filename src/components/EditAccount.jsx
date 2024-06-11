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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccountData({ ...accountData, [name]: value });
    };

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
            await axios.put(`http://localhost:8515/api/${accountType}/Update${accountType}/${accountId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAlert({ open: true, message: 'Account updated successfully', severity: 'success' });
            onAccountUpdated();
        } catch (error) {
            console.error('Error updating account:', error);
            setAlert({ open: true, message: 'Error updating account', severity: 'error' });
        }
    };

    return (
        <div>
            <TextField
                label="First Name"
                name="firstName"
                value={accountData.firstName || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Last Name"
                name="lastName"
                value={accountData.lastName || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                value={accountData.email || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={accountData.password || ''}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        {accountType === 'Client' && (
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Store</InputLabel>
                                <Select
                                    name="store"
                                    value={accountData.store || ''}
                                    onChange={handleChange}
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
                                    name="licenseNumber"
                                    value={accountData.licenseNumber || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="License Category"
                                    name="licenseCategory"
                                    value={accountData.licenseCategory || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Tachograph Label"
                                    name="tachographLabel"
                                    value={accountData.tachographLabel || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Tachograph Issue Date"
                                    name="tachographIssueDate"
                                    type="date"
                                    value={accountData.tachographIssueDate || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Tachograph Expiry Date"
                                    name="tachographExpiryDate"
                                    type="date"
                                    value={accountData.tachographExpiryDate || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </>
                        )}
                        {accountType === 'Coordinator' && (
                            <>
                                <TextField
                                    label="Qualification"
                                    name="qualification"
                                    value={accountData.qualification || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Description"
                                    name="description"
                                    value={accountData.description || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
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
            
            


