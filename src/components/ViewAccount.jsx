import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CardMedia } from '@mui/material';

function ViewAccount({ account, onClose }) {
  const { idCoordinator, idClient, idDriver, firstName, lastName, email, type, image, qualification, description, licenseNumber, licenseCategory, tachographLabel, assignedMobile, assignedVehicle } = account;

  const getTypeLabel = (type) => {
    switch (type) {
      case 'Coordinator':
        return 'Coordinator';
      case 'Client':
        return 'Client';
      case 'Driver':
        return 'Driver';
      default:
        return 'Unknown';
    }
  };

  const imageUrl = image ? `http://localhost:8515/images/profile_images/${image}` : null;
  console.log("Image URL:", imageUrl); // Log the image URL

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Account Details</DialogTitle>
      <DialogContent>
        {idCoordinator && <Typography variant="body1"><strong>ID:</strong> {idCoordinator}</Typography>}
        {idClient && <Typography variant="body1"><strong>ID:</strong> {idClient}</Typography>}
        {idDriver && <Typography variant="body1"><strong>ID:</strong> {idDriver}</Typography>}
        <Typography variant="body1"><strong>First Name:</strong> {firstName}</Typography>
        <Typography variant="body1"><strong>Last Name:</strong> {lastName}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {email}</Typography>
        <Typography variant="body1"><strong>Type:</strong> {getTypeLabel(type)}</Typography>
        {qualification && <Typography variant="body1"><strong>Qualification:</strong> {qualification}</Typography>}
        {description && <Typography variant="body1"><strong>Description:</strong> {description}</Typography>}
        {licenseNumber && <Typography variant="body1"><strong>License Number:</strong> {licenseNumber}</Typography>}
        {licenseCategory && <Typography variant="body1"><strong>License Category:</strong> {licenseCategory}</Typography>}
        {tachographLabel && <Typography variant="body1"><strong>Tachograph Label:</strong> {tachographLabel}</Typography>}
        <Typography variant="body1"><strong>Assigned Mobile:</strong> {assignedMobile || "Unassigned"}</Typography>
        <Typography variant="body1"><strong>Assigned Vehicle:</strong> {assignedVehicle || "Unassigned"}</Typography>
        {image && (
          <CardMedia
            component="img"
            height="300"
            style={{ objectFit: 'contain' }}
            image={imageUrl}
            alt="Profile Image"
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewAccount;
