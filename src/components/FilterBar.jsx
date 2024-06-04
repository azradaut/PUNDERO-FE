import React, { useState } from 'react';
import { TextField } from '@mui/material';

function FilterBar({ onSearchChange }) {
  const [searchText, setSearchText] = useState('');

  const handleSearchInputChange = (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
    onSearchChange(newSearchText);
  };

  return (
    <div>
      <TextField
        fullWidth
        label="Search"
      
        value={searchText}
        onChange={handleSearchInputChange}
      />
    </div>
  );
}

export default FilterBar;