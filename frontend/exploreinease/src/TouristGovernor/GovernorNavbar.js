// src/Shared/Components/GuestHP.js
 import React ,{useState}from 'react';
 import Avatar from '@mui/material/Avatar';
 import '../Guest/GuestHP.css'; 
 import HomePageLogo from '../HomePageLogo.png';
 import axios from 'axios'; 
 import List from '@mui/material/List';
 import LogoutIcon from '@mui/icons-material/Logout';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import LockIcon from '@mui/icons-material/Lock';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
 import NetworkService from '../NetworkService';
 import { useNavigate } from 'react-router-dom';
 import { useLocation } from 'react-router-dom'; 

const GovernorNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { tourist } = location.state || {};
    const {error,setError}=useState();
    const {success,setSuccess}=useState();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const initialUsername = tourist?.username;
    const governorId=tourist?._id;
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    console.log(governorId);
    const avatarImage="";
    async function handleRegisterClick(title) {
       if (title=="Create Historical Locations Tags") {
          navigate(`/viewHistoricalTags`,{state:{governorId}});          
       }
      else {
        try{
            const options = 
            {
              apiPath: `/historical-places/${governorId}/allHistoricalPlaces`,
            };
            const response1 = await NetworkService.get(options);
            // setSuccess(response.message); // Set success message
            const response = response1.filter(item=>item.created_by.toString()===governorId);
            navigate(`/HistoricalPlaces`,{state:{governorId,response}});   
          } 
        catch {
          console.log('An unexpected error occurred.'); // Generic error message
        }       
      }
      };
      const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo-container">
          <img
            src={HomePageLogo} // Use the imported logo
            alt="ExploreInEase Logo"
            className="logo"
          />
          <span className="website-name">ExploreInEase</span>
        </div>
        <div 
                    className="currency-selector" 
                    style={{ 
                        position: 'absolute', 
                        left: '80%', 
                        transform: 'translateX(-50%)' 
                    }}
                >
                        <label htmlFor="currency-select" style={{ marginRight: '8px' }}><strong>Choose Currency:</strong></label>

                    <select id="currency-select" className="currency-dropdown">
                        <option value="usd">USD ($)</option>
                        <option value="eur">EUR (€)</option>
                        <option value="egp">EGP (ج.م)</option>
                    </select>
                </div>


                <IconButton 
  onClick={toggleDrawer(true)} 
  className="menu-button" 
  style={{ 
    position: 'absolute', 
    right: '40px', 
    color: 'white',      // Icon color
    backgroundColor: '#3f51b5' // Background color
  }}
>
  <MenuIcon />
</IconButton>
</nav>
<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} style={{width: drawerOpen ? '700px' : '300px'}}>
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'darkblue', color: 'white' }} src={avatarImage || undefined}>
                  {avatarImage ? '' : firstInitial}
              </Avatar>
              <Typography variant="h6" style={{ marginLeft: '10px' }}>{tourist.username}</Typography>
          </div>
          <Divider />
          <List>
  <Typography variant="h6" style={{ padding: '8px 16px' }}><strong>Account</strong></Typography>
  <ListItem button onClick={() => handleRegisterClick('changePassword')}>
    <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
      <LockIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Change Password" />
  </ListItem>
  <ListItem button onClick={() => handleRegisterClick('logout')}>
    <ListItemIcon style={{ minWidth: '0px', marginRight: '8px' }}>
      <LogoutIcon fontSize="small" />
    </ListItemIcon>
    <ListItemText primary="Logout" />
  </ListItem>
</List>

          <Divider />
          <List>
              <Typography variant="h6" style={{ padding: '8px 16px' }}><strong>Pages</strong></Typography>
              {[
                  "Create Historical Locations Tags",
                  "CRUD Historical Places",
              ].map((text) => (
                  <ListItem key={text} disablePadding>
                      <ListItemButton onClick={() => handleRegisterClick(text)}>
                          <ListItemText primary={text} />
                      </ListItemButton>
                  </ListItem>
              ))}
          </List>
      </Drawer>
      {/* Other homepage content goes here */}
    </div>
  );
};


export default GovernorNavbar;