// src/Shared/Components/GuestHP.js
import React from 'react';
import logo from './logo.png'; // Adjust the path as needed
import './HP.css'; // Import the CSS file

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
          <a href="https://www.google.com/">CRUD Activity Category</a>
          <a href="https://www.google.com/">CRUD Preference Tag</a>
          <a href="https://www.google.com/">Add User</a>
          <a href="https://www.google.com/">Delete Account</a>
          <a href="https://www.google.com/">View Products</a>
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