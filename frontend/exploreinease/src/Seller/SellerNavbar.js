import React from 'react';
import HomePageLogo from '../HomePageLogo.png';
import '../Guest/GuestHP.css';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
   const location=useLocation();
    const navigate = useNavigate();
    const { tourist } = location.state || {};
    const initialUsername = tourist?.username;
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    function handleClick(title) {
       if (title=="My Profile"){
        navigate('/viewSellerProfile');
      }
      else {
        navigate('/viewProduct');
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
            sx={{
              bgcolor: 'darkblue',
              color: 'white',
              width: 56,
              height: 56,
              fontSize: 24,
              marginLeft: 2,
            }}
          >
            {firstInitial}
          </Avatar>
        </div>
      </nav>
      {/* Other homepage content goes here */}
    </div>
  );
};

export default HomePage;