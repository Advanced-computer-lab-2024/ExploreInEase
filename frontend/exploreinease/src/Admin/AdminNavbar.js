// src/Shared/Components/GuestHP.js
import React from 'react';
import Avatar from '@mui/material/Avatar';
import '../Guest/GuestHP.css'; 
import HomePageLogo from '../HomePageLogo.png';
import { useNavigate } from 'react-router-dom';
const AdminNavbar = () => {
    const navigate=useNavigate();
    const initialUsername ="TAST";
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
    function handleClick(title) {
        if (title=="CRUD Activity Category"){
         navigate('/viewActivityCategory');
       }
       else if('CRUD Preference Tag') {
         navigate('/viewPreferencatags');
       }
       else if('View Products') {
        navigate('/viewProduct');
       }
       else  if ('Add User') {
        navigate('/viewAddedUsers');
       }
       else if("Delete Account") {
        navigate('/viewAllUserProfiles');
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
          <button  onClick={() => handleClick("CRUD Activity Category")}
               className="small-button">CRUD Activity Category</button>
          <button  onClick={() => handleClick("CRUD Preference Tag")}
               className="small-button">CRUD Preference Tag</button>
          <button  onClick={() => handleClick("Add User")}
               className="small-button">Add User</button>
          <button  onClick={() => handleClick("Delete Account")}
               className="small-button">Delete Account</button>
          <button  onClick={() => handleClick("View Products")}
               className="small-button ">View Products</button>
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

export default AdminNavbar;