/*import React, { useState, useEffect } from 'react';
import ItemTable from '../components/ItemTable';
import FilterBar from '../components/FilterBar';
import AddItem from '../components/AddItem';
import EditItem from '../components/EditItem';
import { Button } from '@mui/material';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://localhost:44306/api/Product/GetProducts');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data); 
    } catch (error) {
      console.error('Error fetching products:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  };

  const handleSearchChange = (newSearchText) => {
    setSearchText(newSearchText);
    // Filter Products based on search text
    const filteredResult = products.filter((product) => {
      // Check if any property of the Products includes the search text
      return Object.values(product).some((value) =>
        typeof value === 'string' && value.toLowerCase().includes(newSearchText.toLowerCase())
      );
    });
    setFilteredProducts(filteredResult); // Update filteredProducts state
  };

  const handleAddItem = async (formData) => {
    try {
      const response = await fetch('https://localhost:44306/api/Product/PostProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      // Refetch data to update the table
      fetchData();
    } catch (error) {
      console.error('Error adding roduct:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const response = await fetch(`https://localhost:44306/api/Product/DeleteProduct/${item.id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
  
      // Refetch data to update the table
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  

  const handleEditItem = (item) => {
    setEditItem(item); // Set the item to be edited
  };

  const handleSaveEdit = async (formData) => {
    try {
      const response = await fetch(`https://localhost:44306/api/Product/PutProduct/${formData.idProduct}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
  
      // If the response is successful, we should first setEditItem(null) to close the edit dialog,
      // and then fetch the updated data to ensure the table reflects the changes.
      setEditItem(null); // Close the edit dialog after saving changes
      fetchData(); // Refetch data to update the table
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };
  
  const categoryAttributes = products.length > 0 ? Object.keys(products[0]).filter(attr => attr !== 'id') : [];
  
  return (
    <div>
      <h2>Products</h2>
      <FilterBar onSearchChange={handleSearchChange} />
      <Button onClick={() => setShowAddDialog(true)}>Add</Button>
      {showAddDialog && (
        <AddItem 
          onAdd={handleAddItem} 
          onClose={() => setShowAddDialog(false)} 
          categoryAttributes={categoryAttributes} 
        />
      )}
      {editItem && (
        <EditItem
          item={editItem}
          fields={categoryAttributes}
          onSave={handleSaveEdit}
          onDelete={handleDeleteItem}
          onCancel={() => setEditItem(null)}
        />
      )}
      {filteredProducts.length > 0 ? (
        <ItemTable
        items={filteredProducts}
        headers={Object.keys(products[0] || {})} // Change Products[0] to products[0]
        onEdit={handleEditItem} // Pass the edit function to the ItemTable
      />
      
      ) : (
        <p>No products match the current filters.</p>
      )}
    </div>
  );
}

export default Products;*/