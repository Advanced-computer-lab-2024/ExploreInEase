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

//
const tourGuide = {};
const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    const newValue = name === 'dateOfBirth' ? valueOrEvent : valueOrEvent.target.value;

    setFormValues({ ...formValues, [name]: newValue });
  };
  return [formValues, handleChange];
};

const GenericDialog = (props) => {
  const location = useLocation();
  const { TourGuide } = location.state || {};
  console.log("test ", TourGuide);
  const initialUsername = TourGuide?.username || '';
  const initialEmail = TourGuide?.email || '';
  const initialPassword = TourGuide?.password || '';
  const initialMobile = TourGuide?.hotline || '';
  const initialexperience = TourGuide?.experience || '';
  const initialpreviousWork = TourGuide?.previousWork || '';
  const initialLanguages = TourGuide?.languages || '';

  console.log(initialUsername, initialEmail, initialMobile)

  const [formValues, handleFormChange] = useForm({
    email: initialEmail || '',
    password: initialPassword || '',
    hotline: initialMobile || '',
    experience: initialexperience || '',
    previousWork: initialpreviousWork || '',
    languages: initialLanguages || '',
  });

  const [isEditable, setIsEditable] = useState({
    email: false,
    password: false,
    hotline: false,
    experience: false,
    previousWork: false,
    languages: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';

  const toggleEditMode = async (field) => {
    setIsEditable((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
    if (!isEditable) {
      console.log("isEditable is false")
      handleSave();
    }

  };

  const toggleAllEditMode = () => {
    const allEditable = Object.values(isEditable).some(editable => editable);
    const newEditableState = {
      email: true,
      password: true,
      hotline: true,
      experience: true,
      previousWork: true,
      languages: true,
    };
    setIsEditable(newEditableState);

    if (allEditable) {
      console.log(1)
      handleSave(); // Save values if switching to non-editable mode
    }
  };
  const handleSave = async () => {
    const updatedTourGuide = {
      email: formValues.email,
      hotline: formValues.hotline,
      password: formValues.password,
      experience: formValues.experience,
      previousWork: formValues.previousWork,
      languages: formValues.languages.split(', ')
    };
    const options = {
      apiPath: `/updateTourGuide/${TourGuide._id}`,
      // urlParam: TourGuide._id,
      body: updatedTourGuide,
    };
    const response = await NetworkService.put(options);
    console.log("Response: ", response);
    // Update frontend form with the updated values
    handleFormChange({
      ...formValues,
      email: response.email,
      hotline: response.mobileNum,
      dateOfBirth: response.dateOfBirth, // Convert back to Day.js format if needed
    });
    setIsEditable({
      email: false,
      password: false,
      hotline: false,
      experience: false,
      previousWork: false,
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
          <IconButton 
          //onClick={() => toggleEditMode('email')}
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
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ marginRight: 4, fontWeight: "bold" }}>Mobile Number:</Typography>
        {isEditable.hotline ? (
          <TextField
            id="mobile-edit"
            variant="standard"
            type="text"
            fullWidth
            inputProps={{
              pattern: "[0-9]{10}",
              maxLength: 11
            }}
            value={formValues.hotline}
            onChange={handleFormChange('hotline')}
          />
        ) : (
          <Typography>{formValues.hotline}</Typography>
        )}
        <div>
          <IconButton onClick={() => {
            if (isEditable.hotline) {
              // Save the changes if in edit mode
              handleSave();
            } else {
              // Enable edit mode if not in edit mode
              toggleEditMode('hotline');
            }
          }} aria-label={isEditable.hotline ? 'save' : 'edit'}>
            {isEditable.hotline ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </div>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ marginRight: 2, fontWeight: "bold" }}>Year of Experience:</Typography>
        {isEditable.experience ? (
          <TextField
            id="experience-edit"
            variant="standard"
            type="number"
            fullWidth
            value={formValues.experience}
            onChange={handleFormChange('experience')}
          />
        ) : (
          <Typography>{formValues.experience} </Typography>
        )}
        <div>
          <IconButton 
          //onClick={() => toggleEditMode('experience')}
            onClick={() => {
              if (isEditable.experience) {
                // Save the changes if in edit mode
                handleSave();
              } else {
                // Enable edit mode if not in edit mode
                toggleEditMode('experience');
              }
            }}
            aria-label={isEditable.experience ? "save" : "edit"}>
            {isEditable.experience ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </div>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ marginRight: 6, fontWeight: "bold" }}>Previous Work:</Typography>
        {isEditable.previousWork ? (
          <TextField
            id="previousWork-edit"
            variant="standard"
            type="text"
            fullWidth
            value={formValues.previousWork}
            onChange={handleFormChange('previousWork')}
          />
        ) : (
          <Typography>{formValues.previousWork}</Typography>
        )}
        <div>
          <IconButton 
          //onClick={() => toggleEditMode('previousWork')}
            onClick={() => {
              if (isEditable.previousWork) {
                // Save the changes if in edit mode
                handleSave();
              } else {
                // Enable edit mode if not in edit mode
                toggleEditMode('previousWork');
              }
            }}
            aria-label={isEditable.previousWork ? "save" : "edit"}>
            {isEditable.previousWork ? <SaveIcon /> : <EditIcon />}
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
          <IconButton
            //onClick={() => toggleEditMode('languages')} 

            onClick={() => {
              if (isEditable.languages) {
                // Save the changes if in edit mode
                handleSave();
              } else {
                // Enable edit mode if not in edit mode
                toggleEditMode('languages');
              }
            }} aria-label={isEditable.languages ? "save" : "edit"}>
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