import React from 'react';
import truckImg from '../src/images/logo/PunderoLogoWhite.png';

const Loading = () => {
  const styles = {
    loadingContainer: {
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh', 
      backgroundColor: '#f2f2f2', 
    },
    truckLogo: {
      animation: 'drive 2s linear infinite',
      transformOrigin: 'left',
    },
    loadingText: {
      color: '#1976d2',
      marginLeft: '1rem', 
    },
    '@keyframes drive': {
      from: { transform: 'translateX(-100%)' },
      to: { transform: 'translateX(100%)' },
    },
  };

  return (
    <div style={styles.loadingContainer}>
      <img src={truckImg} alt="Pundero Logo (Truck)" className="truck-logo" style={styles.truckLogo} />
      <h2 style={styles.loadingText}>Loading...</h2>
    </div>
  );
};

export default Loading;