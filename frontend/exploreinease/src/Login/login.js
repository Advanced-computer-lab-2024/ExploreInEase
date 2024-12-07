import React, { useState } from 'react';
import {Tabs,Tab} from '@mui/material';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import NetworkService from '../NetworkService';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import './login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('Admin'); // Default to tourist
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const decodeToken =(token)=> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token structure');
      }
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  // console.log("Token",decodeToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'));
  
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
      console.log(response);
      
      if(response.message === 'Terms and Conditions not accepted') {
        navigate('/TermsAcceptance', { state: { User: response.user } });
      }

      if (response.message === 'Logged in Successfully') {
        console.log(response);
        setSuccess(`Sign-in successful! Welcome, ${response.user.username}`);
         navigateToHomePage(response.user, response.imageUrl);
      }
    } catch (error)  {
      setError(
        error.response?.status === 404
          ? 'Invalid username or password'
          : 'An error occurred while logging in'
      );
    }
  };

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const emailValue = this.loginForm.controls.email.value;
  //     const updatedEmail = `${emailValue}@khazna.app`;
  //     const body = { ...this.loginForm.value, email: updatedEmail };
  //     this.networkService.post({ apiPath: '/login', body }).subscribe({
  //       next: (res: any) => {
  //         const token = res.accessToken;
  //         localStorage.setItem('tokenKey', token);
  //         const decodedToken: any = this.decodeToken(token);
  //         const role = decodedToken.role.role;
  //         if (role === 'employee') {
  //           this.router.navigate(['/user'], {
  //             queryParams: { id: decodedToken.employeeId, name: decodedToken.name ,team:decodedToken.team.type},
  //           });
  //         } else {
  //           this.router.navigate(['/admin'], {
  //             queryParams: { id: decodedToken.employeeId, name: decodedToken.name,team:decodedToken.team.type },
  //           });
  //         }  
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Login Successed',
  //           detail:'Login successfully',
  //         });     
  //       },
  //       error: (err) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Login Failed',
  //           detail: err.error.message || 'Login failed. Please try again.',
  //         });
  //       },
  //     });
  //   }

  const navigateToHomePage = (user, imageUrl) => {
    localStorage.setItem('User',JSON.stringify(user));
    localStorage.setItem('imageUrl',imageUrl);    
    localStorage.setItem('UserId',user._id);
    localStorage.setItem('UserType',user.type);
    switch (user.type) {
      case 'admin':
        navigate('/AdminHomePage', { state: { tourist: user } });
        break;
      case 'tourismGovernor':
        navigate('/GovernorHomePage', { state: { tourist: user,imageUrl: imageUrl } });
        break;
      case 'seller':
        navigate('/SalesReport', { state: { User: user, imageUrl: imageUrl } });
        break;
      case 'tourGuide':
        navigate('/TourGuideHomePage', { state: { User: user, imageUrl: imageUrl } });
        break;
      case 'advertiser':
        navigate('/AdvertiserHomePage', { state: { User: user, imageUrl: imageUrl } });
        break;
      default:
        navigate('/TouristHomePage', { state: { tourist: user,imageUrl: imageUrl } });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sign In</h2>
        {error && <p className="error"><AiFillCloseCircle /> {error}</p>}
        {success && <p className="success"><AiFillCheckCircle /> {success}</p>}
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab label="Admin" value="Admin" />
          <Tab label="Others" value="Others" />
        </Tabs>
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input type="text" name="email" value={formData.email} onChange={handleInputChange} required />
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
          <div className="button-group">
            <button type="submit" className="login-button">Sign In</button>
          </div>
        </form>
        <div className="parent-container">
           <span className="reset-password" onClick={() => navigate('/resetPassword')}>Forgot Password?</span>
        </div>
        <div>
        <p className="signup-prompt">
          Don't have an account? 
          <span className="signup-link" onClick={() => navigate('/register')}> Sign Up</span>
        </p>
        <p className="signup-promptadvance">
          Back to 
          <span className="signup-link" onClick={() => navigate('/')}>Home Page</span>
        </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
