/*import React, { useState } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ViewItemPopup from './ViewItemPopup';
import EditItem from './EditItem';

function ItemTable({ items = [], headers = [], displayHeaders = {}, onDelete, onEdit, onView, fields, customActions }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewItemClick = (item) => {
    setViewItem(item);
    if (onView) {
      onView(item);
    }
  };

  const handleEditItemClick = (item) => {
    console.log("Edit item clicked: ", item);
    setEditItem(item);
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDeleteItemButtonClick = (item) => {
    setDeleteItem(item);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(deleteItem);
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };

  const handleSaveEditItem = async (updatedItem) => {
    await onEdit(updatedItem);
    setEditItem(null);
  };

  const getNestedValue = (item, path) => {
    return path.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : ''), item);
  };

  const getIdKey = (item) => {
    return item.idVehicle ? 'idVehicle' : item.idProduct ? 'idProduct' : 'id';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>{displayHeaders[header] || header}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : items
            ).map((item) => (
              <TableRow key={item[getIdKey(item)]}>
                {
headers.map((header) => (
  <TableCell key={`${item[getIdKey(item)]}-${header}`}>
    {getNestedValue(item, header)}
  </TableCell>
))}
<TableCell>
  {customActions ? (
    customActions(item)
  ) : (
    <>
      <Button onClick={() => handleViewItemClick(item)}>View</Button>
      <Button onClick={() => handleEditItemClick(item)}>Edit</Button>
      <Button onClick={() => handleDeleteItemButtonClick(item)}>Delete</Button>
    </>
  )}
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</TableContainer>
<TablePagination
rowsPerPageOptions={[10, 50, 100]}
component="div"
count={items.length}
rowsPerPage={rowsPerPage}
page={page}
onPageChange={handleChangePage}
onRowsPerPageChange={handleChangeRowsPerPage}
/>
<ViewItemPopup item={viewItem} onClose={() => setViewItem(null)} />
{editItem && (
<EditItem
item={editItem}
onSave={handleSaveEditItem}
onClose={() => setEditItem(null)}
fields={fields}
/>
)}
<Dialog open={confirmDeleteOpen} onClose={handleCancelDelete}>
<DialogTitle>Delete Item</DialogTitle>
<DialogContent>
<p>Are you sure you want to delete this item?</p>
</DialogContent>
<DialogActions>
<Button onClick={handleCancelDelete}>Cancel</Button>
<Button onClick={handleConfirmDelete}>Delete</Button>
</DialogActions>
</Dialog>
</div>
);
}

export default ItemTable; */
