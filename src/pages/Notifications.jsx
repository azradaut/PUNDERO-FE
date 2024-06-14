import React from 'react';
import { List, ListItem, ListItemText, Typography, Button } from '@mui/material';
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

    const handleViewNotification = async (notification) => {
        const role = localStorage.getItem('role');

        try {
            await handleMarkAsSeen(notification.idNotification);
            if (role === '1') {
                window.location.href = `/coordinator/pending-invoices`;
            } else if (role === '3') {
                if (notification.message.includes('in transit')) {
                    window.location.href = '/client/client-map';
                } else if (notification.message.includes('delivered')) {
                    window.location.href = '/client/delivered-invoices';
                }
            }
        } catch (error) {
            console.error('Error marking notification as seen and navigating:', error);
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
                        <ListItemText primary={notification.message} secondary={new Date(notification.createdAt).toLocaleString()} />
                        <Button onClick={() => handleViewNotification(notification)} style={{ marginRight: 10 }} color="primary">
                            View
                        </Button>
                        <Button onClick={() => handleMarkAsSeen(notification.idNotification)} color="secondary">
                            Seen
                        </Button>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Notifications;
