import React, { useState, useEffect } from 'react';
import { Card, Box, Typography, IconButton, TextField, Divider,FormControl,InputLabel,Select,MenuItem, Avatar, Grid, InputAdornment } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Edit as EditIcon, Save as SaveIcon, Star as StarIcon, Wallet, Redeem, AccountCircle as AccountCircleIcon } from '@mui/icons-material';
import { Visibility, VisibilityOff, Email, Phone, Cake, Flag, Lock } from '@mui/icons-material';
import WorkIcon from '@mui/icons-material/Work';
import NetworkService from '../../../NetworkService';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';
import silver from './silver.png';
import bronze from './bronze.png';
import gold from './gold.png';
import Tooltip from '@mui/material/Tooltip';
import Sky from '../Sky2.jpeg';
import TouristNavbar from '../../../Tourist/TouristNavbar';

const TouristProfile = (props) => {
  const [level, setLevel] = useState(1);
  const User = JSON.parse(localStorage.getItem('User'));
  const location = useLocation();
  const { Tourist, imageUrl } = location.state || {}; // Destructure Tourist from location.state
  const initialData = {
    email: Tourist?.email || User?.email,
    mobileNum: Tourist?.mobileNum || User?.mobileNum,
    nationality: Tourist?.nation || '',
    dob: Tourist?.dob ? dayjs(Tourist.dob) : null,
    profession: Tourist?.profession || '',
    password: Tourist?.password || '',
    wallet: Tourist?.wallet || 0,
    points: Tourist?.points || 0,
    currency:Tourist?.currency||User.currency,
  };
  const userId = Tourist._id||User._id;
  const savedAvatarUrl = localStorage.getItem(`${userId}`) || '';
  const [avatarImage, setAvatarImage] = useState(savedAvatarUrl || `http://localhost:3030/images/${imageUrl || ''}`);
  const initialUsername = Tourist.username;
  const defaultAvatarUrl = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
  const [formValues, setFormValues] = useState(initialData);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditable, setIsEditable] = useState({
    email: false,
    mobileNum: false,
    nationality: false,
    dob: false,
    password: false,
    profession: false,
    currency:false,
  });

  useEffect(() => {
    // Update the avatar URL when the component mounts if a new image URL exists
    if (savedAvatarUrl || imageUrl) {
        setAvatarImage(savedAvatarUrl || `http://localhost:3030/images/${imageUrl}`);
    } else {
        setAvatarImage(defaultAvatarUrl);
    }
}, [imageUrl, savedAvatarUrl, defaultAvatarUrl]);

  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response2 = await axios.get(`http://localhost:3030/level/${Tourist._id}`);
        console.log('Tourist level:', response2.data);
        setLevel(response2.data.level);

        const response = await axios.get(`http://localhost:3030/getTourist/${Tourist._id}`);
        console.log('Tourist data:', response.data);
        setFormValues({
          ...formValues,
          email: response.data.email,
          mobileNum: response.data.mobileNum,
          nationality: response.data.nation,
          dob: response.data.dob ? dayjs(response.data.dob) : null,
          profession: response.data.profession,
          points: response.data.points,
          password: response.data.password,
          wallet: response.data.wallet,
        });
      } catch (error) {
        console.error('Error fetching tourist data:', error);
      }
    };

    fetchTouristData();
  }, [Tourist._id]);

  const handleChange = (field) => (event) => {
    setFormValues({ ...formValues, [field]: event.target ? event.target.value : event });
  };

  const handleRedeemPoints = async () => {
      console.log('Redeeming points...');
      console.log(Tourist._id, formValues.points);
        // Add your redeem logic here
        const options = {
          apiPath: `/redeemPoints/${Tourist._id}/${formValues.points}`,
        };
        const response = NetworkService.get(options);
        console.log(response);
    
  };

  const handleSave = async () => {
    try {
      console.log('Updating tourist:', formValues);
      const body = {
        email: formValues.email,
        mobileNum: formValues.mobileNum,
        nation: formValues.national,
        dob: formValues.dob,
        profession: formValues.profession,
        password: formValues.password,
        currency:formValues.currency
      };
      const response = await axios.put(`http://localhost:3030/updateTourist/${Tourist._id}`, body);
      console.log(response.message);
      setIsEditable({
        email: false,
        mobileNum: false,
        nationality: false,
        dob: false,
        password: false,
        profession: false,
        currency:false,
      });
    } catch (error) {
      console.error('Error updating tourist:', error);
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
    <div>

    <TouristNavbar/>
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
      {/* Flex container to center the card */}
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3, position: 'relative', display: 'flex', justifyContent: 'center', gap: 2 }}>
  {/* Avatar with hover effect */}
  <Tooltip title="Click to change avatar" arrow>
    <label htmlFor="avatar-upload">
      <Avatar
        sx={{
          width: 80, height: 80, cursor: 'pointer',
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

  <Avatar
    sx={{
      width: 80,
      height: 110,
      backgroundColor: 'transparent', // Make the background transparent
      boxShadow: 'none', // Remove any shadow or outline
    }}
  >
    {Tourist.level === 3 ? (
      <img src={gold} alt="Level 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : Tourist.level === 2 ? (
      <img src={silver} alt="Level 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <img src={bronze} alt="Level 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    )}
  </Avatar>
</Box>

            <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
              <StarIcon color="warning" />
              <Typography variant="h6" ml={1}>{formValues.points} Points</Typography>
              {/* Redeem button */}
              <IconButton onClick={handleRedeemPoints} color="primary" sx={{ ml: 0.5 }}>
                <Redeem />
              </IconButton>Hoe
            </Box>
          </Box>

          <Divider sx={{ mb: 1}} />

          {/* Profile Fields */}
          <Grid container spacing={2}>
                {/* Username */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <AccountCircleIcon color="action" />
                <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Username:</Typography>
                <Typography sx={{ mr: 5 }}>{Tourist.username}</Typography>
              </Box>
            </Grid>
            {/* Email */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Email color="action" />
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

            {/* Mobile Number */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Phone color="action" />
                <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Mobile Number:</Typography>
                {isEditable.mobileNum ? (
                  <TextField fullWidth value={formValues.mobileNum} onChange={handleChange('mobileNum')} />
                ) : (
                  <Typography>{formValues.mobileNum}</Typography>
                )}
                <IconButton onClick={() => { toggleEdit('mobileNum'); if (isEditable.mobileNum) handleSave(); }}>
                  {isEditable.mobileNum ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
                </IconButton>
              </Box>
            </Grid>

            {/* Nationality */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Flag color="action" />
                <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Nationality:</Typography>
                {isEditable.nationality ? (
                  <TextField fullWidth value={formValues.nationality} onChange={handleChange('nationality')} />
                ) : (
                  <Typography>{formValues.nationality}</Typography>
                )}
                <IconButton onClick={() => { toggleEdit('nationality'); if (isEditable.nationality) handleSave(); }}>
                  {isEditable.nationality ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
                </IconButton>
              </Box>
            </Grid>
            {/* currency */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Flag color="action" />
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

            {/* Date of Birth */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Cake color="action" />
                <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Date of Birth:</Typography>
                <Typography sx={{ mr: 5 }}>{formValues.dob ? formValues.dob.format('YYYY-MM-DD') : 'N/A'}</Typography>
              </Box>
            </Grid>
            
            {/* Password */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Lock color="action" />
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

            {/* Profession */}
            <Grid item xs={12}>
  <Box display="flex" alignItems="center">
    <WorkIcon color="action" />
    <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Profession:</Typography>
    {isEditable.profession ? (
      <TextField fullWidth value={formValues.profession} onChange={handleChange('profession')} />
    ) : (
      <Typography>{formValues.profession}</Typography>
    )}
    <IconButton onClick={() => { toggleEdit('profession'); if (isEditable.profession) handleSave(); }}>
      {isEditable.profession ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
    </IconButton>
  </Box>
</Grid>

{/* Wallet */}
<Grid item xs={12}>
  <Box display="flex" alignItems="center">
    <Wallet color="action" />
    <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Wallet:</Typography>
    {isEditable.wallet ? (
      <TextField fullWidth value={formValues.wallet} onChange={handleChange('wallet')} />
    ) : (
      <Typography sx={{ mr: 5 }}>{formValues.wallet}</Typography>
    )}
  </Box>
</Grid>
          </Grid>
        </Card>
      </Box>
    </LocalizationProvider>
    </Box>
    </div>

  );
};

export default TouristProfile;
