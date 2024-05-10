import React, { useState } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

function FilterBar({ onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    onFilterChange({ category: event.target.value, status: selectedStatus, searchText });
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    onFilterChange({ category: selectedCategory, status: event.target.value, searchText });
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    onFilterChange({ category: selectedCategory, status: selectedStatus, searchText: event.target.value });
  };

  return (
    <div style={{ display: 'flex' }}>
      <FormControl fullWidth style={{ marginRight: '1rem' }}> {/* Margin for spacing */}
        <InputLabel id="filter-category-label">Category</InputLabel>
        <Select
          labelId="filter-category-label"
          id="filter-category"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <MenuItem value="">All</MenuItem>
          {/* Add options for your categories here */}
          <MenuItem value="Category 1">Category 1</MenuItem>
          <MenuItem value="Category 2">Category 2</MenuItem>
          <MenuItem value="Category 3">Category 3</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginRight: '1rem' }}> {/* Margin for spacing */}
        <InputLabel id="filter-status-label">Status</InputLabel>
        <Select
          labelId="filter-status-label"
          id="filter-status"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <MenuItem value="">All</MenuItem>
          {/* Add options for your statuses here */}
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </FormControl>
      <TextField fullWidth label="Search" value={searchText} onChange={handleSearchChange} />
    </div>
  );
}

export default FilterBar;
