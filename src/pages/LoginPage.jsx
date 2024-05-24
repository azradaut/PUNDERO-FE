import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import PunderoLogoBlue from '../images/logo/PunderoLogoBlue.png';
import PunderoLogoWhite from '../images/logo/PunderoLogoWhite.png';

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
            console.log('Submitting login request:', { email, password });
            const response = await axios.post('http://localhost:8515/api/Authentication/login', { email, password });
            console.log('Full response from server:', response);
            console.log('Response data from server:', response.data);

            const { token, type } = response.data;

            if (token && type !== undefined) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', type);

                console.log('Stored Token:', localStorage.getItem('token'));
                console.log('Stored Role:', localStorage.getItem('role'));

                if (type === 1) {
                    navigate('/coordinator');
                } else if (type === 3) {
                    navigate('/client');
                }
            } else {
                console.error('Token or Type is undefined:', { token, type });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (data.errors) {
                    if (data.errors.Email) {
                        setEmailError(data.errors.Email[0]);
                    }
                    if (data.errors.Password) {
                        setPasswordError(data.errors.Password[0]);
                    }
                } else if (data.message) {
                    if (data.message.includes("email")) {
                        setEmailError(data.message);
                    } else if (data.message.includes("password")) {
                        setPasswordError(data.message);
                    } else {
                        setEmailError('An error occurred. Please try again.');
                        setPasswordError('An error occurred. Please try again.');
                    }
                } else {
                    setEmailError('An error occurred. Please try again.');
                    setPasswordError('An error occurred. Please try again.');
                }
            } else {
                setEmailError('An error occurred. Please try again.');
                setPasswordError('An error occurred. Please try again.');
            }
            console.error('Login failed:', error);
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
