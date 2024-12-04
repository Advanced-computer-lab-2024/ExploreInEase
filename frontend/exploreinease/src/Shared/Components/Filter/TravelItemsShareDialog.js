import React, { useState,useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import LinkIcon from '@mui/icons-material/Link';
import { Alert } from '@mui/material'; 
import { useLocation } from 'react-router-dom';
import NetworkService from '../../../NetworkService';
const TravelItemsShareDialog = ({ item, onClose }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const { userId } = location.state || {};
  console.log(item);
  const item2 = {
    name: item.name,
    price: item.budget,
    date: item.date,
    type: item.type
  };
  const item3 = {
    name: item.name,
    price: item.price,
    language: item.language,
    type: item.type

  };
  const item4 = {
    name: item.name,
    description: item.description,
    type: item.type

  };
  const [shareMethod, setShareMethod] = useState('email');
  const [emailAddress, setEmailAddress] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const handleShareClick = () => {
    if (item.type === 'Activity') {
      handleShareByEmail();
    } else if (item.type === 'Itinerary') {
      handleShareByEmail2();
    } else {
      handleShareByEmail3();
    }
  }
  const handleShareMethodChange = (e) => {
    setShareMethod(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmailAddress(e.target.value);
  };

  const handleShareByEmail = () => {

    // lama agy a-integrate hab3at el tourist id w attributes mo3yana men el item mesh kolo
        const option = {
          apiPath: `/sendEventEmail/${userId}/${emailAddress}`,
          urlParam: userId, email: emailAddress,
          body: item2
        }
        console.log("userId",userId);
        const response = NetworkService.post(option);
        console.log(response);
        setSuccessMessage("Share Successfully!");
        setShowSuccessMessage(true);        
      onClose();
  };
  const handleShareByEmail2 = () => {

    // lama agy a-integrate hab3at el tourist id w attributes mo3yana men el item mesh kolo

    
      const option = {
        apiPath: `/sendEventEmail/${userId}/${emailAddress}`,
        urlParam: userId, email: emailAddress,
        body: item3
      }
      const response = NetworkService.post(option);
      console.log("response",response);
      setSuccessMessage("Email sent Successfully!");
      setShowSuccessMessage(true);
    onClose();

    // Implement email sharing logic here
    // console.log('Sharing by email:', emailAddress, item);
  };
  const handleShareByEmail3 = () => {

    // lama agy a-integrate hab3at el tourist id w attributes mo3yana men el item mesh kolo
      const option = {
        apiPath: `/sendEventEmail/${userId}/${emailAddress}`,
        urlParam: userId, email: emailAddress,
        body: item4
      }
      const response = NetworkService.post(option);
      console.log(response);
      setSuccessMessage("Email sent Successfully!");
      setShowSuccessMessage(true);
      onClose();
    // Implement email sharing logic here
    // console.log('Sharing by email:', emailAddress, item);
  };

  const handleShareByLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
    onClose();
  };
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);
  
  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);
  return (
    <Dialog open onClose={onClose} style={{ backgroundColor: 'transparent', boxShadow: 'none',height:"700px"}}>
      <DialogTitle>Share Travel Item</DialogTitle>
      <DialogContent style={{height:"100px",width:"300px"}}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between" style={{marginBottom:"25px"}}>
            <label htmlFor="share-method">Share Method:</label>
              <input
                id="share-method"
                type="radio"
                name="share-method"
                value="email"
                checked={shareMethod === 'email'}
                onChange={handleShareMethodChange}
              />
              <label htmlFor="share-method-email">Email</label>
              <input
                id="share-method-link"
                type="radio"
                name="share-method"
                value="link"
                checked={shareMethod === 'link'}
                onChange={handleShareMethodChange}
              />
              <label htmlFor="share-method-link">Copy Link</label>
          </div>
          {shareMethod === 'email' && (
            <div className="flex flex-col items-center gap-2 w-48"> {/* Adjust width for smaller size */}
                <label htmlFor="email-address" className="text-center">Email Address:</label> {/* Center-align label */}
                <TextField
                  id="email-address"
                  type="email"
                  variant="standard" 
                  fullWidth
                  value={emailAddress}
                  onChange={handleEmailChange}
                  placeholder="Enter email address"
                  className="w-full text-sm p-2" 
                />
              </div>

          )}
          {shareMethod === 'link' && (
            <div className="flex items-center gap-2">
              <LinkIcon size={24} />
              <span>{window.location.href}</span>
              {copySuccess && (
                <span className="text-green-500">Link copied to clipboard!</span>
              )}
            </div>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        {shareMethod === 'email' ? (
          <Button variant="contained" onClick={handleShareClick}>
            <MailIcon className="mr-2" />
            Share by Email
          </Button>
        ) : (
          <Button variant="contained" onClick={handleShareByLink}>
            <LinkIcon className="mr-2" />
            Copy Link
          </Button>
        )}
      </DialogActions>
      {showSuccessMessage && (
        <Alert severity="success" 
        sx={{
          position: 'fixed',
          top: 80, // You can adjust this value to provide space between success and error alerts
          right: 20,
          width: 'auto',
          fontSize: '1.2rem', // Adjust the size
          padding: '16px',
          zIndex: 9999, // Ensure it's visible above other content
        }}>
          {successMessage}
        </Alert>
      )}
      {showErrorMessage && (
        <Alert severity="error" 
        sx={{
          position: 'fixed',
          top: 60, // You can adjust this value to provide space between success and error alerts
          right: 20,
          width: 'auto',
          fontSize: '1.2rem', // Adjust the size
          padding: '16px',
          zIndex: 9999, // Ensure it's visible above other content
        }}>
          {errorMessage}
        </Alert>
      )}
    </Dialog>
  );
};

export default TravelItemsShareDialog;