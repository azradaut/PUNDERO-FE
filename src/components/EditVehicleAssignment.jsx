import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';

const EditVehicleAssignment = ({ assignment, onSave, onClose, drivers, vehicles, assignmentTypes }) => {
    const [formData, setFormData] = useState({ ...assignment });
    const [errors, setErrors] = useState({});

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

        await onSave(formData.IdVehicleDriver, formData);
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Edit Vehicle Assignment</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Driver"
                    name="IdDriver"
                    value={formData.IdDriver || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.IdDriver}
                    helperText={errors.IdDriver}
                >
                    {drivers.map(driver => (
                        <MenuItem key={driver.IdDriver} value={driver.IdDriver}>
                            {`${driver.FirstName} ${driver.LastName}`}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Vehicle Registration"
                    name="IdVehicle"
                    value={formData.IdVehicle || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.IdVehicle}
                    helperText={errors.IdVehicle}
                >
                    {vehicles.map(vehicle => (
                        <MenuItem key={vehicle.IdVehicle} value={vehicle.IdVehicle}>
                            {vehicle.Registration}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Assignment Type"
                    name="IdAssignmentType"
                    value={formData.IdAssignmentType || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.IdAssignmentType}
                    helperText={errors.IdAssignmentType}
                >
                    {assignmentTypes.map(type => (
                        <MenuItem key={type.IdAssignmentType} value={type.IdAssignmentType}>
                            {type.Description}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Start Date"
                    type="date"
                    name="AssignmentStartDate"
                    value={formData.AssignmentStartDate || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.AssignmentStartDate}
                    helperText={errors.AssignmentStartDate}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    name="AssignmentEndDate"
                    value={formData.AssignmentEndDate || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={!!errors.AssignmentEndDate}
                    helperText={errors.AssignmentEndDate}
                    InputLabelProps={{ shrink: true }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleConfirm} variant="contained" color="primary">Confirm</Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditVehicleAssignment;
