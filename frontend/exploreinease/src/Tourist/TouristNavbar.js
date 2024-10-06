import React from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
const TouristNavbar = () => {
    const navigate = useNavigate();
    const initialUsername ="TAST";
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    function handleRegisterClick(title) {
        if (title == "View Products"){
            navigate('/viewProduct');
        }
      else if (title=="My Profile"){
        navigate('/viewTouristProfile');
      }
      else {
        navigate('/explore');

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
              marginLeft: 2,
            }}
          >
            {firstInitial}
          </Avatar>
        </div>
      </nav>
    </div>
  );
};

export default TouristNavbar;