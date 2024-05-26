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
            const storeName = localStorage.getItem('storeName');
            if (role && storeName) {
                try {
                    const response = await axios.get(`http://localhost:8515/api/Notifications/${role}/${storeName}`);
                    setNotifications(response.data || []);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                    setNotifications([]); // Ensure notifications is always an array
                }
            } else {
                console.error('Role or StoreName is not available in local storage');
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
