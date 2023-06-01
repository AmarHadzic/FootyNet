import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';



interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Search for Stock
          </Typography>
          <TextField label="Enter stock symbol" variant="outlined" fullWidth />
          <Button variant="contained" color="primary" fullWidth>
            Search
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SearchBox;
