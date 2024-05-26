import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';

function AddMobileAssignment({ onAdd, onClose, drivers, mobiles, assignmentTypes }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirm = () => {
        const newErrors = {};
        ['driverName', 'mobilePhoneNumber', 'assignmentType', 'assignmentStartDate', 'assignmentEndDate'].forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onAdd(formData);
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Add Mobile Assignment</DialogTitle>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm} variant="contained" color="primary">Add</Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddMobileAssignment;
