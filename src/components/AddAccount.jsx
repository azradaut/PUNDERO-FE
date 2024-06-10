import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Alerts from './Alerts';

const AddAccount = ({ accountType, onClose, onAccountAdded }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        store: '',
        licenseNumber: '',
        licenseCategory: '',
        tachographLabel: '',
        tachographIssueDate: '',
        tachographExpiryDate: ''
    });
    const [image, setImage] = useState(null);
    const [stores, setStores] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        if (accountType === 'Client') {
            fetchStores();
        }
    }, [accountType]);

    const fetchStores = async () => {
        try {
            const response = await axios.get('http://localhost:8515/api/Stores/GetStores');
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const handleDrop = (acceptedFiles) => {
        setImage(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/*',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setAlertMessage('Please fill in all required fields.');
            setAlertSeverity('error');
            setAlertOpen(true);
            return;
        }

        const form = new FormData();
        form.append('firstName', formData.firstName);
        form.append('lastName', formData.lastName);
        form.append('email', formData.email);
        form.append('password', formData.password);
        form.append('type', accountType);
        if (accountType === 'Client') {
            form.append('store', formData.store);
        } else if (accountType === 'Driver') {
            form.append('licenseNumber', formData.licenseNumber);
            form.append('licenseCategory', formData.licenseCategory);
            form.append('tachographLabel', formData.tachographLabel);
            form.append('tachographIssueDate', formData.tachographIssueDate);
            form.append('tachographExpiryDate', formData.tachographExpiryDate);
        }
        if (image) {
            form.append('imageFile', image);
        }

        try {
            await axios.post(`http://localhost:8515/api/${accountType}/Add${accountType}`, form);
            onAccountAdded();
        } catch (error) {
            console.error(`Error adding ${accountType.toLowerCase()}:`, error);
            setAlertMessage(`Error adding ${accountType.toLowerCase()}.`);
            setAlertSeverity('error');
            setAlertOpen(true);
        }
    };

    return (
        <div>
            <DialogTitle>Add {accountType}</DialogTitle>
            <DialogContent>
                <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                />
                {accountType === 'Client' && (
                    <TextField
                        label="Store"
                        select
                        name="store"
                        value={formData.store}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        required
                    >
                        {stores.map((store) => (
                            <MenuItem key={store.idStore} value={store.name}>
                                {store.name}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                {accountType === 'Driver' && (
                    <>
                        <TextField
                            label="License Number"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="License Category"
                            name="licenseCategory"
                            value={formData.licenseCategory}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Tachograph Label"
                            name="tachographLabel"
                            value={formData.tachographLabel}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Tachograph Issue Date"
                            type="date"
                            name="tachographIssueDate"
                            value={formData.tachographIssueDate}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                        />
                        <TextField
                            label="Tachograph Expiry Date"
                            type="date"
                            name="tachographExpiryDate"
                            value={formData.tachographExpiryDate}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                        />
                    </>
                )}
                <div {...getRootProps({ className: 'dropzone' })} style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
                    <input {...getInputProps()} />
                    {image ? (
                        <img src={URL.createObjectURL(image)} alt="Preview" style={{ maxWidth: '100%', height: 'auto' }} />
                    ) : (
                        <p>Drag 'n' drop an image here, or click to select one</p>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Add</Button>
            </DialogActions>
            <Alerts
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={() => setAlertOpen(false)}
            />
        </div>
    );
};

export default AddAccount;
