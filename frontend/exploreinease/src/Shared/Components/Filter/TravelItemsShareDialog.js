import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import LinkIcon from '@mui/icons-material/Link';
import { useLocation } from 'react-router-dom';
import NetworkService from '../../../NetworkService';
const TravelItemsShareDialog = ({ item, onClose }) => {

  const location = useLocation();
  const { User } = location.state || {};
  console.log("admin ", User);
  const userId = User._id;
  console.log(User.username);
  const price = item.budget;
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


    // Implement email sharing logic here
    // console.log('Sharing by email:', emailAddress, item);
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
    console.log(response);

    // Implement email sharing logic here
    // console.log('Sharing by email:', emailAddress, item);
    onClose();
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


    // Implement email sharing logic here
    // console.log('Sharing by email:', emailAddress, item);
    onClose();
  };

  const handleShareByLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <DialogTitle>Share Travel Item</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label htmlFor="share-method">Share Method:</label>
            <div className="flex items-center gap-2">
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
          </div>
          {shareMethod === 'email' && (
            <div className="flex flex-col gap-2">
              <label htmlFor="email-address">Email Address:</label>
              <TextField
                id="email-address"
                type="email"
                value={emailAddress}
                onChange={handleEmailChange}
                placeholder="Enter email address"
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
    </Dialog>
  );
};

export default TravelItemsShareDialog;