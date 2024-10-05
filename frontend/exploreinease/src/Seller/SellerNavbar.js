// src/Shared/Components/GuestHP.js
import React from 'react';
import HomePageLogo from '../HomePageLogo.png';
import '../Guest/GuestHP.css'; // Import the CSS file
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    const navigate = useNavigate();
    const initialUsername ="TAST";
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
          <button onClick={() => handleClick("View List of Available Products")}>View List of Available Products</button>
          <button onClick={() => handleClick("Add Product")}>Add Product</button>
          <button onClick={() => handleClick("Edit Product")}>Edit Product</button>
          <button onClick={() => handleClick("My Profile")}>My Profile</button>
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