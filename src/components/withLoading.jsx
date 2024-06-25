import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import Loading from '../Loading';

const withLoading = (Component) => (props) => {
    const { loading } = useNotification();

    if (loading) {
        return <Loading />;
    }

    return <Component {...props} />;
};

export default withLoading;
