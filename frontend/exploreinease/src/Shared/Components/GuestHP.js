// src/Shared/Components/GuestHP.js
import React from 'react';
import logo from './logo.png'; // Adjust the path as needed
import './GuestHP.css'; // Import the CSS file

const HomePage = () => {
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo-container">
          <img
            src={logo} // Use the imported logo
            alt="ExploreInEase Logo"
            className="logo"
          />
          <span className="website-name">ExploreInEase</span>
        </div>
        <div className="nav-links">
          <a href="https://www.google.com/">Register</a>
          <a href="https://www.google.com/">Upload Required Documents</a>
          <a href="https://www.google.com/">View Step-by-Step Guide</a>
          <a href="https://www.google.com/">Activity Categories</a>
        </div>
        <div className="currency-selector">
          <span className="currency-symbol">Currency:</span>
          <select>
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
            <option value="egp">EGP (ج.م)</option>
          </select>
        </div>
        <div className="avatar-container">
          <img
            src="path/to/your/avatar.png" // Replace with your avatar path
            alt="User Avatar"
            className="avatar"
          />
        </div>
      </nav>
      {/* Other homepage content goes here */}
    </div>
  );
};

export default HomePage;
