import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const AddEditItem = ({ item, fields, onSave, onClose }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      const initialFormData = {};
      fields.forEach(field => {
        initialFormData[field.name] = field.type === 'date' ? '' : '';
      });
      setFormData(initialFormData);
    }
  }, [item, fields]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{item ? 'Edit Assignment' : 'Add Assignment'}</DialogTitle>
      <DialogContent>
        {fields.map(field => (
          <FormControl key={field.name} fullWidth margin="normal">
            {field.type === 'select' ? (
              <>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                >
                  {field.options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </>
            ) : (
              <TextField
                name={field.name}
                label={field.label}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={field.required}
                InputLabelProps={{ shrink: true }}
              />
            )}
          </FormControl>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditItem;
