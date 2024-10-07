import * as React from 'react';
import { useLocation } from "react-router-dom";
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

function Tags() {
  const location = useLocation();
  const [tags, setTags] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newTag, setNewTag] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTag('');  // Clear the input when dialog is closed
  };

  const handleSaveTag = () => {
    if (newTag.trim()) {
      setTags((prevTags) => [...prevTags, newTag]);
    }
    handleClose();
  };

  const handleInputChange = (event) => {
    setNewTag(event.target.value); // Update the input value
  };

  return (
    <div>
      {/* Button outside of the box */}
      <Button variant="contained" onClick={handleClickOpen}  sx={{width:200, marginLeft: 2,marginTop:2,height:50}} >
        Create Tag
      </Button>
      <Box
        sx={{
          maxWidth: 360,
          bgcolor: 'white',
          border: '1px solid #ccc', // Add border
          marginTop: 4, // Add top margin
          borderRadius: 1, // Slight border radius for aesthetics
          padding: 2 // Add padding inside the box
        }}
      >
        {/* Dialog for creating a new tag */}
        <Dialog open={open} onClose={handleClose} 
                    
        >
          <DialogTitle>Create a usable Tag</DialogTitle>
          <DialogContent>
            <TextField
                required
              margin="normal"
              sx={{minHeight:100}}
              id="name"
              name="name"
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newTag} // Bind the input value to state
              onChange={handleInputChange} // Handle input change
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={handleSaveTag}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <nav aria-label="main tags folders" >
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader
                sx={{
                  fontWeight: 'bold', 
                  fontSize: '1.25rem', 
                  color:'red'
                }}
              >
                Tags
              </ListSubheader>
            }
          >
            {tags.map((tag, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{marginLeft:6}}>
                  <ListItemButton>
                    <ListItemText primary={tag} />
                  </ListItemButton>
                </ListItem>
                {index < tags.length - 1 && <Divider />} 
              </React.Fragment>
            ))}
          </List>
        </nav>
      </Box>
    </div>
  );
}

export default Tags;
