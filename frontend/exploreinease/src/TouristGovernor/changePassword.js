// src/Shared/Components/ChangePassword.js
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './changePassword.css';
import { useLocation } from 'react-router-dom'; 
import NetworkService from "../NetworkService";


const ChangePassword = () => {
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
   };

   return (
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
                              {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
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
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
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
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
   );
};

export default ChangePassword;
