import { Box, TextField, Button } from '@mui/material';

const SearchFilters = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <TextField label="Search" variant="outlined" fullWidth />
      <Button variant="contained" sx={{ backgroundColor: "#3895d3", color: "white" }}>
        Search
      </Button>
    </Box>
  );
};

export default SearchFilters;
