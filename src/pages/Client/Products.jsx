import React, { useState, useEffect } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  TablePagination, Button, TextField, Typography, Box, Stepper, Step, StepLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FilterBar from '../../components/FilterBar';

const Products = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8515/api/Product/GetProducts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleQuantityChange = (idProduct, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [idProduct]: quantity,
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = parseInt(quantities[product.idProduct] || 0, 10);
    if (quantity > 0) {
      const existingProductIndex = cart.findIndex((item) => item.idProduct === product.idProduct);
      if (existingProductIndex !== -1) {
        const newCart = [...cart];
        newCart[existingProductIndex].quantity += quantity;
        setCart(newCart);
      } else {
        setCart([...cart, { ...product, quantity }]);
      }
    }
  };

  const handleRemoveFromCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.idProduct === product.idProduct);
    if (existingProductIndex !== -1) {
      const newCart = [...cart];
      newCart.splice(existingProductIndex, 1);
      setCart(newCart);
    }
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product.idProduct]: 0,
    }));
  };

  const handleClearAll = () => {
    setCart([]);
    setQuantities({});
  };

  const handleProceedCheckout = () => {
    navigate('/client/review-order');
  };

  const handleSearchChange = (searchText) => {
    const filtered = products.filter((product) =>
      product.nameProduct.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <Box paddingY={5}>
      <Typography variant="h4" gutterBottom>Step 1: Add Products</Typography>
      <Stepper activeStep={0} style={{ marginBottom: '20px' }}>
        <Step>
          <StepLabel>Add Products</StepLabel>
        </Step>
        <Step>
          <StepLabel>Review Order</StepLabel>
        </Step>
        <Step>
          <StepLabel>Confirmation</StepLabel>
        </Step>
      </Stepper>
      <Box marginBottom={5}>
        <FilterBar onSearchChange={handleSearchChange} />
      </Box>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Available Quantity</TableCell>
              <TableCell>Enter Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredProducts
            ).map((product) => (
              <TableRow key={product.idProduct}>
                <TableCell>{product.nameProduct}</TableCell>
                <TableCell>{product.price.toFixed(2)} BAM</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={quantities[product.idProduct] || ''}
                    onChange={(e) => handleQuantityChange(product.idProduct, e.target.value)}
                    inputProps={{ min: 0, max: product.quantity }}
                    disabled={product.quantity === 0}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    disabled={!quantities[product.idProduct] || product.quantity === 0}
                    style={{ marginRight: '10px' }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveFromCart(product)}
                    disabled={cart.findIndex((item) => item.idProduct === product.idProduct) === -1}
                  >
                    Remove
                  </Button>
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
      <Box marginTop={5} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleProceedCheckout}
          disabled={cart.length === 0}
        >
          Proceed Checkout
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearAll}
          disabled={cart.length === 0}
        >
          Clear All
        </Button>
      </Box>
    </Box>
  );
};

export default Products;
