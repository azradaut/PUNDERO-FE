import React from 'react';

const ClientDashboard = () => {
  const firstName = localStorage.getItem('firstName');

  return <h2>Welcome, {firstName}</h2>;
};

export default ClientDashboard;
