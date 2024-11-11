import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadIcon from '@mui/icons-material/Upload';
import '../Guest/GuestHP.css';
import HomePageLogo from '../HomePageLogo.png';
import axios from 'axios';
import NetworkService from '../NetworkService';
import { useNavigate, useLocation } from 'react-router-dom';
import { Delete } from '@mui/icons-material';

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const { User, imageUrl } = location.state || {};
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const initialUsername = User.User?.username || User.username;
    const userId = User.User?._id || User._id;
    const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    const userType = User.User?.type || User.type;

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
            navigate('/change-password', { state: { userId: userId } });
        } else if (action === 'logout') {
            navigate('/login');
        }
    };

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            console.log('Uploading image:', formData);
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
            } catch (err) {
                console.error('Error uploading image:', err);
            }
        }
    };

    const handleRegisterClick = async (title) => {
        if (title === "My profile") {
            try {
                const options = { apiPath: `/getAdvertiser/${userId}` };
                const response = await NetworkService.get(options);
                setSuccess(response.message);
                navigate(`/viewAdvertiserProfile`, { state: { advertiser: response } });
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
            }

        } 
        else if (title === "Transportation"){
          try {
            // Construct the API path
            const apiPath = `http://localhost:3030/activity/user/${userId}/allActivities`;  // Ensure this matches your API route
            // Make the GET request using Axios
            const response = await axios.get(apiPath);
        
            // Log the response data
            console.log('API Response:', response);
        
            // Pass the fetched activities to the Activities page
            navigate(`/transportion`, { state: { allActivity: response.data ,id:userId} });
            
          } catch (err) {
            // Check if there is a response from the server and handle error
            if (err.response) {
              console.error('API Error:', err.message);
              setError(err.response.data.message);  // Display error message from the server
            } else {
              console.error('Unexpected Error:', err);
              setError('An unexpected error occurred.');  // Display generic error message
            }
          }
        }
        else {
            try {
                const apiPath = `http://localhost:3030/activity/user/${userId}/allActivities`;
                const response = await axios.get(apiPath);
                navigate(`/Activities`, { state: { allActivity: response.data, id: userId } });
            } catch (err) {
                setError(err.response ? err.response.data.message : 'An unexpected error occurred.');
            }
        }
    };

    const handleDeleteAccount = async () => {
        try {
          console.log(userId,userType);

          const options = {
              apiPath: `/requestDeletion/${userId}/${userType}`,
              useParams:userId,userType,
            };
          const response = await NetworkService.put(options);
          console.log(response);

          if (response.success) {
              setSuccess("Account deletion requested successfully.");
          } else {
              setError(response.message || "Account deletion request failed.");
          }
      } catch (err) {
          setError(err.response?.data?.message || "An error occurred while requesting account deletion.");
      }
    };

    return (
        <div className="homepage">
            <nav className="navbar">
                <div className="logo-container">
                    <img src={HomePageLogo} alt="ExploreInEase Logo" className="logo" />
                    <span className="website-name">ExploreInEase</span>
                </div>
                <div className="nav-links">
                    <button onClick={() => handleRegisterClick("Activities")} style={{ width: 160 }}>
                        CRUD Activities
                    </button>
                    <button  onClick={() => handleRegisterClick("Transportation")}
               style={{width:160}}>Create transportation</button>
                    <button onClick={() => handleRegisterClick("My profile")} style={{ width: 160 }}>
                        My profile
                    </button>
                    <div style={{ marginRight: 5, marginTop: 30, marginLeft: 30 }}>
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
                        <MenuItem onClick={() => handleMenuClick('changePassword')}>
                            <ListItemIcon>
                                <LockIcon fontSize="small" />
                            </ListItemIcon>
                            Change Password
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteAccount}>
                            <ListItemIcon>
                                <Delete fontSize="small" />
                            </ListItemIcon>
                            Delete my account
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
            {success && <Typography color="green">{success}</Typography>}
            {error && <Typography color="red">{error}</Typography>}
        </div>
    );
};

export default HomePage;
