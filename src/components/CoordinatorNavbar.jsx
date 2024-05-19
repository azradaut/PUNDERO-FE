// src/components/CoordinatorNavbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const CoordinatorNavbar = () => {
  const [open, setOpen] = useState(false);

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
      </Toolbar>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default CoordinatorNavbar;
