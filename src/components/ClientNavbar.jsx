import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemText, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotification } from '../contexts/NotificationContext';
import NotificationPopup from '../pages/NotificationPopup'; // Import NotificationPopup

const ClientNavbar = () => {
    const [open, setOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false); // State for notification popup
    const { notifications = [] } = useNotification(); // Ensure notifications is an array
    const unseenCount = notifications.filter(notification => !notification.seen).length;

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
                <ListItem button component={Link} to="/client/dashboard">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/client/products">
                    <ListItemText primary="Products" />
                </ListItem>
                <ListItem button component={Link} to="/client/create-order">
                    <ListItemText primary="Create Order" />
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
            <NotificationPopup open={notificationsOpen} onClose={() => setNotificationsOpen(false)} /> {/* Add NotificationPopup */}
        </AppBar>
    );
};

export default ClientNavbar;
