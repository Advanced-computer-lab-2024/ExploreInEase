// src/Shared/Components/GuestHP.js
import React from 'react';
import './GuestHP.css'; // Import the CSS file
import Avatar from '@mui/material/Avatar';
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate(); // Hook for navigation
  const initialUsername ="TAST";
  const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
  function handleLoginClick(){
    navigate('/Login');
  }
  async function handleRegisterClick(title){
    if (title == "Register"){
    navigate('/register'); 
  }
  else if (title=="Activity Categories"){
    const response= await axios.get('http://localhost:3030/upcomingEvents')
    const events=response.data;
    navigate('/explore',{state:{events:events}});
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
        <button
     onClick={() => handleLoginClick()}
  className="small-button"
        >
          Login
        </button>
        <div className="nav-links">
        <button 
         onClick={() => handleRegisterClick("Register")}
          className="small-button"
         >Register</button>
          <button 
           className="small-button">Upload Required Documents</button>
          <button  className="small-button">View Step-by-Step Guide</button>
          <button onClick={() => handleRegisterClick("Activity Categories")}  className="small-button">Activity Categories</button>
        </div>
        <div className="currency-selector">
          <span className="currency-symbol"></span>
          <select>
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
            <option value="egp">EGP (ج.م)</option>
          </select>
        </div>
        {/* <div className="avatar-container">
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
        </div> */}
      </nav>
      {/* Other homepage content goes here */}
    </div>
  );
};

export default HomePage;