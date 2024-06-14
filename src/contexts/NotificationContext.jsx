import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const role = localStorage.getItem('role');
            const idAccount = localStorage.getItem('idAccount'); // Added to get idAccount
            if (role && idAccount) {
                let endpoint = '';
                if (role === '1') {
                    endpoint = `http://localhost:8515/api/Notification/coordinator/${idAccount}`;
                } else if (role === '3') {
                    const storeName = localStorage.getItem('storeName');
                    endpoint = `http://localhost:8515/api/Notification/client/${storeName}`;
                }
                try {
                    const response = await axios.get(endpoint);
                    setNotifications(response.data || []);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                    setNotifications([]); 
                }
            } else {
                console.error('Role or IdAccount is not available in local storage');
                setNotifications([]);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
