// src/components/SignIn.js
import React, { useState } from 'react';
import './SignIn.css';



const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'  // Default role set to 'tourist'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for email, password, and role
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    // Check for roles: admin or tourist governor
    if (formData.role == 'admin') {
      if (formData.email == 'admin' && formData.password == 'admin') {
        setSuccess('Sign-in successful! Welcome, Admin.');
        setError('');
      } else {
        setError('Invalid admin credentials.');
        setSuccess('');
      }
    } else if (formData.role == 'touristGovern') {
      if (formData.email == 'governer' && formData.password == 'governer') {
        setSuccess('Sign-in successful! Welcome, Tourist Governor.');
        setError('');
      } else {
        setError('Invalid governor credentials.');
        setSuccess('');
      }
    } 

    console.log('Sign-in data:', formData);
  };

  return (
    <div className="sign-in-form">
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email/Username:</label>
        <input
          type="text"
          name="email"
          value={formData.email}
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

        <label>Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
        >
          
          <option value="admin">Admin</option>
          <option value="touristGovern">Tourist Governor</option>
        </select>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Login;
