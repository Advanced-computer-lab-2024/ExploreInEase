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
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button'; // Import Button
import NetworkService from '../../../NetworkService';
import { useLocation } from 'react-router-dom';

const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    const newValue = name === 'dateOfBirth' ? valueOrEvent : valueOrEvent.target.value;
    setFormValues({ ...formValues, [name]: newValue });
  };
  return [formValues, handleChange];
};

const SellerProfile = (props) => {
  const location=useLocation();
  const { tourist } = location.state || {};  
  console.log(tourist);
  
  const initialUsername = tourist?.username || '';
  const initialEmail = tourist?.email || '';
  const initialPassword = tourist?.password || '';

  const {
  specialties: initialSpecialties,
  }= props;
  const [formValues, handleFormChange] = useForm({
    email: initialEmail || '',
    password: initialPassword || '',
    specialties: initialSpecialties || '',
  });

  const [isEditable, setIsEditable] = useState({
    email: false,
    password: false,
    specialties: false,
  });
  const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
  const [showPassword, setShowPassword] = React.useState(initialPassword);

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
      specialties: true,

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
      specialties: false,

    });
  };

  return (
      
      <Card sx={{ padding: 3, width: '90%', margin: 'auto',marginTop:2 }}>
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

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 9 ,fontWeight:"bold"}}>Username:</Typography>
              <Typography>{initialUsername}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <Typography sx={{ marginRight: 13.5,fontWeight:"bold" }}>Email:</Typography>
              {isEditable.email ? (
                <TextField id="email-edit" variant="standard" fullWidth value={formValues.email} onChange={handleFormChange('email')} />
              ) : (
                <Typography>{formValues.email}</Typography>
              )}
              <div>
              <IconButton onClick={() => toggleEditMode('email')} aria-label={isEditable.email ? 'save' : 'edit'}>
                {isEditable.email ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ marginRight: 9,fontWeight:"bold" }}>Password:</Typography>
              {isEditable.password ? (
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={formValues.password}
                  onChange={handleFormChange('password')}
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
              <div>
              <IconButton onClick={() => toggleEditMode('password')} aria-label={isEditable.password ? 'save' : 'edit'}>
                {isEditable.password ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ marginRight: 8,fontWeight:"bold" }}>Specialties:</Typography>
              {isEditable.specialties ? (
                <TextField id="specialties-edit" fullWidth variant="standard" value={formValues.specialties} onChange={handleFormChange('specialties')} />
              ) : (
                <Typography>{formValues.specialties}</Typography>
              )}
              <div>
              <IconButton onClick={() => toggleEditMode('specialties')} aria-label={isEditable.specialties ? 'save' : 'edit'}>
                {isEditable.specialties ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>
            <Divider sx={{ mb: 2 }} />

              <Button variant="contained" color="primary" onClick={toggleAllEditMode}>
                {Object.values(isEditable).some(editable => editable) ? 'Save All' : 'Edit All'}
              </Button>
      </Card>
  );
};

export default SellerProfile;
