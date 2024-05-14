import React from 'react';
import { Grid, Paper, Typography, TextField, Button, ThemeProvider, createTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Define a custom theme
const theme = createTheme();

function LoginPage() {
  return (
    <ThemeProvider theme={theme}>
      <Grid container style={{ height: '100vh' }}>
        <Grid item xs={6} style={{ backgroundColor: '#fff', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h4" align="center" gutterBottom>Welcome!</Typography>
          <Paper elevation={3} style={{ padding: '2rem' }}>
            <form>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: '2rem' }}
              >
                Sign In
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={6} style={{ backgroundColor: theme.palette.primary.main, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Content for the right panel */}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LoginPage;