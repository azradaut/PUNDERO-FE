// src/components/CoordinatorNavbar.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemText, Badge, Box, Menu, MenuItem, Button, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import CommuteIcon from '@mui/icons-material/Commute';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import StoreIcon from '@mui/icons-material/Store';
import MapIcon from '@mui/icons-material/Map';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNotification } from '../contexts/NotificationContext';
import NotificationPopup from '../components/NotificationPopup';
import axios from 'axios';

const CoordinatorNavbar = () => {
    const [open, setOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { notifications, setNotifications } = useNotification();
    const unseenCount = notifications.filter(notification => !notification.seen).length;
    const firstName = localStorage.getItem('firstName');
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [assignmentAnchorEl, setAssignmentAnchorEl] = useState(null);
    const [equipmentAnchorEl, setEquipmentAnchorEl] = useState(null);

    const handleMenuClick = (event, menuSetter) => {
        menuSetter(event.currentTarget);
    };

    const handleMenuClose = (menuSetter) => {
        menuSetter(null);
    };

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
                <ListItem button component={Link} to="/coordinator/dashboard" selected={location.pathname === '/coordinator/dashboard'}>
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/invoices" selected={location.pathname === '/coordinator/invoices'}>
                    <ListItemIcon><ReceiptIcon /></ListItemIcon>
                    <ListItemText primary="Invoices" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/pending-invoices" selected={location.pathname === '/coordinator/pending-invoices'}>
                    <ListItemIcon><PendingIcon /></ListItemIcon>
                    <ListItemText primary="Pending Invoices" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/stores" selected={location.pathname === '/coordinator/stores'}>
                    <ListItemIcon><StoreIcon /></ListItemIcon>
                    <ListItemText primary="Stores" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/products_coordinator" selected={location.pathname === '/coordinator/products_coordinator'}>
                    <ListItemIcon><LocalMallIcon /></ListItemIcon>
                    <ListItemText primary="Products" />
                </ListItem>
                <ListItem button component={Link} to="/coordinator/map" selected={location.pathname === '/coordinator/map'}>
                    <ListItemIcon><MapIcon /></ListItemIcon>
                    <ListItemText primary="Map" />
                </ListItem>
                <ListItem button component={Link} to="/" selected={location.pathname === '/'}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
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
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                    {/* Dropdown Menus */}
                    <Button
                        color="inherit"
                        onClick={(e) => handleMenuClick(e, setAnchorEl)}
                    >
                        Accounts
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => handleMenuClose(setAnchorEl)}
                    >
                        <MenuItem component={Link} to="/coordinator/accounts" selected={location.pathname === '/coordinator/accounts'} onClick={() => handleMenuClose(setAnchorEl)}>Accounts</MenuItem>
                        <MenuItem component={Link} to="/coordinator/coordinators" selected={location.pathname === '/coordinator/coordinators'} onClick={() => handleMenuClose(setAnchorEl)}>Coordinators</MenuItem>
                        <MenuItem component={Link} to="/coordinator/clients" selected={location.pathname === '/coordinator/clients'} onClick={() => handleMenuClose(setAnchorEl)}>Clients</MenuItem>
                        <MenuItem component={Link} to="/coordinator/drivers" selected={location.pathname === '/coordinator/drivers'} onClick={() => handleMenuClose(setAnchorEl)}>Drivers</MenuItem>
                    </Menu>

                    <Button
                        color="inherit"
                        onClick={(e) => handleMenuClick(e, setAssignmentAnchorEl)}
                    >
                        Assignments
                    </Button>
                    <Menu
                        anchorEl={assignmentAnchorEl}
                        open={Boolean(assignmentAnchorEl)}
                        onClose={() => handleMenuClose(setAssignmentAnchorEl)}
                    >
                        <MenuItem component={Link} to="/coordinator/assignmobile" selected={location.pathname === '/coordinator/assignmobile'} onClick={() => handleMenuClose(setAssignmentAnchorEl)}>Assign Mobile</MenuItem>
                        <MenuItem component={Link} to="/coordinator/assignvehicle" selected={location.pathname === '/coordinator/assignvehicle'} onClick={() => handleMenuClose(setAssignmentAnchorEl)}>Assign Vehicle</MenuItem>
                    </Menu>

                    <Button
                        color="inherit"
                        onClick={(e) => handleMenuClick(e, setEquipmentAnchorEl)}
                    >
                        Equipment
                    </Button>
                    <Menu
                        anchorEl={equipmentAnchorEl}
                        open={Boolean(equipmentAnchorEl)}
                        onClose={() => handleMenuClose(setEquipmentAnchorEl)}
                    >
                        <MenuItem component={Link} to="/coordinator/vehicles" selected={location.pathname === '/coordinator/vehicles'} onClick={() => handleMenuClose(setEquipmentAnchorEl)}>Vehicles</MenuItem>
                        <MenuItem component={Link} to="/coordinator/mobiles" selected={location.pathname === '/coordinator/mobiles'} onClick={() => handleMenuClose(setEquipmentAnchorEl)}>Mobiles</MenuItem>
                    </Menu>
                </Box>
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
