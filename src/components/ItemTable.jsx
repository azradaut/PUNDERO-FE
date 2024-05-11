import React, { useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, TablePagination, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ViewItemPopup from './ViewItemPopup'; // Import ViewItemPopup component

function ItemTable({ items, headers, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewItem, setViewItem] = useState(null); // State to manage the item being viewed
  const [deleteItem, setDeleteItem] = useState(null); // State to manage the item being deleted
  const [confirmDelete, setConfirmDelete] = useState(false); // State to manage delete confirmation dialog

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewItemClick = (item) => {
    setViewItem(item);
  };

  const handleDeleteItemClick = (item) => {
    setDeleteItem(item);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDelete(deleteItem);
    setConfirmDelete(false);
  };

  const handleCloseConfirmDelete = () => {
    setDeleteItem(null);
    setConfirmDelete(false);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header}>{header}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {(rowsPerPage > 0
                ? items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : items
              ).map((item) => (
                <TableRow key={item.id}>
                  {headers.map((header) => (
                    <TableCell key={`${item.id}-${header}`}>{item[header]}</TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => handleViewItemClick(item)}>View</Button>
                    <Button onClick={() => handleDeleteItemClick(item)}>Delete</Button>
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
      {/* View Item Popup */}
      <ViewItemPopup item={viewItem} onClose={() => setViewItem(null)} />
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={handleCloseConfirmDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ItemTable;