// src/components/Signup.js
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'; // Import the hook
import TouristSignUp from './TouristSignUp';
import GuideAdvertiserSignUp from './AdvertiserSignUp';
import backgroundImage from '../YachtRegister.jpg'; // Adjust path to your image

const BackgroundContainer = styled(Box)({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start', // Align items to the left
  paddingLeft: '7%', 
});

const SignUpCard = styled(Paper)( {
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent
  animation: 'fadeIn 1s ease-in-out'
});

const LoginPrompt = styled(Typography)({
  textAlign: 'center',
  marginTop: '15px', /* Add space above the text */
  fontSize: '14px', /* Slightly smaller font for the prompt */
  color: '#555', /* Dark grey text color for the prompt */
});

const Signup = () => {
  const [activeTab, setActiveTab] = useState('tourist'); // Default to tourist
  const navigate = useNavigate(); // Move useNavigate inside the component

  const renderForm = () => {
    if (activeTab === 'tourist') {
      return <TouristSignUp />;
    }
    return <GuideAdvertiserSignUp />;
  };

  return (
    <BackgroundContainer>
      <SignUpCard elevation={3}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
          centered
        >
          <Tab label="Tourist" value="tourist" />
          <Tab label="Others" value="advertiser" />
        </Tabs>
        {renderForm()}
        <LoginPrompt>
          Already have an account? 
          <span 
            className="signup-link" 
            style={{ cursor: 'pointer', color: '#007bff', marginLeft: '5px' }} // Adds space before the link
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </LoginPrompt>
        <LoginPrompt>
        Back to 
        <span className="signup-link" onClick={() => navigate('/')}>Home Page</span>

        </LoginPrompt>
        {/* <p className="signup-prompt">
          Back to Home Page
          <span className="signup-link" onClick={() => navigate('/')}>Home Page</span>
        </p> */}
      </SignUpCard>
    </BackgroundContainer>
  );
};

export default Signup;
