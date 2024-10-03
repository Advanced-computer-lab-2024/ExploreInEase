// src/components/GuideAdvertiserSignUp.js
import React, { useState } from 'react';
import './Signup.css';

const GuideAdvertiserSignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Registration successful!');
    // Submit form data to the server (API call)
    console.log('Form data:', formData);
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

        <button type="submit">Register as Guide/Advertiser/Seller</button>
      </form>
    </div>
  );
};

export default GuideAdvertiserSignUp;
