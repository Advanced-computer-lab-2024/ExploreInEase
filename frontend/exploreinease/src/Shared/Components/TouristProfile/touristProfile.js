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
import Button from '@mui/material/Button'; // Import Button
import { useLocation } from 'react-router-dom';

const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    const newValue = name === 'dateOfBirth' ? valueOrEvent : valueOrEvent.target.value;
    setFormValues({ ...formValues, [name]: newValue });
  };

  return [formValues, handleChange];
};

const TouristProfile = (props) => {
  const {
    username: initialUsername,
    email: initialEmail,
    password: initialPassword,
    mobileNumber: initialMobile,
    nationality: initialNat,
    dateOfBirth: initialDateOfBirth,
    educationState: initialEducationState,
    wallet: initialWallet,
    currency: initialCurrency,
  } = props;

  const [formValues, handleChange] = useForm({
    email: initialEmail || '',
    password: initialPassword || '',
    mobileNumber: initialMobile || '',
    nationality: initialNat || '',
    dateOfBirth: initialDateOfBirth || null,
    educationState: initialEducationState || '',
    wallet: initialWallet || '0',
    currency: initialCurrency || '',
  });

  const [isEditable, setIsEditable] = useState({
    email: false,
    password: false,
    mobileNumber: false,
    nationality: false,
    dateOfBirth: false,
    educationState: false,
    wallet: false,
  });
  const location=useLocation();
  const { tourist } = location.state || {};  
  const firstInitial = tourist?.username ? tourist?.username.charAt(0).toUpperCase() : '?';
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
  const toggleAllEditMode = () => {
    const allEditable = Object.values(isEditable).some(editable => editable);
    const newEditableState = {
      email: true,
      password: true,
      mobileNumber: true,
      nationality: true,
      dateOfBirth: true,
      educationState: true,
      wallet: true,
     
    };
    setIsEditable(newEditableState);

    if (allEditable) {
      handleSave(); // Save values if switching to non-editable mode
    }
  };
  const handleSave = () => {
    setIsEditable({
      email: false,
    password: false,
    mobileNumber: false,
    nationality: false,
    dateOfBirth: false,
    educationState: false,
    wallet: false,
    });
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
            <Typography sx={{ marginRight: 9, fontWeight:"bold" }}>Username:</Typography>
            <Typography>{initialUsername}</Typography>
          </Box>
        </Box>
        <Divider />

        {/* Email Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight:"bold" }}>Email:</Typography>
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
            <IconButton onClick={() => toggleEditMode('email')} aria-label={isEditable.email ? 'save' : 'edit'}>
              {isEditable.email ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Password Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight:"bold" }}>Password:</Typography>
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
            <IconButton onClick={() => toggleEditMode('password')} aria-label={isEditable.password ? 'save' : 'edit'}>
              {isEditable.password ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Mobile Number Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight:"bold" }}>Mobile Number:</Typography>
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
            <IconButton onClick={() => toggleEditMode('mobileNumber')} aria-label={isEditable.mobileNumber ? 'save' : 'edit'}>
              {isEditable.mobileNumber ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Nationality Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight:"bold" }}>Nationality:</Typography>
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
            <IconButton onClick={() => toggleEditMode('nationality')} aria-label={isEditable.nationality ? 'save' : 'edit'}>
              {isEditable.nationality ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Date of Birth Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight:"bold" }}>Date of Birth:</Typography>
            {isEditable.dateOfBirth ? (
              <DatePicker
                value={formValues.dateOfBirth}
                onChange={(newValue) => handleChange('dateOfBirth')(newValue)}
                renderInput={(params) => <TextField {...params} sx={{ width: '70%' }} variant="standard" />}
              />
            ) : (
              <Typography>{formValues.dateOfBirth?.format('DD/MM/YYYY')}</Typography>
            )}
          </Box>
          <div>
            <IconButton onClick={() => toggleEditMode('dateOfBirth')} aria-label={isEditable.dateOfBirth ? 'save' : 'edit'}>
              {isEditable.dateOfBirth ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Education State Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight:"bold" }}>Education State:</Typography>
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
            <IconButton onClick={() => toggleEditMode('educationState')} aria-label={isEditable.educationState ? 'save' : 'edit'}>
              {isEditable.educationState ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />

        {/* Wallet Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography>Wallet:</Typography>
            {isEditable.wallet ? (
              <TextField
                sx={{ width: '70%' }}
                variant="standard"
                type="text"
                value={formValues.wallet}
                onChange={handleChange('wallet')}
              />
            ) : (
              <Typography>{formValues.wallet}</Typography>
            )}
          </Box>
          <div>
            <IconButton onClick={() => toggleEditMode('wallet')} aria-label={isEditable.wallet ? 'save' : 'edit'}>
              {isEditable.wallet ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider />
        <Divider sx={{ mb: 2 }} />
        <Button variant="contained" color="primary" onClick={toggleAllEditMode}>
          {Object.values(isEditable).some(editable => editable) ? 'Save All' : 'Edit All'}
        </Button>
      </Card>
    </LocalizationProvider>
  );
};

export default TouristProfile;
