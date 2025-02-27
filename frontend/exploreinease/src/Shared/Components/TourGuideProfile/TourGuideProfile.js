import React, { useState, useEffect } from 'react';
import { Card, Box, Typography, IconButton,FormControl,Select,InputLabel,MenuItem, TextField, Divider, Avatar, Grid, InputAdornment } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Edit as EditIcon, Save as SaveIcon, Visibility, VisibilityOff, AccountCircle as AccountCircleIcon, Email as EmailIcon, Lock as LockIcon , Phone as PhoneIcon , Work as WorkIcon    } from '@mui/icons-material';
import axios from 'axios';
import NetworkService from '../../../NetworkService';
import { useNavigate, useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import HistoryEduIcon from '@mui/icons-material/History';
import Sky from '../Sky2.jpeg';
import './tourGuideProfile.css';
import TourGuideHP from '../../../TourGuide/TourGuideNavbar';
const TourGuideProfile = (props) => {
  const navigate = useNavigate();
  const initialData = {
    username: '',
    email: '',
    password: '',
    hotline: '',
    experience: '',
    previousWork: '',
    currency:''
  };
  const location = useLocation();
  const { TourGuide, imageUrl } = location.state || {};
  // console.log(TourGuide);
  const userId = TourGuide.TourGuide?._id || TourGuide?._id;
  // console.log(userId);
  const [formValues, setFormValues] = useState(initialData);
    // Retrieve avatar URL from localStorage or fallback to the default avatar
    const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
    const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);
    const initialUsername = TourGuide.TourGuide?.username || TourGuide?.username;
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
    hotline: false,
    experience: false,
    previousWork: false,
    currency:false
    });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = { apiPath: `/getTourGuide/${userId}`, urlParam: { userId } };
        const response = await NetworkService.get(options);
        console.log(response.TourGuide);
        setFormValues({
          username: response.tourGuide.username,
          email: response.tourGuide.email,
          password: response.tourGuide.password,
          hotline: response.tourGuide.hotline,
          experience: response.tourGuide.experience,
          previousWork: response.tourGuide.previousWork,
          currency:response.tourGuide.currency
        });
        console.log(response.tourGuide);
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
        apiPath: '/updateTourGuide/{userId}',
        urlParam: { userId },
        body: {
          ...formValues,
        },
      };
      const response = await NetworkService.put(options);
      console.log(response.message);
      setIsEditable({
        username: false,
        email: false,
        password: false,
        hotline: false,
        experience: false,
        previousWork: false,
        currency:false
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

  const toggleEdit = (field) => setIsEditable({ ...isEditable, [field]: !isEditable[field] });
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <><TourGuideHP/>
    <Box
      sx={{
        backgroundImage: `url(${Sky})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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

        {/* Currency */}
        <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <EmailIcon color="action" />
        <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Currency:</Typography>
        {isEditable.currency ? (
          <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Currency</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={formValues.currency}
            label="Currency"
            onChange={handleChange('currency')}
          >
               <MenuItem value={'EGP'}>EGP</MenuItem>
               <MenuItem value={'euro'}>EURO</MenuItem>
               <MenuItem value={'dollar'}>Dollar</MenuItem>  
          </Select>
        </FormControl>
        ) : (
          <Typography>{formValues.currency}</Typography>
        )}
        <IconButton onClick={() => { toggleEdit('currency'); if (isEditable.currency) handleSave(); }}>
          {isEditable.currency ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
        </IconButton>
      </Box>
    </Grid>

{/* hotline */}
<Grid item xs={12}>
  <Box display="flex" alignItems="center">
    <PhoneIcon color="action" />
    <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Mobile Number:</Typography>
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

{/* Experience */}
<Grid item xs={12}>
  <Box display="flex" alignItems="center">
    <WorkIcon color="action" />
    <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Years of Experience:</Typography>
    {isEditable.experience ? (
      <TextField
        fullWidth
        value={formValues.experience}
        onChange={handleChange('experience')}
        type="number" // Set type to number to accept numeric input
      />
    ) : (
      <Typography>{formValues.experience}</Typography>
    )}
    <IconButton onClick={() => { toggleEdit('experience'); if (isEditable.experience) handleSave(); }}>
      {isEditable.experience ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
    </IconButton>
  </Box>
</Grid>

{/* Work */}
<Grid item xs={12}>
  <Box display="flex" alignItems="center">
    <HistoryEduIcon color="action" />
    <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Previous Work:</Typography>
    {isEditable.previousWork ? (
      <TextField fullWidth value={formValues.previousWork} onChange={handleChange('previousWork')} />
    ) : (
      <Typography>{formValues.previousWork}</Typography>
    )}
    <IconButton onClick={() => { toggleEdit('previousWork'); if (isEditable.previousWork) handleSave(); }}>
      {isEditable.previousWork ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
    </IconButton>
  </Box>
</Grid>

</Grid>

        </Card>
      </Box>
    </LocalizationProvider>
  </Box>
  </>
  );
};

export default TourGuideProfile;
