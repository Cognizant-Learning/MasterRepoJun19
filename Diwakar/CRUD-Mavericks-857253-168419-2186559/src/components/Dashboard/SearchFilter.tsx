import React from 'react';
import { TextField, Box } from '@mui/material';
import './SearchFilter.scss';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ searchTerm, onSearchChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <Box className="search-filter">
      <TextField
        fullWidth
        variant="outlined"
        label="Search inventory..."
        placeholder="Search by name, SKU, or category"
        value={searchTerm}
        onChange={handleChange}
      />
    </Box>
  );
};
