import React, { useState } from 'react';
import { TextField, Select, MenuItem, InputAdornment, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

function FilterBar({ onSearchChange, onFilterChange, filterOptions = [], filterValue = '' }) {
  const [searchText, setSearchText] = useState('');

  const handleSearchInputChange = (event) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
    onSearchChange(newSearchText);
  };

  const handleFilterChange = (event) => {
    onFilterChange(event.target.value);
  };

  return (
    <Grid container spacing={2} alignItems="center">
      {filterOptions.length > 0 && (
        <Grid item xs={3}>
          <Select
            value={filterValue}
            onChange={handleFilterChange}
            displayEmpty
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="">Status</MenuItem>
            {filterOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      )}
      <Grid item xs={filterOptions.length > 0 ? 9 : 12}>
        <TextField
          label="Search"
          value={searchText}
          onChange={handleSearchInputChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
}

export default FilterBar;
