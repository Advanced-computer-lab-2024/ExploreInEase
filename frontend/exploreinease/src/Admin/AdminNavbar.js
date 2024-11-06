// src/Shared/Components/GuestHP.js
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import '../Guest/GuestHP.css'; 
import NetworkService from '../NetworkService';
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { tourist } = location.state || {};
    console.log("Touristtt", tourist)
    const username = tourist?.username;
    const adminId = tourist?._id;
    console.log(adminId)

    const initialUsername = username;
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
           navigate('/change-password', { state: { userId: adminId } });;
        } else if (action === 'logout') {
           navigate('/login');
        }
     };

    async function handleClick(title) {
        try {
            let options = {};
            let response;
            
            if (title === "CRUD Activity Category") {
                options = { apiPath: `/getAllCategories/admin` };
                response = await NetworkService.get(options);
                setSuccess(response.message);
                console.log("response for activities from navbar",response);
                const allcategories = response;        
                navigate('/viewActivityCategory', { state: { allcategories,adminId } });
            } 
            else if (title === "CRUD Preference Tag") {
                options = { apiPath: `/getAllPreferenceTags/${adminId}`, urlParam: adminId };
                response = await NetworkService.get(options);
                setSuccess(response.message);
                console.log(response);
                const PreferenceTag = response.tags;
                console.log(PreferenceTag);

                navigate('/viewPreferencatags', { state: { PreferenceTag,adminId } });
            } 
            else if (title === "View Products") {
                console.log(adminId)
                options = { apiPath: `/getAvailableProducts/${adminId}`, urlParam: adminId };
                response = await NetworkService.get(options);
                setSuccess(response.message);
                console.log(response);
                const Product = response.Products;
                const Type = 'admin';
                console.log(tourist)
                navigate('/viewProduct', { state: { Product, Type ,User:tourist} });
            } 
            else if (title === "Add User") {
                navigate('/AddUser');
            } 
            else if (title === "Delete Account") {
              try{
              options = { apiPath: `/fetchAllUsersAndTourists/${adminId}`, urlParam: adminId };        
                response = await NetworkService.get(options);
                setSuccess(response.message);
                console.log(response);
                const allUsers = response;
                navigate('/viewAllUserProfiles', { state: { Product: allUsers, AdminId: adminId } });} 
              catch (err) {
                if (err.response) {
                    console.error(err.message);
                    setError(err.response.data.message);
                } else {
                    console.error('An unexpected error occurred.', err);
                    setError('An unexpected error occurred.'); // Generic error message
                }
              }
            }
            else if (title === "UnArchive Products") {
                options = { apiPath: `/unArchiveProducts/${adminId}` };
                response = await NetworkService.get(options);
                setSuccess(response.message);
                console.log(response);
                const Product = response.Products;
                const Type = 'admin';
                navigate('/unArchiveProduct', { state: { Product, Type, User:tourist } });
            }
            else {
                options = { apiPath: `/getAvailableProducts/${adminId}` };
                response = await NetworkService.get(options);
                setSuccess(response.message);
                console.log(response);
                const Product = response.Products;
                const Type = 'tourist';
                navigate('/viewProduct', { state: { Product, Type } });
            }
        } catch (err) {
            if (err.response) {
                console.error(err.message);
                setError(err.response.data.message);
            } else {
                console.error('An unexpected error occurred.', err);
                setError('An unexpected error occurred.'); // Generic error message
            }
        }
    }

    return (
        <div className="homepage">
            <nav className="navbar">
                <div className="logo-container">
                    <img
                        src={HomePageLogo}
                        alt="ExploreInEase Logo"
                        className="logo"
                    />
                    <span className="website-name">ExploreInEase</span>
                </div>
                <div className="nav-links">
                    <button onClick={() => handleClick("unArchive Products")} className="small-button"> View UnArchive Products</button>
                    <button onClick={() => handleClick("CRUD Activity Category")} className="small-button">CRUD Activity Category</button>
                    <button onClick={() => handleClick("CRUD Preference Tag")} className="small-button">CRUD Preference Tag</button>
                    <button onClick={() => handleClick("Add User")} className="small-button">Add User</button>
                    <button onClick={() => handleClick("Delete Account")} className="small-button">Delete Account</button>
                    <button onClick={() => handleClick("View Products")} className="small-button">View Products</button>
                </div>
                <div className="currency-selector">
                    <span className="currency-symbol"></span>
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
            {/* Display success or error messages */}
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}
            {/* Other homepage content goes here */}
        </div>
    );
};

export default AdminNavbar;