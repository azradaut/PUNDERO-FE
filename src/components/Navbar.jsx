import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // For drawer toggle icon
import CloseIcon from '@mui/icons-material/Close'; // For close drawer icon

const Navbar = () => {
  const [open, setOpen] = useState(false);

  // Define drawer content outside the return statement
  const drawerContent = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          PUNDERO
        </Typography>
        <IconButton onClick={() => setOpen(false)}>
          {/* Close drawer icon */}
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            {/* Your icon for Home link (optional) */}
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/accounts">
          <ListItemIcon>
            {/* Your icon for Accounts link (optional) */}
          </ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItem>
        <ListItem button component={Link} to="/vehicles">
          <ListItemIcon>
            {/* Your icon for Accounts link (optional) */}
          </ListItemIcon>
          <ListItemText primary="Vehicles" />
        </ListItem>
        {/* Add more list items as needed */}
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
        {/* Optional: Maintain links outside the drawer */}
        <Link to="/">
          {/* Your Home link content */}
        </Link>
        <Link to="/accounts">
          {/* Your Accounts link content */}
        </Link>
        <Link to="/vehicles">
          {/* Your Accounts link content */}
        </Link>
        {/* Add more links as needed */}
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

export default Navbar;
