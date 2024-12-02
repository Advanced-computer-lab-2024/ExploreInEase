import React,{ useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import axios from 'axios'; // Ensure Axios is imported
import Button from '@mui/material/Button';
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
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
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import { useLocation } from 'react-router-dom';
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import './preferenceTags.css';
function Preferencetags() {
    const adminIdd=localStorage.getItem('UserId');
  const [tags, setTags] = React.useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [prefenceTagg, setPreferenceTagg] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newTag, setNewTag] = React.useState('');
  const [prevTag, setPrevTag] = React.useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editingTagIndex, setEditingTagIndex] = React.useState(null);
  const location = useLocation();
 const {adminId}=location.state || adminIdd;
 const [checkPreferenceTag, setCheckPreferenceTag] = useState(true);
 const PreferenceTag = location.state?.PreferenceTag || prefenceTagg;


  React.useEffect(() => {
    getAllPreferenceTags();
    setCheckPreferenceTag(false);
  }, checkPreferenceTag); // Run the effect when PreferenceTag changes


 const getAllPreferenceTags =async() => {
  setLoading(true);
  const options = { apiPath: `/getAllPreferenceTags/${adminId}`, urlParam: adminId };
  const response = await NetworkService.get(options);
  setLoading(false);
  setSuccess(response.message);
  console.log(response);
  const PreferenceTaggg = response.tags;
  setPreferenceTagg(PreferenceTaggg);
  console.log(PreferenceTaggg,prefenceTagg);
  setTags(PreferenceTaggg.map(item =>item.tags));
};
console.log("preference",PreferenceTag);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTag('');  // Clear the input when dialog is closed
    setEditingTagIndex(null);  // Reset editing index
    setPrevTag('');  // Reset previous category

  };

  const handleSaveTag = async () => {
    // setCheckPreferenceTag(false);
    if (newTag.trim()) {
      if (editingTagIndex !== null) {
        console.log('prefenceTag',PreferenceTag);
        
        const tagId = PreferenceTag?.find(item => item.tags === prevTag)?._id;
        try {
            const options = {
              apiPath: `/updatePreferenceTagById/${tagId}`,
              body: {
                tags: newTag
              }
            }
              const response = await NetworkService.put(options);
              console.log(response);  // Success message from backend

              // Edit existing tag
              setTags((prevTags) => {
                const updatedTags = [...prevTags];
                updatedTags[editingTagIndex] = newTag;
                return updatedTags;
              });
              setCheckPreferenceTag(true);
            }catch (err) {
              if (err.response) {
                console.error('API Error:', err.message);
              } else {
                console.error('Unexpected Error:', err);
              }
            }
      } else {
            try{
              const options = {
                apiPath: '/createPreferenceTag/${adminId}',
                body: {
                  tags: newTag
                }
              }
              const response = await NetworkService.post(options);
              // Add new tag
              setTags((prevTags) => [...prevTags, newTag]);
              setCheckPreferenceTag(true);
            }catch (err) {
              if (err.response) {
                console.error('API Error:', err.message);
              } else {
                console.error('Unexpected Error:', err);
              }
          }
      }
    }
    handleClose();
  };

  const handleInputChange = (event) => {
    setNewTag(event.target.value); // Update the input value
  };

  const handleDeleteTag = async (index) => {
    const deletedId = PreferenceTag[index]?._id;
    console.log(deletedId)
    const options = {
      apiPath: `/deletePreferenceTagById/${deletedId}`,
      urlParam: deletedId
    }
    const response = await NetworkService.delete(options);
    console.log(response);
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));  // Remove the tag
  };

  const handleEditTag = (index) => {
    setNewTag(tags[index]);  // Set the tag to edit
    setEditingTagIndex(index);  // Store the index of the tag being edited
    setPrevTag(tags[index]);
    setOpen(true);  // Open the dialog for editing
  };

  return (

  
    <Box >
    {loading ? (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Adjust as needed
        }}
      >
        <CircularProgress color="error" size={100} />
      </Box>
    ) : (
      <>
        <Box className="tags-background">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "background.paper",
              borderRadius: "50px",
              padding: 2,
              boxShadow: 3,
              maxWidth: 400,
              margin: "0 auto",
              position: "relative",
            }}
          >
            <nav aria-label="main tags folders">
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  maxHeight: 700,
                  overflowY: "auto", // Ensures vertical scrolling
                  bgcolor: "background.paper",
                }}
                subheader={
                  <ListSubheader
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                      color: "red",
                      textAlign: "center",
                    }}
                  >
                    Preference Tags
                  </ListSubheader>
                }
              >
                {tags.map((tag, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ display: "flex", alignItems: "center" }}>
                      <ListItemButton>
                        <ListItemIcon>
                          <TagIcon sx={{ color: "primary.main" }} />
                        </ListItemIcon>
                        <ListItemText primary={tag} />
                      </ListItemButton>
                      <Box sx={{ display: "flex" }}> {/* Add a gap between the icons */}
                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditTag(index)} sx={{ color: "green" }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTag(index)} sx={{ color: "red" }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                    {index < tags.length - 1 && <Divider />} {/* Add divider after each item except the last */}
                  </React.Fragment>
                ))}
              </List>
              <Tooltip title="Create Preference Tag" arrow>
            <IconButton
                    onClick={handleClickOpen}
                    sx={{
                      width: 50,
                      height: 35,
                      marginLeft: 35,
                      marginTop: 2,
                      bgcolor: "red",
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
            {/* Plus Button */}
   
          </Box>
        </Box>

        {/* Dialog for creating or editing a tag */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingTagIndex !== null ? "Edit Preference Tag" : "Create a Usable Preference Tag"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="normal"
              id="name"
              name="name"
              label="Name"
              type="text"
              variant="outlined"
              value={newTag} // Bind the input value to state
              onChange={handleInputChange} // Handle input change
            />
          </DialogContent>
          <DialogActions>
            <Button sx={{ gap: 2 }} type="submit" variant="standard" onClick={handleSaveTag}>
              {editingTagIndex !== null ? "Update" : "Add"}
            </Button>
            <Button variant="standard" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )}
  </Box>
  );
}

export default Preferencetags;