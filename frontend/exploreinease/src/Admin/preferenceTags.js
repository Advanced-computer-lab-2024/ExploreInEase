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

function Preferencetags() {
  const [tags, setTags] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [newTag, setNewTag] = React.useState('');
  const [editingTagIndex, setEditingTagIndex] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTag('');  // Clear the input when dialog is closed
    setEditingTagIndex(null);  // Reset editing index
  };

  const handleSaveTag = () => {
    if (newTag.trim()) {
      if (editingTagIndex !== null) {
        // Edit existing tag
        setTags((prevTags) => {
          const updatedTags = [...prevTags];
          updatedTags[editingTagIndex] = newTag;
          return updatedTags;
        });
      } else {
        // Add new tag
        setTags((prevTags) => [...prevTags, newTag]);
      }
    }
    handleClose();
  };

  const handleInputChange = (event) => {
    setNewTag(event.target.value); // Update the input value
  };

  const handleDeleteTag = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));  // Remove the tag
  };

  const handleEditTag = (index) => {
    setNewTag(tags[index]);  // Set the tag to edit
    setEditingTagIndex(index);  // Store the index of the tag being edited
    setOpen(true);  // Open the dialog for editing
  };

  return (
    <div>
      {/* Button outside of the box */}
      <Button variant="contained" onClick={handleClickOpen} sx={{ marginLeft: 2, marginTop: 2, height: 50,width:300 }}>
        Create Preference Tag
      </Button>
      
      <Box
        sx={{
          minWidth:100,
          bgcolor: 'white',
          border: '1px solid #ccc', // Add border
          marginRight:8,
          marginLeft:8,

          marginTop: 4, // Add top margin
          borderRadius: 1, // Slight border radius for aesthetics
          padding: 2 // Add padding inside the box
        }}
      >
        {/* Dialog for creating or editing a tag */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editingTagIndex !== null ? 'Edit Preference Tag' : 'Create a usable Preference Tag'}</DialogTitle>
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
            <Button sx={{gap:2}} type="submit" variant='standard' onClick={handleSaveTag}>
              {editingTagIndex !== null ? 'Update' : 'Add'}
            </Button>
            
            <Button variant='standard' onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Display the list of existing tags */}
        <nav aria-label="main tags folders">
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
                Preference Tags
              </ListSubheader>
            }
          >
            {tags.map((tag, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{ marginLeft: 6, display: 'flex', justifyContent: 'space-between' }}
                >
                  <ListItemButton>
                    <ListItemText primary={tag} />
                  </ListItemButton>
                  {/* Icons for editing and deleting with styles */}
                  <Box sx={{ display: 'flex', gap: 1 }}> {/* Add a gap between the icons */}
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditTag(index)} sx={{ color: 'green' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTag(index)} sx={{ color: 'red' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < tags.length - 1 && <Divider />} {/* Add divider after each item except the last */}
              </React.Fragment>
            ))}
          </List>
        </nav>
      </Box>
    </div>
  );
}

export default Preferencetags;
