import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log('Submitting login request:', { email, password });
            const response = await axios.post('http://localhost:8515/api/Authentication/login', { email, password });
            console.log('Full response from server:', response);
            console.log('Response data from server:', response.data);

            const { token, type } = response.data; // Correct property names

            // Check if token and type are defined
            if (token && type !== undefined) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', type);

                console.log('Stored Token:', localStorage.getItem('token'));
                console.log('Stored Role:', localStorage.getItem('role'));

                if (type === 1) {
                    navigate('/coordinator');
                } else if (type === 2) {
                    navigate('/client');
                }
            } else {
                console.error('Token or Type is undefined:', { token, type });
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginPage;
