import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './AddUser.css'; // Import the CSS file for styling
import axios from "axios";

// MUI Imports
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';

const CreatePromo = () => {
  const navigate = useNavigate();
  const [promo, setPromo] = useState('');
  const [promoCodesList, setPromoCodesList] = useState([]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(null);

  const handleInputChange = (e) => {
    setPromo(e.target.value);
  };

  useEffect(() => {
    const getPromoCodes = async () => {
      try {
        const response = await axios.get('http://localhost:3030/getPromoCodes');
        console.log(response.data);
        setPromoCodesList(response.data.promoCodes);
      } catch (error) {
        console.error(error);
      }
    };
    getPromoCodes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { promoCode: promo };
    
    await axios.post('http://localhost:3030/creatingPromoCode', body)
      .then((response) => {
        console.log(response.data);
        setShowSuccess(true);
        // Re-fetch promo codes if needed
      })
      .catch((error) => {
        setShowError(error.message);
      });
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: 600, 
        margin: '0 auto', 
        marginTop: 4, 
        padding: 2, 
        bgcolor: '#f9f9f9', 
        borderRadius: 1 
      }}
    >
      <form onSubmit={handleSubmit}>
        <h2>Create Promo Code</h2>
        <label>
          <input
            type="text"
            value={promo}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <button type="submit">Create</button>

        {showSuccess && (
          <div className="success-popup">Promo Code created successfully!</div>
        )}

        {showError && (
          <div className="error-popup">{showError}</div>
        )}
      </form>

      {/* Promo Codes Box appears directly under the form */}
      <Box
        sx={{
          bgcolor: 'white',
          border: '1px solid #ccc',
          marginTop: 4,
          borderRadius: 1,
          padding: 2
        }}
      >
        <nav aria-label="promo codes">
          <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            subheader={
              <ListSubheader
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: 'black'
                }}
              >
                Available Promo Codes
              </ListSubheader>
            }
          >
            {promoCodesList.map((code, index) => (
              <React.Fragment key={code._id}>
                <ListItem
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <ListItemText primary={code.promoCodes} />
                </ListItem>
                {index < promoCodesList.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </nav>
      </Box>
    </Box>
  );
};

export default CreatePromo;
