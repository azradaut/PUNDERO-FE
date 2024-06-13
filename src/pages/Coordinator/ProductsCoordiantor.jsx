import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import FilterBar from '../../components/FilterBar';
import AddItem from '../../components/AddItem';
import EditItem from '../../components/EditItem';
import ViewItemPopup from '../../components/ViewItemPopup';
import Alerts from '../../components/Alerts';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

const productFields = [
  { name: 'nameProduct', label: 'Name', required: true, maxLength: 50 },
  { name: 'quantity', label: 'Quantity', required: true, type: 'number' },
  { name: 'price', label: 'Price', required: true, type: 'number' },
  { name: 'barcode', label: 'Barcode', required: true, type: 'number' },
  { name: 'warehouseName', label: 'Warehouse', required: true }
];

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8515/api/ProductsCoordinator/GetProductsCoordinator');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    const filteredResult = products.filter((product) => {
      return Object.values(product).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredProducts(filteredResult);
  };

  const handleAddItem = async (formData) => {
    try {
      const response = await fetch('http://localhost:8515/api/ProductsCoordinator/AddProductCoordinator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      setAlertMessage('Product added successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error adding product.');
      setAlertSeverity('error');
      console.error('Error adding product:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleEditItem = async (formData) => {
    try {
      const response = await fetch(`http://localhost:8515/api/ProductsCoordinator/UpdateProductCoordinator/${formData.idProduct}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      setAlertMessage('Product updated successfully!');
      setAlertSeverity('success');
      fetchData();
      setSelectedProduct(null);
    } catch (error) {
      setAlertMessage('Error updating product.');
      setAlertSeverity('error');
      console.error('Error updating product:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleDeleteItemClick = async (item) => {
    try {
      const response = await fetch(`http://localhost:8515/api/ProductsCoordinator/DeleteProductCoordinator/${item.idProduct}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      setAlertMessage('Product deleted successfully!');
      setAlertSeverity('success');
      fetchData();
    } catch (error) {
      setAlertMessage('Error deleting product.');
      setAlertSeverity('error');
      console.error('Error deleting product:', error);
    } finally {
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewItemClick = (item) => {
    setViewProduct(item);
  };

  const handleDeleteItemButtonClick = (item) => {
    setDeleteItem(item);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteItemClick(deleteItem);
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteItem(null);
    setConfirmDeleteOpen(false);
  };

  const getDisplayHeaders = () => {
    return {
      idProduct: 'ID',
      nameProduct: 'Name',
      quantity: 'Quantity',
      price: 'Price'
    };
  };

  return (
    <div>
      <h2>Products</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {showAddDialog && (
        <AddItem onAdd={handleAddItem} onClose={() => setShowAddDialog(false)} fields={productFields} />
      )}
      {selectedProduct && (
        <EditItem item={selectedProduct} onSave={handleEditItem} onClose={() => setSelectedProduct(null)} fields={productFields} />
      )}
      {viewProduct && (
        <ViewItemPopup item={viewProduct} onClose={() => setViewProduct(null)} />
      )}
      {filteredProducts.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Object.keys(getDisplayHeaders()).map((header) => (
                    <TableCell key={header}>{getDisplayHeaders()[header]}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredProducts
                ).map((item) => (
                  <TableRow key={item.idProduct}>
                    {Object.keys(getDisplayHeaders()).map((header) => (
                      <TableCell key={`${item.idProduct}-${header}`}>
                        {item[header]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button onClick={() => handleViewItemClick(item)}>View</Button>
                      <Button onClick={() => setSelectedProduct(item)}>Edit</Button>
                      <Button onClick={() => handleDeleteItemButtonClick(item)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 50, 100]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
      ) : (
        <p>No products match the current filters.</p>
      )}
      <Alerts open={alertOpen} message={alertMessage} severity={alertSeverity} onClose={handleAlertClose} />
    </div>
  );
}

export default Products;
