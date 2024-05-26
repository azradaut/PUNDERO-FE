import React, { useState, useEffect } from 'react';
import { DialogContent, TextField, MenuItem, Button } from '@mui/material';
import axios from 'axios';

const MobileAssignmentForm = ({ assignment, onSave, onClose }) => {
    const [formData, setFormData] = useState(assignment || {});
    const [drivers, setDrivers] = useState([]);
    const [mobiles, setMobiles] = useState([]);
    const [assignmentTypes, setAssignmentTypes] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDrivers();
        fetchMobiles();
        fetchAssignmentTypes();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:8515/api/Driver/GetDriversWithName');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const fetchMobiles = async () => {
        try {
            const response = await axios.get('http://localhost:8515/api/Mobile/GetUnassignedMobiles');
            setMobiles(response.data);
        } catch (error) {
            console.error('Error fetching mobiles:', error);
        }
    };

    const fetchAssignmentTypes = async () => {
        try {
            const response = await axios.get('http://localhost:8515/api/AssignmentType/GetAssignmentTypes');
            setAssignmentTypes(response.data);
        } catch (error) {
            console.error('Error fetching assignment types:', error);
        }
    };

    const validateField = (name, value) => {
        let error = "";
        if (!value) {
            error = `${name} is required`;
        }
        return error;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const error = validateField(name, value);
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: error });
    };

    const handleConfirm = async () => {
        setErrors({});
        const newErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await onSave(formData.idMobileDriver, formData);
        onClose();
    };

    return (
        <DialogContent>
            <TextField
                select
                label="Driver"
                name="driverName"
                value={formData.driverName || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.driverName}
                helperText={errors.driverName}
            >
                {drivers.map(driver => (
                    <MenuItem key={driver.idDriver} value={`${driver.firstName} ${driver.lastName}`}>
                        {`${driver.firstName} ${driver.lastName}`}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Mobile Number"
                name="mobilePhoneNumber"
                value={formData.mobilePhoneNumber || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.mobilePhoneNumber}
                helperText={errors.mobilePhoneNumber}
            >
                {mobiles.map(mobile => (
                    <MenuItem key={mobile.idMobile} value={mobile.phoneNumber}>
                        {mobile.phoneNumber}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Assignment Type"
                name="assignmentType"
                value={formData.assignmentType || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.assignmentType}
                helperText={errors.assignmentType}
            >
                {assignmentTypes.map(type => (
                    <MenuItem key={type.idAssignmentType} value={type.description}>
                        {type.description}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Start Date"
                type="date"
                name="assignmentStartDate"
                value={formData.assignmentStartDate || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.assignmentStartDate}
                helperText={errors.assignmentStartDate}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="End Date"
                type="date"
                name="assignmentEndDate"
                value={formData.assignmentEndDate || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.assignmentEndDate}
                helperText={errors.assignmentEndDate}
                InputLabelProps={{ shrink: true }}
            />
            <Button onClick={handleConfirm} variant="contained" color="primary">Confirm</Button>
            <Button onClick={onClose}>Cancel</Button>
        </DialogContent>
    );
};

export default MobileAssignmentForm;
