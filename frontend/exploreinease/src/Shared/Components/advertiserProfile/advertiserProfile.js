import React, { useState, useEffect } from 'react';
import { Card, Box, Typography, IconButton, TextField, Divider, Avatar, Grid, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Edit as EditIcon, Save as SaveIcon, Visibility, VisibilityOff, AccountCircle as AccountCircleIcon, Email as EmailIcon, Lock as LockIcon, Language as LanguageIcon, Phone as PhoneIcon, LinkedIn as LinkedInIcon, Work as WorkIcon, Group as GroupIcon, Event as EventIcon  } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import NetworkService from '../../../NetworkService';
import { useNavigate, useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Sky from '../Sky2.jpeg';
import { styled } from '@mui/system';

const AdvertiserProfile = (props) => {
  const initialData = {
    username: '',
    email: '',
    password: '',
    linkWebsite: '',
    hotline: '',
    linkedInLink: '',
    industry: '',
    noEmployees: '',
    founded: null,
  };
  const location = useLocation();
  const { advertiser, imageUrl } = location.state || {};
  console.log(advertiser.advertiser);
  const userId = advertiser.advertiser?._id || advertiser?._id;
  console.log(userId);
  const [formValues, setFormValues] = useState(initialData);
    // Retrieve avatar URL from localStorage or fallback to the default avatar
    const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
    const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);
    const initialUsername = advertiser.advertiser?.username || advertiser?.username;
    const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';


    useEffect(() => {
      // Update the avatar URL when the component mounts if a new image URL exists
      if (savedAvatarUrl || imageUrl) {
          setAvatarImage(savedAvatarUrl || `http://localhost:3030/images/${imageUrl}`);
      } else {
          setAvatarImage(defaultAvatarUrl);
      }
  }, [imageUrl, savedAvatarUrl, defaultAvatarUrl]);

  const [isEditable, setIsEditable] = useState({
    username: false,
    email: false,
    password: false,
    linkWebsite: false,
    hotline: false,
    linkedInLink: false,
    industry: false,
    noEmployees: false,
    founded: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = { apiPath: `/getAdvertiser/${userId}`, urlParam: { userId } };
        const response = await NetworkService.get(options);
        setFormValues({
          username: response.advertiser.username,
          email: response.advertiser.email,
          linkWebsite: response.advertiser.linkWebsite,
          hotline: response.advertiser.hotline,
          linkedInLink: response.advertiser.linkedInLink,
          industry: response.advertiser.industry,
          noEmployees: response.advertiser.noEmployees,
          founded: response.advertiser.founded ? dayjs(response.advertiser.founded) : null,
        });
        console.log(response.advertiser);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (field) => (event) => {
    setFormValues({ ...formValues, [field]: event.target ? event.target.value : event });
  };

  const handleSave = async () => {
    try {
      const options = {
        apiPath: '/updateAdvertiser/{userId}',
        urlParam: { userId },
        body: {
          ...formValues,
          founded: formValues.founded ? formValues.founded.toISOString() : null,
        },
      };
      const response = await NetworkService.put(options);
      console.log(response.message);
      setIsEditable({
        username: false,
        email: false,
        password: false,
        linkWebsite: false,
        hotline: false,
        linkedInLink: false,
        industry: false,
        noEmployees: false,
        founded: false,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post(`http://localhost:3030/uploadImage/${userId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Image uploaded successfully:', response.data);
        setAvatarImage(response.data.imageUrl);
        localStorage.setItem(`${userId}`, response.data.imageUrl);
      } catch (err) {
        console.error('Error uploading image:', err);
      }
    }
  };

  
  const BackgroundContainer = styled(Box)({
    backgroundImage: `url(${Sky})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the left
  });

  const toggleEdit = (field) => setIsEditable({ ...isEditable, [field]: !isEditable[field] });
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <BackgroundContainer>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%', // Ensure the box takes full height
          width: '100%', // Ensure the box takes full width
        }}
      >
        <Card sx={{ padding: 4, width: '90%', maxWidth: 600, borderRadius: 16, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent
        animation: 'fadeIn 1s ease-in-out' }}>
        <Box display="flex" alignItems="Left" justifyContent="center">
          <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 1}}>My Profile</Typography>
            </Box>
            {/* Avatar */}
            <Box sx={{ textAlign: 'center', mb: 3, position: 'relative' }}>
          {/* Avatar with hover effect */}
          
          <Tooltip title="Click to change avatar" arrow>
            <label htmlFor="avatar-upload">
              <Avatar
                sx={{
                  width: 80, height: 80, margin: 'auto', cursor: 'pointer',
                  '&:hover::before': {
                    position: 'absolute',
                    bottom: '5px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    borderRadius: '5px',
                    padding: '2px 8px',
                  },
                }}
                src={avatarImage}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
            </label>
          </Tooltip>
        </Box>

          <Divider sx={{ mb: 1 }} />

          <Grid container spacing={2}>
    {/* Username */}
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <AccountCircleIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Username:</Typography>
        <Typography sx={{ mr: 5 }}>{formValues.username}</Typography>
      </Box>
    </Grid>

    {/* Email */}
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <EmailIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Email:</Typography>
        {isEditable.email ? (
          <TextField fullWidth value={formValues.email} onChange={handleChange('email')} />
        ) : (
          <Typography>{formValues.email}</Typography>
        )}
        <IconButton onClick={() => { toggleEdit('email'); if (isEditable.email) handleSave(); }}>
          {isEditable.email ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
        </IconButton>
      </Box>
    </Grid>

    {/* Password */}
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <LockIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Password:</Typography>
        {isEditable.password ? (
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={formValues.password}
            onChange={handleChange('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <Typography>******</Typography>
        )}
        <IconButton onClick={() => { toggleEdit('password'); if (isEditable.password) handleSave(); }}>
          {isEditable.password ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
        </IconButton>
      </Box>
    </Grid>

    {/* Website */}
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <LanguageIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Website:</Typography>
        {isEditable.linkWebsite ? (
          <TextField fullWidth value={formValues.linkWebsite} onChange={handleChange('linkWebsite')} />
        ) : (
          <Typography>{formValues.linkWebsite}</Typography>
        )}
        <IconButton onClick={() => { toggleEdit('linkWebsite'); if (isEditable.linkWebsite) handleSave(); }}>
          {isEditable.linkWebsite ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
        </IconButton>
      </Box>
    </Grid>

    {/* Hotline */}
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <PhoneIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Hotline:</Typography>
        {isEditable.hotline ? (
          <TextField fullWidth value={formValues.hotline} onChange={handleChange('hotline')} />
        ) : (
          <Typography>{formValues.hotline}</Typography>
        )}
        <IconButton onClick={() => { toggleEdit('hotline'); if (isEditable.hotline) handleSave(); }}>
          {isEditable.hotline ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
        </IconButton>
      </Box>
    </Grid>

    {/* LinkedIn */}
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <LinkedInIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>LinkedIn:</Typography>
        {isEditable.linkedInLink ? (
          <TextField fullWidth value={formValues.linkedInLink} onChange={handleChange('linkedInLink')} />
        ) : (
          <Typography>{formValues.linkedInLink}</Typography>
        )}
        <IconButton onClick={() => { toggleEdit('linkedInLink'); if (isEditable.linkedInLink) handleSave(); }}>
          {isEditable.linkedInLink ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
        </IconButton>
      </Box>
    </Grid>

    {/* Industry */}
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <WorkIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Industry:</Typography>
        {isEditable.industry ? (
          <TextField fullWidth value={formValues.industry} onChange={handleChange('industry')} />
        ) : (
          <Typography>{formValues.industry}</Typography>
        )}
        <IconButton onClick={() => { toggleEdit('industry'); if (isEditable.industry) handleSave(); }}>
          {isEditable.industry ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
        </IconButton>
      </Box>
    </Grid>

    {/* Number of Employees */}
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <GroupIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Employees:</Typography>
        {isEditable.noEmployees ? (
          <TextField fullWidth type="number" value={formValues.noEmployees} onChange={handleChange('noEmployees')} />
        ) : (
          <Typography>{formValues.noEmployees}</Typography>
        )}
        <IconButton onClick={() => { toggleEdit('noEmployees'); if (isEditable.noEmployees) handleSave(); }}>
          {isEditable.noEmployees ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
        </IconButton>
      </Box>
    </Grid>

    {/* Founded Date */}
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <EventIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Founded:</Typography>
        {isEditable.founded ? (
          <DatePicker
            value={formValues.founded}
            onChange={(date) => handleChange('founded')(date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        ) : (
          <Typography>{formValues.founded ? dayjs(formValues.founded).format('YYYY-MM-DD') : ''}</Typography>
        )}
        <IconButton onClick={() => { toggleEdit('founded'); if (isEditable.founded) handleSave(); }}>
          {isEditable.founded ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
        </IconButton>
      </Box>
    </Grid>
</Grid>
        </Card>
      </Box>
    </LocalizationProvider>
    </BackgroundContainer>
  );
};

export default AdvertiserProfile;
