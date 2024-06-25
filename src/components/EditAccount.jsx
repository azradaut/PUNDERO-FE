import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Alerts from './Alerts';

const EditAccount = ({ accountType, accountId, onAccountUpdated, onClose, additionalFields }) => {
    const [accountData, setAccountData] = useState({});
    const [stores, setStores] = useState([]);
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    const [errors, setErrors] = useState({});

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
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const validateField = (name, value) => {
        let error = '';
        if (name === 'email') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                error = 'Invalid email format, expected format: example@pundero.ba';
            }
        } else if (name === 'password') {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,20}$/;
            if (!passwordPattern.test(value)) {
                error = 'Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character';
            }
        } else if (name === 'qualification') {
            if (value.length > 50) {
                error = 'Qualification can have up to 50 characters';
            }
        } else if (name === 'description') {
            if (value.length > 200) {
                error = 'Description can have up to 200 characters';
            }
        } else if (name === 'licenseNumber' || name === 'tachographLabel') {
            if (value.length > 20) {
                error = `${name.replace(/([A-Z])/g, ' $1').trim()} can have up to 20 characters`;
            }
        } else if (name === 'licenseCategory') {
            if (value.length > 2) {
                error = 'License Category can have up to 2 characters';
            }
        } else if (name === 'tachographIssueDate' || name === 'tachographExpiryDate') {
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            if (!datePattern.test(value)) {
                error = 'Date format must be YYYY-MM-DD';
            }
        } else {
            if (value.trim() === '') {
                error = `${name.replace(/([A-Z])/g, ' $1').trim()} is required`;
            }
        }
        return error;
    };

    const handleSubmit = async () => {
        const newErrors = {};
        ['firstName', 'lastName', 'email', 'password'].forEach(field => {
            const error = validateField(field, accountData[field] || '');
            if (error) {
                newErrors[field] = error;
            }
        });

        additionalFields.forEach(field => {
            const error = validateField(field.name, accountData[field.name] || '');
            if (error) {
                newErrors[field.name] = error;
            }
        });

        if (accountType === 'Driver') {
            ['licenseNumber', 'licenseCategory', 'tachographLabel', 'tachographIssueDate', 'tachographExpiryDate'].forEach(field => {
                const error = validateField(field, accountData[field] || '');
                if (error) {
                    newErrors[field] = error;
                }
            });
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlert({ open: true, message: 'Please fill in all required fields.', severity: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('FirstName', accountData.firstName);
        formData.append('LastName', accountData.lastName);
        formData.append('Email', accountData.email);
        if (accountData.password) {
            formData.append('Password', accountData.password);
        }

        additionalFields.forEach(field => {
            formData.append(field.name, accountData[field.name]);
        });

        if (accountType === 'Driver') {
            formData.append('LicenseNumber', accountData.licenseNumber);
            formData.append('LicenseCategory', accountData.licenseCategory);
            formData.append('TachographLabel', accountData.tachographLabel);
            formData.append('TachographIssueDate', accountData.tachographIssueDate);
            formData.append('TachographExpiryDate', accountData.tachographExpiryDate);
        }

        if (accountData.ImageFile) {
            formData.append('ImageFile', accountData.ImageFile);
        }

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
                required
                error={!!errors.firstName}
                helperText={errors.firstName}
            />
            <TextField
                label="Last Name"
                name="lastName"
                value={accountData.lastName || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.lastName}
                helperText={errors.lastName}
            />
            <TextField
                label="Email"
                name="email"
                value={accountData.email || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.email}
                helperText={errors.email}
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={accountData.password || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
            />
            {additionalFields.map(field => (
                <TextField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={accountData[field.name] || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors[field.name]}
                    helperText={errors[field.name]}
                />
            ))}
            {accountType === 'Driver' && (
                <>
                    <TextField
                        label="License Number"
                        name="licenseNumber"
                        value={accountData.licenseNumber || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.licenseNumber}
                        helperText={errors.licenseNumber}
                    />
                    <TextField
                        label="License Category"
                        name="licenseCategory"
                        value={accountData.licenseCategory || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.licenseCategory}
                        helperText={errors.licenseCategory}
                    />
                    <TextField
                        label="Tachograph Label"
                        name="tachographLabel"
                        value={accountData.tachographLabel || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.tachographLabel}
                        helperText={errors.tachographLabel}
                    />
                    <TextField
                        label="Tachograph Issue Date"
                        name="tachographIssueDate"
                        type="date"
                        value={accountData.tachographIssueDate || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.tachographIssueDate}
                        helperText={errors.tachographIssueDate}
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
                        required
                        error={!!errors.tachographExpiryDate}
                        helperText={errors.tachographExpiryDate}
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
                        required
                        error={!!errors.qualification}
                        helperText={errors.qualification}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={accountData.description || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.description}
                        helperText={errors.description}
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
