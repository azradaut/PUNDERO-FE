import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const accountFields = [
  { name: 'firstName', label: 'First Name', required: true },
  { name: 'lastName', label: 'Last Name', required: true },
  { name: 'email', label: 'Email', required: true, type: 'email' },
  { name: 'qualification', label: 'Qualification', required: false },
  { name: 'description', label: 'Description', required: false }
];

function EditAccount({ account, onSave, onClose }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setFormData({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      qualification: account.qualification,
      description: account.description,
      idAccount: account.idAccount // Ensure the idAccount is included
    });
  }, [account]);

  const validateField = (name, value) => {
    let error = "";
    const field = accountFields.find(f => f.name === name);
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
      setImageFile(file);  // Store the file to upload it later
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleSave = async () => {
    setErrors({});
    const newErrors = {};
    accountFields.forEach(field => {
      const error = validateField(field.name, formData[field.name]);
      if (error) {
        newErrors[field.name] = [error];
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const updatedAccount = { ...account, ...formData };
      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const imageName = `Coordinator${account.idAccount}.${fileExtension}`;
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        uploadData.append('fileName', imageName);

        const response = await fetch('http://localhost:8515/api/Coordinator/UploadImage', {
          method: 'POST',
          body: uploadData,
        });

        if (response.ok) {
          updatedAccount.image = imageName;
        } else {
          console.error('Image upload failed');
        }
      }
      await onSave(updatedAccount);
      onClose();
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Account</DialogTitle>
      <DialogContent>
        {accountFields.map((field) => (
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
          />
        ))}
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditAccount;
