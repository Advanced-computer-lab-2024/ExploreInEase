import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button'; // Import Button
import NetworkService from '../../../NetworkService';
import { useLocation } from 'react-router-dom';


const tourGuide={};
const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    const newValue = name === 'dateOfBirth' ? valueOrEvent : valueOrEvent.target.value;
    
    setFormValues({ ...formValues, [name]: newValue });
  };
  return [formValues, handleChange];
};

const GenericDialog  = (props) => {
  const location=useLocation();
  const { TourGuide } = location.state || {};  
  const initialUsername = TourGuide?.username || '';

  console.log(TourGuide);
  const{ 
   email: initialEmail, 
   password: initialPassword,
   mobileNumber: initialMobile,
   yearExp: initialYearExp,
   prevWork: initialPrevWork,
   languages: initialLanguages } =props;
    

  const [formValues, handleFormChange] = useForm({
    email: initialEmail || '',
    password: initialPassword || '',
    mobileNumber: initialMobile || '',
    yearExp: initialYearExp || '',
    prevWork: initialPrevWork || '',
    languages: initialLanguages || '',
  });

  const [isEditable, setIsEditable] = useState({
    email: false,
    password: false,
    mobileNumber: false,
    yearExp: false,
    prevWork: false,
    languages: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';

  const toggleEditMode = (field) => {
    setIsEditable((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const toggleAllEditMode = () => {
    const allEditable = Object.values(isEditable).some(editable => editable);
    const newEditableState = {
      email: true,
      password: true,
      mobileNumber: true,
      yearExp: true,
      prevWork: true,
      languages: true,
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
      yearExp: false,
      prevWork: false,
      languages: false,
    });
  };
  const handleClickShowPassword = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
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

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ marginRight: 9, fontWeight: "bold" }}>Username:</Typography>
          <Typography>{initialUsername}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ marginRight: 4, fontWeight: "bold" }}>Email:</Typography>
          {isEditable.email ? (
            <TextField
              id="email-edit"
              fullWidth
              variant="standard"
              value={formValues.email}
              onChange={handleFormChange('email')}
            />
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

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ marginRight: 9, fontWeight: "bold" }}>Password:</Typography>
          {isEditable.password ? (
            <Input
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={formValues.password}
              fullWidth
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

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ marginRight: 4, fontWeight: "bold" }}>Mobile Number:</Typography>
          {isEditable.mobileNumber ? (
            <TextField
              id="mobile-edit"
              variant="standard"
              type="text"
              fullWidth
              inputProps={{
                pattern: "[0-9]{10}",
                maxLength: 11
              }}
              value={formValues.mobileNumber}
              onChange={handleFormChange('mobileNumber')}
            />
          ) : (
            <Typography>{formValues.mobileNumber}</Typography>
          )}
          <div>
            <IconButton onClick={() => toggleEditMode('mobileNumber')} aria-label={isEditable.mobileNumber ? 'save' : 'edit'}>
              {isEditable.mobileNumber ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ marginRight: 2, fontWeight: "bold" }}>Year of Experience:</Typography>
          {isEditable.yearExp ? (
            <TextField
              id="yearExp-edit"
              variant="standard"
              type="number"
              fullWidth
              value={formValues.yearExp}
              onChange={handleFormChange('yearExp')}
            />
          ) : (
            <Typography>{formValues.yearExp} </Typography>
          )}
          <div>
            <IconButton onClick={() => toggleEditMode('yearExp')} aria-label={isEditable.yearExp ? "save" : "edit"}>
              {isEditable.yearExp ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ marginRight: 6, fontWeight: "bold" }}>Previous Work:</Typography>
          {isEditable.prevWork ? (
            <TextField
              id="PrevWork-edit"
              variant="standard"
              type="text"
              fullWidth
              value={formValues.prevWork}
              onChange={handleFormChange('prevWork')}
            />
          ) : (
            <Typography>{formValues.prevWork}</Typography>
          )}
          <div>
            <IconButton onClick={() => toggleEditMode('prevWork')} aria-label={isEditable.prevWork ? "save" : "edit"}>
              {isEditable.prevWork ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </div>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ marginRight: 9, fontWeight: "bold" }}>Languages:</Typography>
          {isEditable.languages ? (
            <TextField
              id="languages-edit"
              variant="standard"
              type="text"
              fullWidth
              value={formValues.languages}
              onChange={handleFormChange('languages')}
            />
          ) : (
            <Typography>{formValues.languages}</Typography>
          )}
          <div>
            <IconButton onClick={() => toggleEditMode('languages')} aria-label={isEditable.languages ? "save" : "edit"}>
              {isEditable.languages ? <SaveIcon /> : <EditIcon />}
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

export default GenericDialog;
