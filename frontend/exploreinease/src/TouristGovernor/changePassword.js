// src/Shared/Components/ChangePassword.js
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './changePassword.css';
import { useLocation, useNavigate } from 'react-router-dom'; 
import NetworkService from "../NetworkService";
import TourGuideHP from '../TourGuide/TourGuideNavbar';
import AHomePage from '../Advertier/AdvertiserNavbar';
import SHomePage from '../Seller/SellerNavbar';
import GHomePage from '../TouristGovernor/GovernorNavbar';
import TouristNavbar from '../Tourist/TouristNavbar';
const ChangePassword = () => {
   const User = JSON.parse(localStorage.getItem('User'));
   const adminIdd=localStorage.getItem('UserId');
   const [currentPassword, setCurrentPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState('');
   const location = useLocation();
   const {userType}=location.state ||{};
   const navigate=useNavigate();
   const userId  = adminIdd || location.state;
   console.log(userId);

   const handleSubmit = async (event) => {
      
      event.preventDefault();
      setError('');
      setSuccess('');

      if (newPassword !== confirmPassword) {
         setError('New passwords do not match.');
         return;
      }
      try{
         const options = {
            apiPath: `/changePassword/${userId}`, // Use template literal to include userId in the path
            body: {
               oldPassword: currentPassword,
               newPassword: newPassword
            }
         };
          const response = await NetworkService.put(options);
          console.log(response);
          // TODO: Add password change logic here (API call)
          setSuccess('Password changed successfully.');
          navigate('/Login');
      }catch{
         setError('No Change');

      }
  
   };

   return (
      <div>
      <div>
      {User?.type==='seller' &&(
        <SHomePage/>
      )}
      {User?.type==='advertiser'&&(
                <AHomePage/>
      )}
      {User?.type==='tourGuide' &&(
        <TourGuideHP/>
      )}
          {User?.type==='tourismGovernor' &&(
        <GHomePage/>
      )}
      {userType==='tourist'&&(
         <TouristNavbar/>
      )}
      
   </div>
      <Box className="change-password-background">
       
         <Box className="change-password-container">
            <Typography variant="h4" gutterBottom>
               Change Password
            </Typography>
            <form onSubmit={handleSubmit}>
               <TextField
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                     endAdornment: (
                        <InputAdornment position="end">
                           <IconButton
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              edge="end"
                           >
                              {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                           </IconButton>
                        </InputAdornment>
                     ),
                  }}
                  margin="normal"
               />
               <TextField
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
               {error && <Typography color="error" className="error-text">{error}</Typography>}
               {success && <Typography color="success.main" className="success-text">{success}</Typography>}
               <Button variant="contained" color="primary" type="submit" className="submit-button">
                  Update Password
               </Button>
            </form>
         </Box>
      </Box>
      </div>
   );
};

export default ChangePassword;
