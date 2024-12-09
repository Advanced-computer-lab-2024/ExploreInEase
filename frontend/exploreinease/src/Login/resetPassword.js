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
import axios from 'axios'; 
import backgroundImage1 from '../rerere.jpg';
import {  Visibility, VisibilityOff } from '@mui/icons-material';
import {  InputAdornment, IconButton } from '@mui/material';

const ResetPassword = () => {
    const navigate = useNavigate(); // Move useNavigate inside the component
  const [formData, setFormData] = useState({
    email: '',
    otp: '      ', // 6 spaces for OTP placeholders
    password:'',
    repeatPassword:''
  });
  const [clicked, setClicked] = useState(false);
  const [clickedT, setClickedT] = useState(false);
  const [clickedOTP, setClickedOTP] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleEmailChange = (event) => {
    console.log("hereee1");
    // setFormData({
    //   ...formData,
    //   email: event.target.value,
    // });
  };
  const setNewPassword =(event)=>{
    console.log("hereee2");
    setFormData({
      ...formData,
      password:event.target.value,
    });
  }
  const setConfirmPassword=(event)=>{
    console.log("hereee3");
    setFormData({
      ...formData,
      repeatPassword:event.target.value,
    })
  }

  const handleOtpChange = (index, value) => {
    console.log("hereee4");
    if (value.length > 1 || isNaN(value)) return; // Ensure it's a single digit
    const otpArray = formData.otp.split('');
    otpArray[index] = value || ' '; // Replace or reset the specific digit
    setFormData({ ...formData, otp: otpArray.join('') });
    console.log("OTP",formData.otp);
  };

  const handleSendEmailOTP =async () => {
    console.log("hereee5");
    try{
      const options = { 
        apiPath: `/forgetPassword`,
       };
       const body={
        email:formData.email
       }
       const response = await axios.post(options,body);
       console.log(response);
       
      localStorage("user",response.response.response.user); 
       if (response.message==='Email sent successfully'){
        // setClicked(true);
       }
    }catch{
      console.log('Email OTP sent to:', formData.email);

    }

  
  };

  const verifyEmailOTP = () => {
    console.log("hereee6");
    const options = { 
      apiPath: `/verifyOTP/{}/:otp`,
     };
    setClickedT(true);
    setClickedOTP(true);
    console.log('Verifying OTP:', formData.otp.trim());
  };
  const changePasswords=()=>{
    console.log("hereee7");

    navigate('/Login');
  }

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
          {!clicked &&!clickedT && (
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
          {clicked &&!clickedT && (
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
          {clickedOTP && clickedT &&(<>
            <Typography variant="h6" paragraph>
                Enter Your New Password
              </Typography>
              <div>
              <TextField
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={setNewPassword}
                  fullWidth
                  required
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end">
                           <IconButton
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              edge="end"
                           >
                              {showNewPassword ? <Visibility /> : <VisibilityOff />}
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  margin="normal"
               />
               <TextField
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.repeatPassword}
                  onChange={ setConfirmPassword}
                  fullWidth
                  required
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end">
                           <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                           >
                              {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  margin="normal"
               />
              </div>       
          </>)}
        </CardContent>
        <CardActions>
          {!clicked && !clickedT &&  (
            <Button color="primary" onClick={handleSendEmailOTP} fullWidth variant="contained">
              SEND EMAIL OTP
            </Button>
          )}
          {clicked  && !clickedT && (
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
          {
            clickedOTP && clickedT &&(
              <Button
              color="primary"
              onClick={changePasswords}
              fullWidth
              variant="contained"
            >
              change Password
            </Button>
            )
          }
        </CardActions>
          {clicked && !clickedT  &&(
        <p className="signup-prompt">
        Didn't get OTP?{' '}
        <span className="signup-link" onClick={handleSendEmailOTP}>
         Resend
        </span>
        </p>
          )}
        {
          !clickedOTP&&(
            <p className="signup-promptadvance">
            Back to 
            <span className="signup-link" onClick={() => navigate('/')}>Home Page</span>
          </p>
          )
        }
     
      </Card>
    </div>
  );
};

export default ResetPassword;
