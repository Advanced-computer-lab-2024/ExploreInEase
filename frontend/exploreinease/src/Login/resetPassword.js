import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom'; // Import the hook
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import './login.css';
import backgroundImage1 from '../rerere.jpg';

const ResetPassword = () => {
    const navigate = useNavigate(); // Move useNavigate inside the component
  const [formData, setFormData] = useState({
    email: '',
    otp: '      ', // 6 spaces for OTP placeholders
  });
  const [clicked, setClicked] = useState(false);

  const handleEmailChange = (event) => {
    setFormData({
      ...formData,
      email: event.target.value,
    });
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1 || isNaN(value)) return; // Ensure it's a single digit
    const otpArray = formData.otp.split('');
    otpArray[index] = value || ' '; // Replace or reset the specific digit
    setFormData({ ...formData, otp: otpArray.join('') });
    console.log("OTP",formData.otp);
  };

  const handleSendEmailOTP = () => {
    setClicked(true);
    console.log('Email OTP sent to:', formData.email);
  };

  const verifyEmailOTP = () => {
    console.log('Verifying OTP:', formData.otp.trim());
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ maxWidth: 460, padding: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            <strong>Reset Password</strong>
          </Typography>
          {!clicked && (
            <>
              <Typography variant="h6" paragraph>
                Forgotten your password? Enter your e-mail address below, and we'll send an OTP to your email to verify it.
              </Typography>
              <TextField
                label="Enter your email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleEmailChange}
                margin="normal"
                required
              />
            </>
          )}
          {clicked && (
            <>
              <Typography variant="h6" paragraph>
                A 6-digit email OTP was sent to {formData.email}.
                Enter that code here to proceed:
              </Typography>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <TextField
                      key={index}
                      value={formData.otp[index] === ' ' ? '' : formData.otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      variant="outlined"
                      sx={{ width: '50px', marginRight: index < 5 ? '10px' : '0' }}
                      inputProps={{
                        maxLength: 1, // Restrict to a single digit
                        style: { textAlign: 'center' },
                      }}
                    />
                  ))}
              </div>
            </>
          )}
        </CardContent>
        <CardActions>
          {!clicked && (
            <Button color="primary" onClick={handleSendEmailOTP} fullWidth variant="contained">
              SEND EMAIL OTP
            </Button>
          )}
          {clicked && (
            <>
            <Button
              color="primary"
              onClick={verifyEmailOTP}
              fullWidth
              variant="contained"
              disabled={formData.otp.trim().length < 6}
            >
              Verify Email OTP
            </Button>
         </>
          )}
        </CardActions>
          {clicked &&(
        <p className="signup-prompt">
        Didn't get OTP?{' '}
        <span className="signup-link" onClick={handleSendEmailOTP}>
         Resend
        </span>
     </p>
          )}
        <p className="signup-promptadvance">
          Back to 
          <span className="signup-link" onClick={() => navigate('/')}>Home Page</span>
        </p>
      </Card>
    </div>
  );
};

export default ResetPassword;
