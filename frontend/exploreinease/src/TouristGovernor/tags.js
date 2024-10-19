import React ,{useEffect} from 'react';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios'; // Ensure Axios is imported

function Tags() {
  const location = useLocation();
  const { governorId } = location.state || {};
  const [tags, setTags] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [tagType, setTagType] = React.useState('');  // State for tag type
  const [period, setPeriod] = React.useState('');    // State for period

  useEffect(() => {
    getAllTags();
  }, []);
  
  const getAllTags=async ()=>{
    try {
      const apiPath = `http://localhost:3030/getAllHistoricalTags/${governorId}`;  // Ensure this matches your API route
      const response = await axios.get(apiPath);
      console.log(response.data.tags);
      
      if (Array.isArray(response.data.tags)) {
        const tags = response.data.tags.map(tag => ({
          id: tag._id,
          tagType: tag.type,
        period:tag.period
        }));
        setTags(tags);    
          
      } else {
        console.error('Unexpected data format from API');
      }
      
    } catch (err) {
      // Check if there is a response from the server and handle error
      if (err.response) {
        console.error('API Error:', err.message);
        // setError(err.response.data.message);  // Display error message from the server
      } else {
        console.error('Unexpected Error:', err);
        // setError('An unexpected error occurred.');  // Display generic error message
      }
    }
  }


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTagType('');
    setPeriod('');
  };

  const handleSaveTag = async () => {
    if (tagType && period.trim()) {
      const body = {
        type: tagType,
        period: period
      };
      console.log(body);
      console.log(governorId);
      
      const apiPath = `http://localhost:3030/createHistoricalTag/${governorId}`;
      
      try {
        const response = await axios.post(apiPath, body);
        console.log(response);
        getAllTags();
        handleClose();
      } catch (error) {
        console.error('Error while saving the tag:', error);
      }
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} sx={{ width: 200, marginLeft: 2, marginTop: 2, height: 50 }}>
        Create Tag
      </Button>
      <Box
        sx={{
          maxWidth: 360,
          bgcolor: 'white',
          border: '1px solid #ccc',
          marginTop: 4,
          borderRadius: 1,
          padding: 2
        }}
      >
        {/* Dialog for creating a new tag */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create a usable Tag</DialogTitle>
          <DialogContent>
            {/* Replace TextField with Select for the tagType */}
            <InputLabel id="tags-label">type</InputLabel>
            <Select
              required
              labelId="tags-label"
              id="type"
              margin="dense"
              name="type"
              fullWidth
              value={tagType}
              onChange={(e) => setTagType(e.target.value)}
            >
              <MenuItem value="monuments">Monuments</MenuItem>
              <MenuItem value="museums">Museums</MenuItem>
              <MenuItem value="religious">Religious </MenuItem>
              <MenuItem value="sites">Sites</MenuItem>
              <MenuItem value="palaces">Palaces</MenuItem>
              <MenuItem value="castles">Castles</MenuItem>
              <MenuItem value="palaces/castles">Palaces/Castles</MenuItem>
            </Select>

            <TextField
              required
              margin="normal"
              id="period"
              name="period"
              label="Period"
              type="text"
              fullWidth
              variant="outlined"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" onClick={handleSaveTag}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <nav aria-label="main tags folders">
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'red' }}>
                Tags
              </ListSubheader>
            }
          >
            {tags.map((tag, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ marginLeft: 6 }}>
                  <ListItemButton>
                    <ListItemText
                      primary={`Type: ${tag.tagType}`}
                      secondary={`Period: ${tag.period}`}
                    />
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
