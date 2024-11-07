import React, { useState, useEffect } from 'react';
import { Card, Box, Typography, IconButton, TextField, Divider, Avatar, Grid, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Edit as EditIcon, Save as SaveIcon, Star as StarIcon, Wallet, Redeem } from '@mui/icons-material';
import { Visibility, VisibilityOff, Email, Phone, Cake, Flag, LocationOn, Wc, Lock } from '@mui/icons-material';
import WorkIcon from '@mui/icons-material/Work';
import NetworkService from '../../../NetworkService';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';

const TouristProfile = (props) => {
  const location = useLocation();
  const { Tourist } = location.state || {}; // Destructure Tourist from location.state
  console.log(Tourist);

  const initialData = {
    email: Tourist?.email || '',
    mobileNum: Tourist?.mobileNum || '',
    nationality: Tourist?.nation || '',
    dob: Tourist?.dob ? dayjs(Tourist.dob) : null,
    profession: Tourist?.profession || '',
    password: Tourist?.password || '',
    wallet: Tourist?.wallet || 0,
    points: Tourist?.points || 0,
  };

  const [formValues, setFormValues] = useState(initialData);
  const [isEditable, setIsEditable] = useState({
    email: false,
    mobileNum: false,
    nationality: false,
    dob: false,
    password: false,
    profession: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchTouristData = async () => {
      try {
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
          points: response.data.points,
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
      });
    } catch (error) {
      console.error('Error updating tourist:', error);
    }
  };

  const toggleEdit = (field) => setIsEditable({ ...isEditable, [field]: !isEditable[field] });
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Flex container to center the card */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',  // Full height of the screen
          padding: 2,
        }}
      >
        <Card sx={{ padding: 4, width: '90%', maxWidth: 600, boxShadow: 3, borderRadius: 16 }}>
          <Box display="flex" alignItems="Left" justifyContent="center">
          <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 1}}>My Profile</Typography>
            </Box>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, fontSize: 40, margin: 'auto' }}>
              {Tourist.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ mt: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                {Tourist?.username}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
              <StarIcon color="warning" />
              <Typography variant="h6" ml={1}>{formValues.points} Points</Typography>
              {/* Redeem button */}
              <IconButton onClick={handleRedeemPoints} color="primary" sx={{ ml: 0.5 }}>
                <Redeem />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ mb: 1}} />

          {/* Profile Fields */}
          <Grid container spacing={2}>
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

            {/* Date of Birth */}
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Cake color="action" />
                <Typography sx={{ fontWeight: 'bold', ml: 1, flex: 1 }}>Date of Birth:</Typography>
                {isEditable.dob ? (
                  <DatePicker
                    label="Select Date"
                    value={formValues.dob}
                    onChange={handleChange('dob')}
                    renderInput={(params) => <TextField {...params} />}
                  />
                ) : (
                  <Typography>{formValues.dob ? formValues.dob.format('YYYY-MM-DD') : 'N/A'}</Typography>
                )}
                <IconButton onClick={() => { toggleEdit('dob'); if (isEditable.dob) handleSave(); }}>
                  {isEditable.dob ? <SaveIcon color="primary" /> : <EditIcon color="action" />}
                </IconButton>
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
                <Typography sx={{ flex: 1, ml: 41 }}>{formValues.wallet}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default TouristProfile;
