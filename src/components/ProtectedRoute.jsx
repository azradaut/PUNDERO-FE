import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    return (
        token && userRole && parseInt(userRole, 10) === role
            ? children
            : <Navigate to="/" />
    );
};

export default ProtectedRoute;
