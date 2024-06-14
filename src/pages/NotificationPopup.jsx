import React from 'react';
import { Dialog, DialogTitle, List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';
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

    const handleViewNotification = async (notification) => {
        const role = localStorage.getItem('role');

        try {
            await handleMarkAsSeen(notification.idNotification);
            if (role === '1') {
                window.location.href = `/coordinator/invoices`;
            } else if (role === '3') {
                if (notification.message.includes('in transit')) {
                    window.location.href = `/client/client-map`;
                } else if (notification.message.includes('delivered')) {
                    window.location.href = `/client/delivered-invoices`;
                }
            }
        } catch (error) {
            console.error('Error marking notification as seen and navigating:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle style={{ padding: '16px 24px' }}>Notifications</DialogTitle>
            <List style={{ padding: '0 24px' }}>
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <ListItem key={notification.idNotification} dense style={{ padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>
                            <ListItemText 
                                primary={notification.message} 
                                secondary={new Date(notification.createdAt).toLocaleString()} 
                            />
                            <Box display="flex" alignItems="center">
                                <Button 
                                    onClick={() => handleViewNotification(notification)} 
                                    style={{ marginRight: 10 }}
                                    color="primary"
                                >
                                    View
                                </Button>
                                <Button 
                                    onClick={() => handleMarkAsSeen(notification.idNotification)}
                                    color="secondary"
                                >
                                    Seen
                                </Button>
                            </Box>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body2" style={{ padding: '20px 0', textAlign: 'center' }}>
                        No notifications available.
                    </Typography>
                )}
            </List>
        </Dialog>
    );
};

export default NotificationPopup;
