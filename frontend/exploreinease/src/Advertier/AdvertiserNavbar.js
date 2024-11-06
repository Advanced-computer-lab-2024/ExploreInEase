// src/Shared/Components/GuestHP.js
import React,{ useState } from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; // Import the CSS file
import HomePageLogo from '../HomePageLogo.png';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios'; // Ensure Axios is imported
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const HomePage = () => {
    const navigate=useNavigate();
    const location = useLocation();
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const { User } = location.state || {};
    console.log(User);
    
     const initialUsername = User.User?.username || User.username;
   
     
    const userId=User.User?._id || User._id;
 

    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    const userType = User.type;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
     const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    async function handleRegisterClick(title) {
        if (title == "My profile"){
          try {
            const options = {
              apiPath: `/getAdvertiser/${userId}`,
            };
            
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log(response);
             navigate(`/viewAdvertiserProfile`,{state:{advertiser:response}});          
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
            // Construct the API path
            const apiPath = `http://localhost:3030/activity/user/${userId}/allActivities`;  // Ensure this matches your API route
            // Make the GET request using Axios
            const response = await axios.get(apiPath);
        
            // Log the response data
            console.log('API Response:', response);
        
            // Pass the fetched activities to the Activities page
            navigate(`/Activities`, { state: { allActivity: response.data ,id:userId} });
            
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
          <img
            src={HomePageLogo} // Use the imported logo
            alt="ExploreInEase Logo"
            className="logo"
          />
          <span className="website-name">ExploreInEase</span>
        </div>
        <div className="nav-links">
          <button  onClick={() => handleRegisterClick("Activities")}
              style={{width:160}}>CRUD Activities</button>
          <button  onClick={() => handleRegisterClick("My profile")}
               style={{width:160}}>My profile</button>
 
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
                        sx={{
                            bgcolor: 'darkblue',
                            color: 'white',
                            width: 56,
                            height: 56,
                            fontSize: 24,
                            cursor: 'pointer',
                            marginLeft: 2,
                        }}
                        onClick={handleAvatarClick}
                    >
                        {firstInitial}
                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleDeleteAccount}>Delete My Account</MenuItem>
                    </Menu>
                </div>
            </nav>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
  );
};

export default HomePage;