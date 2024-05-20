import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemText, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotification } from '../contexts/NotificationContext';
import NotificationPopup from '../pages/NotificationPopup'; // Import NotificationPopup

const CoordinatorNavbar = () => {
    const [open, setOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false); // State for notification popup
    const { notifications } = useNotification();
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
                <ListItem button component={Link} to="/coordinator/dashboard">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/accounts">
                    <ListItemText primary="Accounts" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/vehicles">
                    <ListItemText primary="Vehicles" />
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

export default CoordinatorNavbar;
