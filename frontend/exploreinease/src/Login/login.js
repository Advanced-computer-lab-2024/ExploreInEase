import React, { useState } from 'react';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import NetworkService from '../NetworkService';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    const options = {
      apiPath: '/login',
      body: {
        username: formData.email,
        password: formData.password,
      },
    };

    try {
      const response = await NetworkService.post(options);
      if(response.message === 'Terms and Conditions not accepted') {
        navigate('/TermsAcceptance', { state: { User: response.user } });
      }

      if (response.message === 'Logged in Successfully') {
        console.log(response);
        setSuccess(`Sign-in successful! Welcome, ${response.user.username}`);
        navigateToHomePage(response.user, response.imageUrl);
      }
    } catch (error) {
      setError(
        error.response?.status === 404
          ? 'Invalid username or password'
          : 'An error occurred while logging in'
      );
    }
  };

  const navigateToHomePage = (user, imageUrl) => {
    switch (formData.role) {
      case 'admin':
        navigate('/AdminHomePage', { state: { tourist: user } });
        break;
      case 'touristGovern':
        navigate('/TouristGovernorHP', { state: { tourist: user } });
        break;
      case 'seller':
        navigate('/SellerHomePage', { state: { User: user, imageUrl: imageUrl } });
        break;
      case 'tourGuide':
        navigate('/TourGuideHomePage', { state: { User: user, imageUrl: imageUrl } });
        break;
      case 'advertiser':
        navigate('/AdvertiserHomePage', { state: { User: user, imageUrl: imageUrl } });
        break;
      default:
        navigate('/TouristHomePage', { state: { tourist: user } });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In</h2>
        {error && <p className="error"><AiFillCloseCircle /> {error}</p>}
        {success && <p className="success"><AiFillCheckCircle /> {success}</p>}
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input type="text" name="email" value={formData.email} onChange={handleInputChange} required />
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleInputChange} required>
            <option value="admin">Admin</option>
            <option value="touristGovern">Tourist Governor</option>
            <option value="tourist">Tourist</option>
            <option value="tourGuide">Tour Guide</option>
            <option value="advertiser">Advertiser</option>
            <option value="seller">Seller</option>
          </select>
          <div className="button-group">
            <button type="submit" className="login-button">Sign In</button>
          </div>
        </form>
        <p className="signup-prompt">
          Don't have an account? 
          <span className="signup-link" onClick={() => navigate('/register')}> Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
