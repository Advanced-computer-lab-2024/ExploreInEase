// src/components/TouristSignUp.js
import React, { useState } from 'react';

const TouristSignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    mobileNum: '',
    nation: '',
    dob: '',
    profession: '',
    type:''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const age = calculateAge(formData.dob);
    
    if (age < 18) {
      setError('You must be at least 18 years old to register as a tourist.');
      return;
    }

    setError('');
    setSuccess('Registration successful!');
    // Submit form data to the server (API call)
    console.log('Form data:', formData);
  };

  return (
    <div className="signup-form">
      <h2>Tourist Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>

      <label>Select Role:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          required
        >
          <option value="tourist">Tourist</option>
        
        </select>
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

        <label>Mobile Number:</label>
        <input
          type="tel"
          name="mobileNum"
          value={formData.mobileNum}
          onChange={handleInputChange}
          required
        />

        <label>Nationality:</label>
        <input
          type="text"
          name="nation"
          value={formData.nation}
          onChange={handleInputChange}
          required
        />

        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          required
        />

        <label>Job/Student:</label>
        <input
          type="text"
          name="profession"
          value={formData.profession}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Register as Tourist</button>
      </form>
    </div>
  );
};

export default TouristSignUp;
