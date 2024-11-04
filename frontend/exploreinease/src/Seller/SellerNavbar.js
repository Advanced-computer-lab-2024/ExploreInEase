import React, { useState, useEffect } from 'react';
import HomePageLogo from '../HomePageLogo.png';
import '../Guest/GuestHP.css';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import UploadIcon from '@mui/icons-material/Upload';

const HomePage = () => {
   const location=useLocation();
    const navigate = useNavigate();
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const { User, imageUrl } = location.state || {};
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

        const initialUsername = User.User?.username || User.username;
    const userId = User.User?._id || User._id;
    const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';

    // Retrieve avatar URL from localStorage or fallback to the default avatar
    const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
    const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);

    useEffect(() => {
      // Update the avatar URL when the component mounts if a new image URL exists
      if (savedAvatarUrl || imageUrl) {
          setAvatarImage(savedAvatarUrl || `http://localhost:3030/images/${imageUrl}`);
      } else {
          setAvatarImage(defaultAvatarUrl);
      }
  }, [imageUrl, savedAvatarUrl, defaultAvatarUrl]);
   
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const handleMenuClick = (action) => {
      handleMenuClose();
      if (action === 'changePassword') {
         navigate('/change-password', { state: { userId: userId } });;
      } else if (action === 'logout') {
         navigate('/login');
      }
   };

   const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`http://localhost:3030/uploadImage/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Image uploaded successfully:', response);
            const uploadedImageUrl = response.data.imageUrl;
            
            // Update avatarImage and save the URL in localStorage
            setAvatarImage(uploadedImageUrl);
            localStorage.setItem(`${userId}`, uploadedImageUrl);
            setSuccess('Image uploaded successfully!');
        } catch (err) {
            console.error('Error uploading image:', err);
            setError(err.response ? err.response.data.error : 'Failed to upload image. Please try again.');
        }
    }
};
   
    async function handleClick(title) {
       if (title=="My Profile"){
        try {
          const options = {
            apiPath: `/getSeller/${userId}`,
          };
          
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          const tourist=response.seller;
          console.log(response.seller);
          navigate(`/viewSellerProfile`,{state:{tourist:response.seller}});     

        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
      else {
        try {
          const options = {
            apiPath: `/getAvailableProducts/${userId}`,
          };
          const response = await NetworkService.get(options);
          setSuccess(response.message); // Set success message
          console.log(response);
          const Product=response.Products;
          const Type='Seller';
          navigate(`/viewProduct`,{ state: { Product, Type ,User:User} });          
        } catch (err) {
          if (err.response) {
              console.log(err.message);
            setError(err.response.data.message); // Set error message from server response if exists
          } else {
            setError('An unexpected error occurred.'); // Generic error message
          }
        }
      }
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
        <div className="nav-links">
          <button onClick={() => handleClick("View List of Available Products")}
              className="small-button">View List of Available Products</button>
          <button onClick={() => handleClick("Add Product")}
              className="small-button">Add Product</button>
          <button onClick={() => handleClick("Edit Product")}  
           className="small-button"
            >Edit Product</button>
          <button 
          onClick={() => handleClick("My Profile")}
          className="small-button">My Profile</button>
       
        <div style={{marginRight:5,marginTop:30,marginLeft:30}}>
          <span className="currency-symbol"></span>
          <select>
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
            <option value="egp">EGP (ج.م)</option>
          </select>
        </div>
        </div>
        <div className="avatar-container">
                    <Avatar
                        sx={{ bgcolor: 'darkblue', color: 'white', width: 48, height: 48, fontSize: 20, cursor: 'pointer' }}
                        onClick={handleMenuOpen}
                        src={avatarImage ? avatarImage : undefined}
                    >
                        {avatarImage ? '' : defaultAvatarUrl}
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
                        <MenuItem component="label">
                            <ListItemIcon>
                                <UploadIcon fontSize="small" />
                            </ListItemIcon>
                            Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarUpload}
                            />
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

export default HomePage;