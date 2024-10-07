import React, { useState } from 'react';
import axios from 'axios';  // Import Axios
import NetworkService from '../NetworkService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './login.css';

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'  // Default role set to 'admin'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error and success states
    setError('');
    setSuccess('');

    // Basic validation for email, password, and role
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    const options = {
      apiPath: '/login',
      body: {
        username: formData.email,  // Assuming email as username
        password: formData.password,
      }
    };
    
    try {
      // Send the POST request to the /login endpoint
      const response = await NetworkService.post(options);
      console.log("Response:", response);
      // Handle successful login
      if (response.message === "Logged in Successfully") {
        setSuccess(`Sign-in successful! Welcome, ${response.user.username}`);
        console.log(response.user)
        console.log(response.user._id);
        navigate('/AdminHomePage', { state: { tourist: response.user } }); // Use navigate to change the route
        setError('');
      }
    } catch (error) {
      // Handle different error responses
      if (error.response) {
        if (error.response.status === 400) {
          setError('Missing parameters');
        } else if (error.response.status === 404) {
          setError('Invalid username or password');
        } else {
          setError('An error occurred while logging in');
        }
      } else {
        setError('Network error. Please try again later.');
      }
      setSuccess('');
    }
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