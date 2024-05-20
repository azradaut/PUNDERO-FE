// src/pages/Client/Products.jsx
import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, TablePagination, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Products = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
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

  const handleContinueCheckout = () => {
    navigate('/client/create-order');
  };

  return (
    <div>
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
              ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : products
            ).map((product) => (
              <TableRow key={product.idProduct}>
                <TableCell>{product.nameProduct}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={quantities[product.idProduct] || ''}
                    onChange={(e) => handleQuantityChange(product.idProduct, e.target.value)}
                    inputProps={{ min: 0, max: product.quantity }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product)}
                    disabled={!quantities[product.idProduct]}
                  >
                    Add to Cart
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
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleContinueCheckout}
        disabled={cart.length === 0}
        style={{ marginTop: '20px' }}
      >
        Continue Checkout
      </Button>
    </div>
  );
};

export default Products;
