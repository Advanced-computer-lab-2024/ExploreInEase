import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import HomePageLogo from '../HomePageLogo.png';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom'; 
import '../Guest/GuestHP.css'; 

const GovernorNavbar = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { tourist } = location.state || {};
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);

   const initialUsername = tourist?.username;
   const governorId = tourist?._id;
   const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';

   const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const handleMenuClick = (action) => {
      handleMenuClose();
      if (action === 'changePassword') {
         navigate('/change-password', { state: { userId: governorId } });;
      } else if (action === 'logout') {
         navigate('/login');
      }
   };

   async function handleRegisterClick(title) {
      if (title === "Create Historical Locations Tags") {
         navigate(`/viewHistoricalTags`, { state: { governorId } });          
      } else {
         try {
            const options = { apiPath: `/historical-places/${governorId}/allHistoricalPlaces` };
            const response1 = await NetworkService.get(options);
            const response = response1.filter(item => item.created_by.toString() === governorId);
            navigate(`/HistoricalPlaces`, { state: { governorId, response } });   
         } catch {
            console.log('An unexpected error occurred.');
         }       
      }
   }

   return (
      <div className="homepage">
         <nav className="navbar">
            <div className="logo-container">
               <img src={HomePageLogo} alt="ExploreInEase Logo" className="logo" />
               <span className="website-name">ExploreInEase</span>
            </div>
            <div className="nav-links">
               <button onClick={() => handleRegisterClick("CRUD Historical Places and Museums")} className="small-button">
                  CRUD Historical Places and Museums
               </button>
               <button onClick={() => handleRegisterClick("Create Historical Locations Tags")} className="small-button">
                  Create Historical Locations Tags
               </button>
            </div>
            <div className="currency-selector">
               <select>
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="egp">EGP (ج.م)</option>
               </select>
            </div>
            <div className="avatar-container">
               <Avatar
                  sx={{ bgcolor: 'darkblue', color: 'white', width: 48, height: 48, fontSize: 20, cursor: 'pointer' }}
                  onClick={handleMenuOpen}
               >
                  {firstInitial}
               </Avatar> 
               <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                     elevation: 3,
                     sx: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                     },
                  }}
               >
                  <Typography variant="h6" sx={{ padding: '8px 16px', fontWeight: 600 }}>
                     Account
                  </Typography>
                  <Divider />
                  <MenuItem onClick={() => handleMenuClick('changePassword')}>
                     <ListItemIcon>
                        <LockIcon fontSize="small" />
                     </ListItemIcon>
                     Change Password
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuClick('logout')}>
                     <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                     </ListItemIcon>
                     Logout
                  </MenuItem>
               </Menu>
            </div>
         </nav>
         {/* Other homepage content goes here */}
      </div>
   );
};

export default GovernorNavbar;
