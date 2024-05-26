import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';

const clientFields = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'lastName', label: 'Last Name', required: true },
  { name: 'email', label: 'Email', required: true, type: 'email' },
  { name: 'password', label: 'Password', required: true, type: 'password' },
  { name: 'store', label: 'Store', required: true }
];

function AddClient({ onAdd, onClose }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [stores, setStores] = useState([]);
  const [isImageUploadEnabled, setIsImageUploadEnabled] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setIsImageUploadEnabled(!!(formData.firstName && formData.lastName));
    fetchStores();
  }, [formData.firstName, formData.lastName]);

  const fetchStores = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/Stores/GetStores');
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const validateField = (name, value) => {
    let error = "";
    const field = clientFields.find(f => f.name === name);
    if (field) {
      if (field.required && !value) {
        error = `${field.label} is required`;
      } else if (field.pattern && !new RegExp(field.pattern).test(value)) {
        error = field.errorMessage || `Invalid format for ${field.label}`;
      } else if (field.maxLength && value.length > field.maxLength) {
        error = `${field.label} cannot be longer than ${field.maxLength} characters`;
      }
    }
    return error;
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    const error = validateField(name, value);
    if (files) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop();
      const imageName = `Client${formData.firstName}${formData.lastName}.${fileExtension}`;
      setFormData({ ...formData, image: imageName });
      setImageFile(file);  // Store the file to upload it later
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: error });
  };

  const uploadImage = async () => {
    if (!imageFile) return true;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('fileName', `Client${formData.firstName}${formData.lastName}.${imageFile.name.split('.').pop()}`);

    try {
      console.log('Uploading image...', formData);
      const response = await fetch('http://localhost:8515/api/Client/UploadImage/UploadImage', {
        method: 'POST',
        body: formData,
      });
      console.log('Upload response', response);
      return response.ok;
    } catch (error) {
      console.error('Image upload failed:', error);
      return false;
    }
  };

  const handleConfirm = async () => {
    setErrors({});
    const newErrors = {};
    clientFields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = [error];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const imageUploaded = await uploadImage();
    if (!imageUploaded) {
      alert('Failed to upload image');
      return;
    }

    try {
      console.log('Adding client...', formData);
      await onAdd(formData);
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        const validationErrors = error.response.data.errors || {};
        setErrors(validationErrors);
        console.error('Validation errors:', validationErrors);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add Client</DialogTitle>
      <DialogContent>
        {clientFields.map((field) => (
          <TextField
            key={field.name}
            name={field.name}
            label={field.label}
            value={formData[field.name] || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            type={field.type || 'text'}
            InputLabelProps={{ shrink: true }}
            select={field.name === 'store'}
          >
            {field.name === 'store' && stores.map(store => (
              <MenuItem key={store.idStore} value={store.idStore}>
                {store.name}
              </MenuItem>
            ))}
          </TextField>
        ))}
        <input
          type="file"
          name="image"
          onChange={handleChange}
          disabled={!isImageUploadEnabled}
          accept="image/*"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} variant="contained" color="primary">Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddClient;
