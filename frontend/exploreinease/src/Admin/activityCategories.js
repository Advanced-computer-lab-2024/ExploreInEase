import React, { useEffect,useState } from 'react';
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
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import DialogTitle from '@mui/material/DialogTitle';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NetworkService from '../NetworkService';
import './preferenceTags.css';

function ActivityCategory() {
  const adminIdd=localStorage.getItem('UserId');
  const location = useLocation();
  const [loading, setLoading] = useState(false); // Loading state
  const [categoryData, setCategoryData] = React.useState([]);
  const allcategories = location.state?.allcategories || categoryData;
  const { adminId } = location.state || adminIdd;  
  const categoryNamesList = allcategories.map(item => item.categoryName); 
  const [checkCategoryAdd,setCheckCategoryAdd]=React.useState(true);
  const [category, setCategory] = React.useState(categoryNamesList);
  const [open, setOpen] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = React.useState(null);
  const [previousCategory, setPreviousCategory] = React.useState(''); // Store the value before update
//   getAllCategories/admin
  useEffect(() => {
    console.log("here");
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
      setLoading(true);
      const apiPath = `http://localhost:3030/getAllCategories/admin`;  // Ensure this matches your API route
      const response = await axios.get(apiPath);
      console.log("response aho",response);
      
      setCategoryData(response.data);
      console.log("response from internall :",response);
      
      if (Array.isArray(response.data)) {
        const categories = response.data.map(category => ({
          id: category._id,
          name: category.categoryName
        }));
        setLoading(false);
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
<Box>
  {loading ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress color="error" size={100} />
    </Box>
  ) : (
    <Box className="tags-background">
      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid #ccc",
          marginTop: 4,
          mx: "auto",
          borderRadius: 1,
          p: 3,
          maxWidth: 800,
          height: "100%", // Take full available height
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            {editingCategoryIndex !== null
              ? "Edit Activity Category"
              : "Create Activity Category"}
          </DialogTitle>
          <DialogContent>
            <TextField
              required
              fullWidth
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
            <Button
              sx={{ gap: 2 }}
              type="submit"
              variant="contained"
              onClick={handleSaveCategory}
              color="primary"
            >
              {editingCategoryIndex !== null ? "Update" : "Add"}
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* List */}
        <nav aria-label="main tags folders">
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
            }}
            subheader={
              <ListSubheader
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  color: "red",
                  textAlign: "center",
                }}
              >
                Activity Categories
              </ListSubheader>
            }
          >
            {category.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  p: 4,
                  fontStyle: "italic",
                  color: "gray",
                }}
              >
                No categories found. Please add one.
              </Box>
            ) : (
              category.map((category, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ListItemButton>
                      <ListItemText primary={category} />
                    </ListItemButton>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditCategory(index)}
                          sx={{ color: "green" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteCategory(category)}
                          sx={{ color: "red" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                  {index < category.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
          <Tooltip title="Create Activity Category" arrow>
            <IconButton
              onClick={handleClickOpen}
              sx={{
                width: 50,
                height: 50,
                display: "block",
                margin: "16px auto 0",
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </nav>
      </Box>
    </Box>
  )}
</Box>


      );
}

 export default ActivityCategory;
