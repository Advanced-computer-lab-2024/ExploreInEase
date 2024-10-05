import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function ActivityCategory() {
  const [category, setCategory] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewCategory('');  // Clear the input when dialog is closed
    setEditingCategoryIndex(null);  // Reset editing index
  };

  const handleSaveCategory = () => {
    if (newCategory.trim()) {
      if (editingCategoryIndex !== null) {
        // Edit existing tag
        setCategory((prevCategory) => {
          const updatedCategory = [...prevCategory];
          updatedCategory[editingCategoryIndex] = newCategory;
          return updatedCategory;
        });
      } else {
        // Add new tag
        setCategory((prevCategory) => [...prevCategory, newCategory]);
      }
    }
    handleClose();
  };

  const handleInputChange = (event) => {
    setNewCategory(event.target.value); // Update the input value
  };

  const handleDeleteCategory = (index) => {
    setCategory((prevCategory) => prevCategory.filter((_, i) => i !== index));  // Remove the tag
  };

  const handleEditCategory = (index) => {
    setNewCategory(category[index]);  // Set the tag to edit
    setEditingCategoryIndex(index);  // Store the index of the tag being edited
    setOpen(true);  // Open the dialog for editing
  };

  return (
    <div>
      {/* Button outside of the box */}
      <Button variant="contained" onClick={handleClickOpen} sx={{ marginLeft: 2, marginTop: 2, height: 50,width:300 }}>
        Create Activity Category
      </Button>
      
      <Box
        sx={{
          minWidth: 400,
          bgcolor: 'white',
          border: '1px solid #ccc', // Add border
          marginTop: 4, 
          marginRight:8,
          marginLeft:8,
          borderRadius: 1, // Slight border radius for aesthetics
          padding: 2 // Add padding inside the box
        }}
      >
        {/* Dialog for creating or editing a tag */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingCategoryIndex !== null ? 'Edit Activity Category' : 'Create Activity Category'}</DialogTitle>
          <DialogContent>
            <TextField
              
              required
              margin="normal"
              id="name"
              name="name"
              label="Name"
              type="text"
              variant="outlined"
              value={newCategory} // Bind the input value to state
              onChange={handleInputChange} // Handle input change
            />
          </DialogContent>
          <DialogActions>
            <Button sx={{gap:2}} type="submit" variant='outlined' onClick={handleSaveCategory}>
              {editingCategoryIndex !== null ? 'Update' : 'Add'}
            </Button>
            
            <Button variant='outlined' onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Display the list of existing tags */}
        <nav aria-label="main Categories folders">
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader
                sx={{
                  fontWeight: 'bold', // Make it bold
                  fontSize: '1.25rem', // Increase the font size
                  color: 'red'
                }}
              >
               Activity Category
              </ListSubheader>
            }
          >
            {category.map((category, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{ marginLeft: 6, display: 'flex', justifyContent: 'space-between' }}
                >
                  <ListItemButton>
                    <ListItemText primary={category} />
                  </ListItemButton>
                  {/* Icons for editing and deleting with styles */}
                  <Box sx={{ display: 'flex', gap: 1 }}> {/* Add a gap between the icons */}
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditCategory(index)} sx={{ color: 'green' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(index)} sx={{ color: 'red' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < category.length - 1 && <Divider />} {/* Add divider after each item except the last */}
              </React.Fragment>
            ))}
          </List>
        </nav>
      </Box>
    </div>
  );
}

export default ActivityCategory;
