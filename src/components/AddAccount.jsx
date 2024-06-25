
import React, { useState, useEffect } from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Alerts from './Alerts';

const AddAccount = ({ accountType, onClose, onAccountAdded, additionalFields = [] }) => {
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({});
    const [image, setImage] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        const initialFormValues = {};
        additionalFields.forEach(field => {
            initialFormValues[field.name] = '';
        });
        if (accountType === 'driver') {
            initialFormValues.licenseNumber = '';
            initialFormValues.licenseCategory = '';
            initialFormValues.tachographLabel = '';
            initialFormValues.tachographIssueDate = '';
            initialFormValues.tachographExpiryDate = '';
        }
        setFormValues(initialFormValues);
    }, [additionalFields, accountType]);

    const handleDrop = (acceptedFiles) => {
        setImage(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/*',
    });

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
        setErrors({ ...errors, [name]: validateField(name, value) });
    };

    const handleSubmit = async () => {
        const newErrors = {};
        ['firstName', 'lastName', 'email', 'password'].forEach(field => {
            const error = validateField(field, formValues[field] || '');
            if (error) {
                newErrors[field] = error;
            }
        });

        additionalFields.forEach(field => {
            const error = validateField(field.name, formValues[field.name] || '');
            if (error) {
                newErrors[field.name] = error;
            }
        });

        if (accountType === 'driver') {
            ['licenseNumber', 'licenseCategory', 'tachographLabel', 'tachographIssueDate', 'tachographExpiryDate'].forEach(field => {
                const error = validateField(field, formValues[field] || '');
                if (error) {
                    newErrors[field] = error;
                }
            });
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setAlertMessage('Please fill in all required fields.');
            setAlertSeverity('error');
            setAlertOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('firstName', formValues.firstName);
        formData.append('lastName', formValues.lastName);
        formData.append('email', formValues.email);
        formData.append('password', formValues.password);
        formData.append('type', accountType);

        additionalFields.forEach(field => {
            formData.append(field.name, formValues[field.name]);
        });

        if (accountType === 'driver') {
            formData.append('licenseNumber', formValues.licenseNumber);
            formData.append('licenseCategory', formValues.licenseCategory);
            formData.append('tachographLabel', formValues.tachographLabel);
            formData.append('tachographIssueDate', formValues.tachographIssueDate);
            formData.append('tachographExpiryDate', formValues.tachographExpiryDate);
        }

        if (image) {
            formData.append('imageFile', image);
        }

        try {
            await axios.post(`http://localhost:8515/api/${accountType}/Add${accountType}`, formData);
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
                    value={formValues.firstName || ''}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formValues.lastName || ''}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={formValues.email || ''}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formValues.password || ''}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    error={!!errors.password}
                    helperText={errors.password}
                />
                {additionalFields.map(field => (
                    <TextField
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        value={formValues[field.name] || ''}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        required
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                    />
                ))}
                {accountType === 'driver' && (
                    <>
                        <TextField
                            label="License Number"
                            name="licenseNumber"
                            value={formValues.licenseNumber || ''}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.licenseNumber}
                            helperText={errors.licenseNumber}
                        />
                        <TextField
                            label="License Category"
                            name="licenseCategory"
                            value={formValues.licenseCategory || ''}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.licenseCategory}
                            helperText={errors.licenseCategory}
                        />
                        <TextField
                            label="Tachograph Label"
                            name="tachographLabel"
                            value={formValues.tachographLabel || ''}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.tachographLabel}
                            helperText={errors.tachographLabel}
                        />
                        <TextField
                            label="Tachograph Issue Date"
                            name="tachographIssueDate"
                            value={formValues.tachographIssueDate || ''}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.tachographIssueDate}
                            helperText={errors.tachographIssueDate}
                        />
                        <TextField
                            label="Tachograph Expiry Date"
                            name="tachographExpiryDate"
                            value={formValues.tachographExpiryDate || ''}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            required
                            error={!!errors.tachographExpiryDate}
                            helperText={errors.tachographExpiryDate}
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
