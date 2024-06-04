import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';

const AddMobileAssignment = ({ onAdd, onClose, drivers, mobiles, assignmentTypes }) => {
    const [driverId, setDriverId] = useState('');
    const [mobileId, setMobileId] = useState('');
    const [assignmentTypeId, setAssignmentTypeId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = () => {
        const formData = {
            IdDriver: parseInt(driverId, 10),
            IdMobile: parseInt(mobileId, 10),
            IdAssignmentType: parseInt(assignmentTypeId, 10),
            AssignmentStartDate: startDate,
            AssignmentEndDate: endDate || "0000-00-00", // Use default value if not provided
            Note: note,
        };
        onAdd(formData);
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>Add Mobile Assignment</DialogTitle>
            <DialogContent>
                <TextField
                    label="Driver"
                    select
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {drivers.map((driver) => (
                        <MenuItem key={driver.idDriver} value={driver.idDriver}>
                            {driver.fullName}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Mobile Phone"
                    select
                    value={mobileId}
                    onChange={(e) => setMobileId(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {mobiles.map((mobile) => (
                        <MenuItem key={mobile.idMobile} value={mobile.idMobile}>
                            {mobile.phoneNumber}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Assignment Type"
                    select
                    value={assignmentTypeId}
                    onChange={(e) => setAssignmentTypeId(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {assignmentTypes.map((type) => (
                        <MenuItem key={type.idAssignmentType} value={type.idAssignmentType}>
                            {type.description}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMobileAssignment;
