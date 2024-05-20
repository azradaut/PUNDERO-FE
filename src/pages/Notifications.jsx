import React from 'react';
import { List, ListItem, ListItemText, Typography, Checkbox } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

const Notifications = () => {
    const { notifications, setNotifications } = useNotification();

    const handleMarkAsSeen = async (id) => {
        try {
            await axios.put(`http://localhost:8515/api/Notifications/${id}/markAsSeen`);
            setNotifications(prev => prev.map(n => n.idNotification === id ? { ...n, seen: true } : n));
        } catch (error) {
            console.error('Error marking notification as seen:', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Notifications
            </Typography>
            <List>
                {notifications.map(notification => (
                    <ListItem key={notification.idNotification} dense>
                        <Checkbox
                            checked={notification.seen}
                            onChange={() => handleMarkAsSeen(notification.idNotification)}
                        />
                        <ListItemText primary={notification.message} secondary={new Date(notification.createdAt).toLocaleString()} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Notifications;
