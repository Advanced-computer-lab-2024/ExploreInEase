// src/components/GuideAdvertiserSignUp.js
import React, { useState,useEffect } from 'react';
import './Signup.css';
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom';

import { useLocation } from 'react-router-dom';
const GuideAdvertiserSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    type: 'tourGuide' // default selection
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.type== "tourGuide"){
        try {
          const options = {
            apiPath: '/register/tourGuide',
            body: {
              email: formData.email,
              username: formData.username,
              password: formData.password,
            }
          };
          const response =await NetworkService.post(options);
          setSuccess(response.message); // Set success message
          const user=response.User;
           navigate(`/TourGuideHomePage`,{state:{user}});
           console.log(response);
           } catch (err) {
          if (err.response) {
             setError(err.response.data.message);
          } else {
            setError('An unexpected error occurred.');
          }
        }
    }
    else if (formData.type== "seller"){
      try {
        const options = {
          apiPath: '/register/seller',
          body: {
            email: formData.email,
            username: formData.username,
            password: formData.password,
          }
        };
        
        const response =await NetworkService.post(options);
        const username=response.User.username;
        setSuccess(response.message); // Set success message
        navigate(`/SellerHomePage`,{state:{username:username}});

        } catch (err) {
        if (err.response) {
           setError(err.response.data.message); // Set error message from server response if exists
        } else {
           setError('An unexpected error occurred.'); // Generic error message
        }
      }
    }
    else {
      try {
        const options = {
          apiPath: '/register/advertiser',
          body: {
            email: formData.email,
            username: formData.username,
            password: formData.password,
          }
        };
        
        const response =await NetworkService.post(options);
        const username=response.User.username;
        setSuccess(response.message); // Set success message
        navigate(`/AdvertiserHomePage`,{state:{username:username}});

      } catch (err) {
        if (err.response) {
           setError(err.response.data.message); // Set error message from server response if exists
        } else {
          setError('An unexpected error occurred.'); // Generic error message
        }
      }
    }

  };

  return (
    <div className="signup-form">
      <h2>Sign Up as Tour Guide / Advertiser / Seller</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        <label>Select Role:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          required
        >
          <option value="tourGuide">Tour Guide</option>
          <option value="advertiser">Advertiser</option>
          <option value="seller">Seller</option>
        </select>

        <button type="submit" className="blue-button">
          Register as {formData.type === 'tourGuide' ? 'Tour Guide' : formData.type === 'advertiser' ? 'Advertiser' : 'Seller'}
        </button>
      </form>
    </div>
  );
};

export default GuideAdvertiserSignUp;