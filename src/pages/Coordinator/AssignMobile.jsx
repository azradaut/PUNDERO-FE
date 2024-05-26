import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import axios from 'axios';
import AddMobileAssignment from '../../components/AddMobileAssignment';
import EditMobileAssignment from '../../components/EditMobileAssignment';

const AssignMobile = () => {
    const [assignments, setAssignments] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [mobiles, setMobiles] = useState([]);
    const [assignmentTypes, setAssignmentTypes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editAssignment, setEditAssignment] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assignmentsResponse, driversResponse, mobilesResponse, assignmentTypesResponse] = await Promise.all([
                axios.get('http://localhost:8515/api/MobileDriver/GetAssignments'),
                axios.get('http://localhost:8515/api/MobileDriver/GetDriversWithName'),
                axios.get('http://localhost:8515/api/MobileDriver/GetUnassignedMobiles'),
                axios.get('http://localhost:8515/api/MobileDriver/GetAssignmentTypes')
            ]);

            setAssignments(assignmentsResponse.data);
            setDrivers(driversResponse.data);
            setMobiles(mobilesResponse.data);
            setAssignmentTypes(assignmentTypesResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearchChange = (event) => {
        const newSearchText = event.target.value;
        setSearchText(newSearchText);
        const filteredResult = assignments.filter((assignment) => {
            return Object.values(assignment).some((value) =>
                typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
            );
        });
        setAssignments(filteredResult);
    };

    const handleAddAssignment = async (formData) => {
        try {
            const response = await axios.post('http://localhost:8515/api/MobileDriver/AddAssignment', formData);
            if (response.status === 200) {
                fetchData();
                setShowAddDialog(false);
            }
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    const handleEditAssignment = async (id, formData) => {
        try {
            const response = await axios.put(`http://localhost:8515/api/MobileDriver/EditAssignment/${id}`, formData);
            if (response.status === 200) {
                fetchData();
                setEditAssignment(null);
            }
        } catch (error) {
            console.error('Error editing assignment:', error);
        }
    };

    const handleDeleteAssignment = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8515/api/MobileDriver/DeleteAssignment/${id}`);
            if (response.status === 200) {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting assignment:', error);
        }
    };

    return (
        <div>
            <h2>Assign Mobile Phones</h2>
            <TextField
                label="Search"
                value={searchText}
                onChange={handleSearchChange}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={() => setShowAddDialog(true)}>
                Add
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Driver Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Assignment Start Date</TableCell>
                            <TableCell>Assignment End Date</TableCell>
                            <TableCell>Assignment Type</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignments.map((assignment) => (
                            <TableRow key={assignment.idMobileDriver}>
                                <TableCell>{assignment.driverName}</TableCell>
                                <TableCell>{assignment.phoneNumber}</TableCell>
                                <TableCell>{new Date(assignment.assignmentStartDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(assignment.assignmentEndDate).toLocaleDateString()}</TableCell>
                                <TableCell>{assignment.assignmentType}</TableCell>
                                <TableCell>
                                    <Button onClick={() => setEditAssignment(assignment)}>Edit</Button>
                                    <Button onClick={() => handleDeleteAssignment(assignment.idMobileDriver)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {showAddDialog && (
                <AddMobileAssignment
                    onAdd={handleAddAssignment}
                    onClose={() => setShowAddDialog(false)}
                    drivers={drivers}
                    mobiles={mobiles}
                    assignmentTypes={assignmentTypes}
                />
            )}
            {editAssignment && (
                <EditMobileAssignment
                    assignment={editAssignment}
                    onSave={handleEditAssignment}
                    onClose={() => setEditAssignment(null)}
                    drivers={drivers}
                    mobiles={mobiles}
                    assignmentTypes={assignmentTypes}
                />
            )}
        </div>
    );
};

export default AssignMobile;
