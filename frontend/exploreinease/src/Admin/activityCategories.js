import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import axios from 'axios'; // Ensure Axios is imported
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
import NetworkService from '../NetworkService';

function ActivityCategory() {
  const location = useLocation();
  const { allcategories } = location.state || {};
  const { adminId } = location.state || {};  
  const categoryNamesList = allcategories.map(item => item.categoryName); 
  const [checkCategoryAdd,setCheckCategoryAdd]=React.useState(false);
  const [category, setCategory] = React.useState(categoryNamesList);
  const [open, setOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = React.useState(null);
  const [previousCategory, setPreviousCategory] = React.useState(''); // Store the value before update
  
  useEffect(() => {
    getAllCategory();
  }, checkCategoryAdd);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewCategory('');  // Clear the input when dialog is closed
    setEditingCategoryIndex(null);  // Reset editing index
    setPreviousCategory('');  // Reset previous category
  };

  const getAllCategory = async () => {
    try {
      const apiPath = `http://localhost:3030/getAllCategories/admin`;  // Ensure this matches your API route
      const response = await axios.get(apiPath);
      console.log("response from internall :",response);
      
      if (Array.isArray(response.data)) {
        const categories = response.data.map(category => ({
          id: category._id,
          name: category.categoryName
        }));
        setCategory(categories.map(item => item.name));
        // console.log(categories);
      } else {
        console.error('Unexpected data format from API');
      }
    } catch (err) {
      if (err.response) {
        console.error('API Error:', err.message);
      } else {
        console.error('Unexpected Error:', err);
      }
    }
  }

  const handleSaveCategory = async () => {
    setCheckCategoryAdd(false);

    if (newCategory.trim()) {
      const categoryId = allcategories.find(item => item.categoryName === previousCategory)?._id;
      console.log("categories:", allcategories);
      console.log("CategoryName:", newCategory);
      console.log("Previous Category:", previousCategory); // Log previous category value
      console.log("Previous Category id :", categoryId); // Log previous category value

      if (editingCategoryIndex !== null) {
        // Edit existing category
        try {
          const apiPath = `http://localhost:3030/updateCategoryById/${categoryId}`;
          const body = {
            categoryName: newCategory,
            // Send the previous category to the API
          };
          const response = await axios.put(apiPath, body);
          console.log(response);
          
          setCategory((prevCategory) => {
            const updatedCategory = [...prevCategory];
            updatedCategory[editingCategoryIndex] = newCategory;
            return updatedCategory;
          });
          setCheckCategoryAdd(true);
        } catch (error) {
          console.error('Error updating category:', error);
        }
      } else {
        try {
          const options = {
            apiPath: `/createCategory/${adminId}`,
            body: {
              categoryName: newCategory
            }
          };
          const response = await NetworkService.post(options);
          console.log(response);
          setCategory((prevCategory) => [...prevCategory, newCategory]);
          setCheckCategoryAdd(true);
        } catch (error) {
          console.error('Error creating category:', error);
        }
      }
    }
    handleClose();
  };

  const handleInputChange = (event) => {
    setNewCategory(event.target.value); // Update the input value
  };

  const handleDeleteCategory = async (category) => {
     const categoryId = allcategories.find(item =>item.categoryName===category)?._id;
   console.log("new Id",categoryId);
   
    try{
      const options ={
        apiPath:`/deleteCategoryById/${categoryId}` ,
        urlParam: categoryId
      };
      const response = await NetworkService.delete(options);
      console.log(response);
      setCategory((prevCategory) => prevCategory.filter((categoryy) => categoryy !== category));
    }
    catch{
    console.log("error");
    
  }

  };

  const handleEditCategory = (index) => {
    setNewCategory(category[index]);  // Set the category to edit
    setPreviousCategory(category[index]);  // Store the previous category before editing
    setEditingCategoryIndex(index);  // Store the index of the category being edited
    setOpen(true);  // Open the dialog for editing
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} sx={{ marginLeft: 2, marginTop: 2, height: 50, width: 300 }}>
        Create Activity Category
      </Button>
      
      <Box
        sx={{
          minWidth: 400,
          bgcolor: 'white',
          border: '1px solid #ccc',
          marginTop: 4, 
          marginRight: 8,
          marginLeft: 8,
          borderRadius: 1,
          padding: 2
        }}
      >
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
              value={newCategory}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button sx={{ gap: 2 }} type="submit" variant='outlined' onClick={handleSaveCategory}>
              {editingCategoryIndex !== null ? 'Update' : 'Add'}
            </Button>
            <Button variant='outlined' onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <nav aria-label="main categories folders">
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
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
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditCategory(index)} sx={{ color: 'green' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCategory(category)} sx={{ color: 'red' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < category.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </nav>
      </Box>
    </div>
  );
}

export default ActivityCategory;
