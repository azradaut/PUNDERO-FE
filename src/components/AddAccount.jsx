import React, { useState, useEffect } from 'react';
import { DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Alerts from './Alerts';

const AddAccount = ({ accountType, onClose, onAccountAdded, additionalFields = [] }) => {
    const [formValues, setFormValues] = useState({});
    const [image, setImage] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    useEffect(() => {
        const initialFormValues = {};
        additionalFields.forEach(field => {
            initialFormValues[field.name] = '';
        });
        setFormValues(initialFormValues);
    }, [additionalFields]);

    const handleDrop = (acceptedFiles) => {
        setImage(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/*',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formValues.firstName || !formValues.lastName || !formValues.email || !formValues.password) {
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
                    />
                ))}
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
