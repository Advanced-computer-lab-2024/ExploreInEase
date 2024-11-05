import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import HomePageLogo from '../HomePageLogo.png';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const TouristNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { User } = location.state || {};
    const [success,setSuccess]=useState();
    const [error,setError]=useState();
    const userType = User.type;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const initialUsername = User?.username;
     const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
     const userId=User?._id;

     
     const handleAvatarClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };  
    async function handleRegisterClick(title) {
        if (title == "View Products") {
            try {
                const options = {
                  apiPath: `/getAvailableProducts/${userId}`,
                };
                
                const response = await NetworkService.get(options);
                setSuccess(response.message); // Set success message
                console.log(response);
                const Product=response.Products;
                const Type='tourist';
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
      else if (title=="My Profile"){
        try {
            const options = {
              apiPath: `/getTourist/${userId}`,
            };
            
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log(response);
            navigate(`/viewTouristProfile`,{state:{Tourist:response}});
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
              apiPath: `/upcomingEvents`,
            };
            const response = await NetworkService.get(options);
            setSuccess(response.message); // Set success message
            console.log(response);
            const events=response;
            navigate(`/explore`,{state:{events}});          
          } catch (err) {
            if (err.response) {
                console.log(err.message);
              setError(err.response.data.message); // Set error message from server response if exists
            } else {
              setError('An unexpected error occurred.'); // Generic error message
            }
          }
        // navigate('/explore');
      }
      }
      const handleDeleteAccount = async () => {
        handleClose();
        try {
            const options = {
                apiPath: '/requestDeletion',
                method: 'PUT',
                data: { userId, userType },
            };
            const response = await NetworkService.request(options);

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
          <button onClick={() => handleRegisterClick("Explore Activities and Itineraries and Historical Places")}
              className="small-button">Explore Activities and Itineraries and Historical Places</button>
          <button onClick={() => handleRegisterClick("View Products")}
              className="small-button">View Products</button>
          <button 
          onClick={() => handleRegisterClick("My Profile")}
          className="small-button">My Profile</button>
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

export default TouristNavbar;