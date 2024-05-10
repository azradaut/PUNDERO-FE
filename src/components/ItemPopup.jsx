import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';
import { useDeleteItem, useUpdateItem } from './api'; // Replace with your API hooks

function ItemPopup({ open, item, onClose }) {
  const [editMode, setEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const deleteItem = useDeleteItem(item.id); // Replace with your delete item hook
  const updateItem = useUpdateItem(item.id); // Replace with your update item hook

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedItem(item); // Reset edited item to original state
  };

  const handleChange = (event) => {
    setEditedItem({ ...editedItem, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    try {
      await updateItem(editedItem);
      onClose(); // Close popup on successful update
    } catch (error) {
      console.error('Error updating item:', error);
      // Handle update errors (e.g., display error message to the user)
    }
  };

  const handleDeleteConfirmation = () => {
    setDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      await deleteItem();
      onClose(); // Close popup on successful delete
    } catch (error) {
      console.error('Error deleting item:', error);
      // Handle delete errors (e.g., display error message to the user)
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Item Details</DialogTitle>
      <DialogContent>
        {editMode ? (
          <>
            {/* Editable fields go here */}
            <TextField label="Name" name="name" value={editedItem.name} onChange={handleChange} />
            <TextField label="Description" name="description" value={editedItem.description} onChange={handleChange} />
            {/* Add more fields as needed */}
          </>
        ) : (
          <DialogContentText>
            {/* Display item details here */}
            <p>Name: {item.name}</p>
            <p>Description: {item.description}</p>
            {/* Add more details as needed */}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        {editMode ? (
          <>
            <Button onClick={handleCancelEdit}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        ) : (
          <>
            <Button onClick={handleEditClick}>Edit</Button>
            <Button onClick={handleDeleteConfirmation}>Delete</Button>
          </>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
      {deleteConfirmation && (
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmation(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default ItemPopup;
