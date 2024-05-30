import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import PunderoLogoBlue from '../images/logo/PunderoLogoBlue.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setEmailError('');
        setPasswordError('');

        try {
            const response = await axios.post('http://localhost:8515/api/Authentication/login', { email, password });

            const { token, type, firstName, lastName, storeName, clientId } = response.data;

            if (token && type !== undefined) {
                // Ocisti
                localStorage.clear();

                // local storage data
                localStorage.setItem('token', token);
                localStorage.setItem('role', type);
                localStorage.setItem('firstName', firstName);
                localStorage.setItem('lastName', lastName);

                if (type === 3) {
                    localStorage.setItem('storeName', storeName);
                    localStorage.setItem('clientId', clientId);
                } else {
                    localStorage.setItem('storeName', 'PUNDERO');
                }

                
                if (type === 1) {
                    navigate('/coordinator/dashboard');
                } else if (type === 3) {
                    navigate('/client/dashboard');
                }
            } else {
                console.error('Token or Type is undefined:', { token, type });
            }
        } catch (error) {
           
            if (error.response && error.response.data) {
                const { message } = error.response.data;
                if (message.toLowerCase().includes('email')) {
                    setEmailError(message);
                } else if (message.toLowerCase().includes('password')) {
                    setPasswordError(message);
                } else {
                    console.error('Login error:', message);
                }
            } else {
                console.error('Login error:', error);
            }
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh', overflow: 'hidden' }}>
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                component={Paper}
                elevation={6}
                square
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <img src={PunderoLogoBlue} alt="Pundero Logo" style={{ width: '300px', marginBottom: '16px' }} />
                    <Typography component="h3" variant="h5" gutterBottom>
                        Sign in
                    </Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Grid>
            <Grid
                item
                xs={false}
                sm={6}
                md={6}
                sx={{
                    backgroundColor: '#1976D2'
                }}
            >
            </Grid>
        </Grid>
    );
};

export default LoginPage;
