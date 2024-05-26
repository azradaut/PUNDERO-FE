import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemText, Badge, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotification } from '../contexts/NotificationContext';
import NotificationPopup from '../pages/NotificationPopup';
import axios from 'axios';

const CoordinatorNavbar = () => {
    const [open, setOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { notifications, setNotifications } = useNotification();
    const unseenCount = notifications.filter(notification => !notification.seen).length;
    const firstName = localStorage.getItem('firstName');
    const navigate = useNavigate();

    const handleMarkAsSeen = async (id) => {
        try {
            await axios.put(`http://localhost:8515/api/Notification/${id}/markAsSeen`);
            setNotifications(prev => prev.filter(n => n.idNotification !== id));
        } catch (error) {
            console.error('Error marking notification as seen:', error);
        }
    };

    const handleViewNotification = (notification) => {
        handleMarkAsSeen(notification.idNotification);
        if (notification.message.includes('pending approval')) {
            navigate('/coordinator/pending-invoices');
        } else if (notification.message.includes('completed') || notification.message.includes('failed')) {
            navigate('/coordinator/invoices');
        }
    };

    const drawerContent = (
        <div>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    PUNDERO
                </Typography>
                <IconButton onClick={() => setOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List>
                <ListItem button component={Link} to="/coordinator/dashboard">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/accounts">
                    <ListItemText primary="Accounts" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/vehicles">
                    <ListItemText primary="Vehicles" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/coordinators">
                    <ListItemText primary="Coordinators" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/clients">
                    <ListItemText primary="Clients" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/drivers">
                    <ListItemText primary="Drivers" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/assignmobile">
                    <ListItemText primary="AssignMobile" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/assignvehicle">
                    <ListItemText primary="Assign Vehicle" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/map">
                    <ListItemText primary="Map" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/invoices">
                    <ListItemText primary="Invoices" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/pending-invoices">
                    <ListItemText primary="Pending Invoices" />
                </ListItem>
                <ListItem button component={Link} to="/">
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={() => setOpen(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    PUNDERO
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 0 }}>
                    {firstName} (PUNDERO)
                </Typography>
                <IconButton color="inherit" onClick={() => setNotificationsOpen(!notificationsOpen)}>
                    <Badge badgeContent={unseenCount} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Toolbar>
            <Drawer
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
                variant="temporary"
            >
                {drawerContent}
            </Drawer>
            <NotificationPopup 
                open={notificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
                onViewNotification={handleViewNotification}
                onMarkAsSeen={handleMarkAsSeen}
            />
        </AppBar>
    );
};

export default CoordinatorNavbar;
