// NotificationPopup.jsx
import React from 'react';
import { Dialog, DialogTitle, List, ListItem, ListItemText, Checkbox, Button } from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

const NotificationPopup = ({ open, onClose }) => {
    const { notifications, setNotifications } = useNotification();

    const handleMarkAsSeen = async (id) => {
        try {
            await axios.put(`http://localhost:8515/api/Notification/coordinator/${id}/markAsSeen`);
            setNotifications(prev => prev.filter(n => n.idNotification !== id));
        } catch (error) {
            console.error('Error marking notification as seen:', error);
        }
    };

    const handleViewNotification = (notification) => {
        const role = localStorage.getItem('role');
        if (role === '1') {
            window.location.href = '/coordinator/pending-invoices';
        } else if (role === '3') {
            if (notification.message.includes('in transit')) {
                window.location.href = '/client/map';
            } else if (notification.message.includes('delivered')) {
                window.location.href = '/client/delivered-invoices';
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Notifications</DialogTitle>
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
        </Dialog>
    );
};

export default NotificationPopup;
