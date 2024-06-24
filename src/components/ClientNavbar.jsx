// src/components/ClientNavbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemText, Badge, Box, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MapIcon from '@mui/icons-material/Map';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNotification } from '../contexts/NotificationContext';
import NotificationPopup from '../pages/NotificationPopup';

const ClientNavbar = () => {
    const [open, setOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { notifications = [] } = useNotification();
    const unseenCount = notifications.filter(notification => !notification.seen).length;
    const firstName = localStorage.getItem('firstName');
    const storeName = localStorage.getItem('storeName');
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
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
                <ListItem button component={Link} to="/client/dashboard" selected={location.pathname === '/client/dashboard'}>
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/client/products" selected={location.pathname === '/client/products'}>
                    <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
                    <ListItemText primary="Products" />
                </ListItem>
                <ListItem button component={Link} to="/client/delivered-invoices" selected={location.pathname === '/client/delivered-invoices'}>
                    <ListItemIcon><ReceiptIcon /></ListItemIcon>
                    <ListItemText primary="Delivered Invoices" />
                </ListItem>
                <ListItem button component={Link} to="/client/client-invoices" selected={location.pathname === '/client/client-invoices'}>
                    <ListItemIcon><ReceiptIcon /></ListItemIcon>
                    <ListItemText primary="Invoices" />
                </ListItem>
                <ListItem button component={Link} to="/client/client-map" selected={location.pathname === '/client/client-map'}>
                    <ListItemIcon><MapIcon /></ListItemIcon>
                    <ListItemText primary="Map" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
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
                    {firstName} ({storeName})
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
            <NotificationPopup open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </AppBar>
    );
};

export default ClientNavbar;
