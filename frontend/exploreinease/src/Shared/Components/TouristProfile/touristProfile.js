import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import NetworkService from '../../../NetworkService';
import dayjs from 'dayjs';
import axios from 'axios';
const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    const newValue = name === 'dob' ? valueOrEvent : valueOrEvent.target.value;
    setFormValues({ ...formValues, [name]: newValue });
  };

  return [formValues, handleChange];
};

const TouristProfile = (props) => {
  const location = useLocation();
  const { Tourist } = location.state || {};
  console.log("tourist", Tourist);

  const initialUsername = Tourist?.username || '';
  const initialWallet = Tourist?.wallet || 0;
  const initialPoints = Tourist?.points || 0;

  const [formValues, handleChange] = useForm({
    email: Tourist?.email || '',
    password: Tourist?.password || '',
    mobileNumber: Tourist?.mobileNum || '',
    nationality: Tourist?.nation || '',
    dob: Tourist?.dob ? dayjs(Tourist.dob) : null, // Ensure this is a dayjs object
    educationState: Tourist?.profession || '',
    wallet: Tourist?.wallet || '0',
    points: Tourist?.points || '0',

  });
  console.log(Tourist.dob, typeof Tourist.dob);
  const [isEditable, setIsEditable] = useState({
    email: false,
    password: false,
    mobileNumber: false,
    nationality: false,
    dob: false,
    educationState: false,
    wallet: false,
    points: false,
  });

  const initialLetter = Tourist.username;
  const firstInitial = initialLetter ? initialLetter.charAt(0).toUpperCase() : '?';
  const [showPassword, setShowPassword] = useState(false);

  const toggleEditMode = (field) => {
    setIsEditable((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRedeem = () => {
    // Add your redeem logic here
    console.log('Redeeming points...');
  };

  const toggleAllEditMode = () => {
    const allEditable = Object.values(isEditable).some(editable => editable);
    const newEditableState = {
      email: !allEditable,
      password: !allEditable,
      mobileNumber: !allEditable,
      nationality: !allEditable,
      dob: !allEditable,
      educationState: !allEditable,
      wallet: !allEditable,
      points: !allEditable,

    };
    setIsEditable(newEditableState);

    if (allEditable) {
      handleSave(); // Save values if switching to non-editable mode
    }
  };

  const handleSave = async () => {
    try {
      const updatedTourist = {
        email: formValues.email,
        mobileNum: formValues.mobileNumber,
        password: formValues.password,
        profession: formValues.educationState,
        nation: formValues.nationality
        // username: formValues.username,
        // dateOfBirth: formValues.dateOfBirth
      };

      console.log(updatedTourist);
      const options = {
        apiPath: ` /updateTourist/${Tourist._id}`,
        // urlParam: Tourist._id,
        body: updatedTourist,
      };

      const response = await axios.put(`http://localhost:3030/updateTourist/${Tourist._id}`, updatedTourist);


      // const response = await NetworkService.put(options);
      console.log(response.data)
      console.log("test :", response.data.tourist)
      console.log(Tourist._id)

      // Update frontend form with the updated values
      handleChange({
        ...formValues,
        email: response.data.tourist.email,
        mobileNumber: response.data.tourist.mobileNum,
        // dateOfBirth: response.data.tourist.dateOfBirth, // Convert back to Day.js format if needed
      });

      setIsEditable({
        email: false,
        password: false,
        mobileNumber: false,
        nationality: false,
        dateOfBirth: false,
        educationState: false,
        wallet: false,
        points: false,
      });
    } catch (error) {
      console.error('Error updating tourist:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ padding: 3, width: '80%', margin: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Manage Profile
          </Typography>
          <Avatar
            sx={{
              bgcolor: 'darkblue',
              color: 'white',
              width: 56,
              height: 56,
              fontSize: 24,
              marginLeft: 2,
            }}
          >
            {firstInitial}
          </Avatar>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Username */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography sx={{ marginRight: 9, fontWeight: "bold" }}>Username:</Typography>
            <Typography>{initialUsername}</Typography>
          </Box>
        </Box>
        <Divider />

        {/* Email Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>Email:</Typography>
            {isEditable.email ? (
              <TextField
                sx={{ width: '70%' }}
                id="email-edit"
                type="email"
                variant="standard"
                value={formValues.email}
                onChange={handleChange('email')}
              />
            ) : (
              <Typography>{formValues.email}</Typography>
            )}
          </Box>
          <div>
            <IconButton o
              //nClick={() => toggleEditMode('email')} 
              onClick={() => {
                if (isEditable.email) {
                  // Save the changes if in edit mode
                  handleSave();
                } else {
                  // Enable edit mode if not in edit mode
                  toggleEditMode('email');
                }
              }}
              aria-label={isEditable.email ? 'save' : 'edit'}>
              {isEditable.email ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Password Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>Password:</Typography>
            {isEditable.password ? (
              <Input
                sx={{ width: '70%' }}
                type={showPassword ? 'text' : 'password'}
                value={formValues.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            ) : (
              <Typography>{formValues.password}</Typography>
            )}
          </Box>
          <div>
            <IconButton
              //onClick={() => toggleEditMode('password')}
              onClick={() => {
                if (isEditable.password) {
                  // Save the changes if in edit mode
                  handleSave();
                } else {
                  // Enable edit mode if not in edit mode
                  toggleEditMode('password');
                }
              }}
              aria-label={isEditable.password ? 'save' : 'edit'}>
              {isEditable.password ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Mobile Number Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>Mobile Number:</Typography>
            {isEditable.mobileNumber ? (
              <TextField
                sx={{ width: '70%' }}
                variant="standard"
                type="tel"
                value={formValues.mobileNumber}
                onChange={handleChange('mobileNumber')}
              />
            ) : (
              <Typography>{formValues.mobileNumber}</Typography>
            )}
          </Box>
          <div>
            <IconButton o
              //nClick={() => toggleEditMode('mobileNumber')} 
              onClick={() => {
                if (isEditable.mobileNumber) {
                  // Save the changes if in edit mode
                  handleSave();
                } else {
                  // Enable edit mode if not in edit mode
                  toggleEditMode('mobileNumber');
                }
              }}
              aria-label={isEditable.mobileNumber ? 'save' : 'edit'}>
              {isEditable.mobileNumber ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Nationality Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>Nationality:</Typography>
            {isEditable.nationality ? (
              <TextField
                sx={{ width: '70%' }}
                variant="standard"
                type="text"
                value={formValues.nationality}
                onChange={handleChange('nationality')}
              />
            ) : (
              <Typography>{formValues.nationality}</Typography>
            )}
          </Box>
          <div>
            <IconButton
              //onClick={() => toggleEditMode('nationality')} 
              onClick={() => {
                if (isEditable.nationality) {
                  // Save the changes if in edit mode
                  console.log(1)
                  handleSave();
                } else {
                  // Enable edit mode if not in edit mode
                  toggleEditMode('nationality');
                }
              }}
              aria-label={isEditable.nationality ? 'save' : 'edit'}>
              {isEditable.nationality ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Date of Birth Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>Date of Birth:</Typography>
            {isEditable.dob ? (
              <DatePicker
                label="Select Date"
                value={formValues.dob}
                onChange={handleChange('dob')}
                renderInput={(params) => <TextField {...params} />}
              />
            ) : (
              <Typography>{formValues.dob ? formValues.dob.format('MM/DD/YYYY') : 'N/A'}</Typography>
            )}
          </Box>
          <div>
            <IconButton onClick={() => toggleEditMode('dob')} aria-label={isEditable.dob ? 'save' : 'edit'}>
              {isEditable.dob ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />
        {/* Education State Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: "bold" }}>Education State:</Typography>
            {isEditable.educationState ? (
              <TextField
                sx={{ width: '70%' }}
                variant="standard"
                type="text"
                value={formValues.educationState}
                onChange={handleChange('educationState')}
              />
            ) : (
              <Typography>{formValues.educationState}</Typography>
            )}
          </Box>
          <div>
            <IconButton o
              //nClick={() => toggleEditMode('educationState')} 
              onClick={() => {
                if (isEditable.educationState) {
                  // Save the changes if in edit mode
                  handleSave();
                } else {
                  // Enable edit mode if not in edit mode
                  toggleEditMode('educationState');
                }
              }}
              aria-label={isEditable.educationState ? 'save' : 'edit'}>
              {isEditable.educationState ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Wallet Field */}
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography sx={{ marginRight: 9, fontWeight: "bold" }}>Wallet:</Typography>
            <Typography>{initialWallet}</Typography>
          </Box>
        </Box>
        <Divider />

        {/* Points Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Box>
              <Typography sx={{ marginRight: 9, fontWeight: "bold" }}>Points:</Typography>
              <Typography>{initialPoints}</Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRedeem}
            sx={{
              minWidth: '100px',
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#45a049'
              }
            }}
          >
            Redeem
          </Button>
        </Box>
        <Divider />

        {/* Save All Changes Button */}
        <Button variant="contained" onClick={toggleAllEditMode}>
          {Object.values(isEditable).some(editable => editable) ? 'Save All Changes' : 'Edit All'}
        </Button>
      </Card>
    </LocalizationProvider>
  );
};

export default TouristProfile;