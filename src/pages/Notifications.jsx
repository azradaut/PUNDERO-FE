import React from 'react';
import { List, ListItem, ListItemText, Typography, Checkbox, Button } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

const Notifications = () => {
    const { notifications, setNotifications } = useNotification();

    const handleMarkAsSeen = async (id) => {
        try {
            await axios.put(`http://localhost:8515/api/Notification/${id}/markAsSeen`);
            setNotifications(prev => prev.filter(n => n.idNotification !== id));
        } catch (error) {
            console.error('Error marking notification as seen:', error);
        }
    };

    const handleViewNotification = (notification) => {
        const role = localStorage.getItem('role');
        if (role === '3') {
            window.location.href = '/coordinator/pending-invoices';
        } else if (role === '2') {
            if (notification.message.includes('in transit')) {
                window.location.href = '/client/map';
            } else if (notification.message.includes('delivered')) {
                window.location.href = '/client/delivered-invoices';
            }
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
                        <Button onClick={() => handleViewNotification(notification)}>View</Button>
                        <Button onClick={() => handleMarkAsSeen(notification.idNotification)}>Mark as Read</Button>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Notifications;
