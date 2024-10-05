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
import Button from '@mui/material/Button'; 

const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    // If the name is 'dateOfBirth', use the value directly, otherwise use event.target.value
    const newValue = name === 'dateOfBirth' ? valueOrEvent : valueOrEvent.target.value;
    
    setFormValues({ ...formValues, [name]: newValue });
  };
  return [formValues, handleChange];
};
const AdvertiserProfile =({
  username: initialUsername, 
   email: initialEmail,
   password: initialPassword,
   webLink:initialWebLink,
   hotline:initialHotline,
   companyLinkedinProfile:initialCompanyLinkedinProfile,
   industry:initialIndustry,
   companySize:initialCompanySize,
   yearOfRelease:initialYearOfRelease
  })=>{
    const [formValues, handleFormChange] = useForm({
      email: initialEmail ||'',
      password: initialPassword ||'',
      webLink:initialWebLink  ||'',
      hotline:initialHotline  ||'',
      companyLinkedinProfile:initialCompanyLinkedinProfile  ||'',
      industry:initialIndustry  ||'',
      companySize:initialCompanySize ||'',
      yearOfRelease:initialYearOfRelease ||''
    } );
    const [isEditable, setIsEditable] = useState({
      email: false,
      password: false,
      webLink: false,
      hotline: false,
      companyLinkedinProfile: false,
      industry: false,
      companySize: false,
      yearOfRelease: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const toggleEditMode = (field) => {
      setIsEditable((prev) => ({
        ...prev,
        [field]: !prev[field]
      }));
    };
    const firstInitial = initialUsername ? initialUsername.charAt(0).toUpperCase() : '?';
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
        webLink: true,
        hotline: true,
        companyLinkedinProfile: true,
        industry: true,
        companySize: true,
        yearOfRelease: true
  
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
        webLink: false,
        hotline: false,
        companyLinkedinProfile: false,
        industry: false,
        companySize: false,
        yearOfRelease: false
  
      });
    };
  return(
    <Card sx={{ padding: 3 }}>
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
            <Typography sx={{ marginRight: 9,fontWeight:"bold" }}>Username:</Typography>
            <Typography>{initialUsername}</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ marginRight: 16,fontWeight:"bold" }}>Email:</Typography>
              {isEditable.email ? (
                <TextField
                fullWidth
                  id="email-edit"
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



          <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ marginRight: 9,fontWeight:"bold" }}>Password:</Typography>
              {isEditable.password ? (
                <Input
                fullWidth
                  id="standard-adornment-password"
                  type={showPassword ? 'text' : 'password'}
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

            <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              
              <Typography sx={{ marginRight: 15,fontWeight:"bold" }}>Hotline:</Typography>
              {isEditable.hotline ? (
                <TextField
                fullWidth
                  id="hotline-edit"
                  variant="standard"
                  type="number"
                  value={formValues.hotline}
                   onChange={handleFormChange('hotline')}// Using the generic change handler
                />
              ) : (
                <Typography>{formValues.hotline}</Typography>
              )}
                <div>
              <IconButton onClick={() => toggleEditMode('hotline') } aria-label={isEditable.hotline ? "save" : "edit"}>
                {isEditable.hotline ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>
            <Divider sx={{ mb: 2 }} />


            <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ marginRight: 10,fontWeight:"bold" }}>Website Link:</Typography>
              {isEditable.webLink ? (
                <TextField
                fullWidth
                  id="webLink-edit"
                  variant="standard"
                  type="url"
                  value={formValues.webLink}
                  onChange={handleFormChange('webLink')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.webLink}</Typography>
              )}
               <div>

              <IconButton onClick={() => toggleEditMode('webLink')} aria-label={isEditable.webLink ? "save" : "edit"}>
                {isEditable.webLink ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>
  
            <Divider sx={{ mb: 2 }} />

            <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ marginRight: 8 ,fontWeight:"bold"}}>Linkedin Profile:</Typography>
              {isEditable.companyLinkedinProfile ? (
                <TextField
                fullWidth
                  id="Linkedin-edit"
                  variant="standard"
                  type="url"
                  value={formValues.companyLinkedinProfile}
                  onChange={handleFormChange('companyLinkedinProfile')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.companyLinkedinProfile}</Typography>
              )}
              <div>
              <IconButton onClick={() => toggleEditMode('companyLinkedinProfile')} aria-label={isEditable.companyLinkedinProfile ? "save" : "edit"}>
                {isEditable.companyLinkedinProfile ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>
    
            <Divider sx={{ mb: 2 }} />


            <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ marginRight: 14,fontWeight:"bold" }}>Industry:</Typography>
              {isEditable.industry ? (
                <TextField
                fullWidth
                  id="industry-edit"
                  variant="standard"
                  type="link"
                  value={formValues.industry}
                  onChange={handleFormChange('industry')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.industry}</Typography>
              )}
              <div>
              <IconButton onClick={() => toggleEditMode('industry')} aria-label={isEditable.industry ? "save" : "edit"}>
                {isEditable.industry ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>
            <Divider sx={{ mb: 2 }} />


            <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ marginRight: 2,fontWeight:"bold" }}>Number of Employees:</Typography>
              {isEditable.companySize ? (
                <TextField
                fullWidth
                  id="hotline-edit"
                  variant="standard"
                  type="text"
                  value={formValues.companySize}
                  onChange={handleFormChange('companySize')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.companySize}</Typography>
              )}
              <div>
              <IconButton onClick={() => toggleEditMode('companySize')} aria-label={isEditable.companySize ? "save" : "edit"}>
                {isEditable.companySize ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ marginRight: 8 ,fontWeight:"bold"}}>Year of Release:</Typography>
              {isEditable.yearOfRelease ? (
                <TextField
                fullWidth
                  id="YearOfRelease-edit"
                  variant="standard"
                  type="link"
                  value={formValues.yearOfRelease}
                  onChange={handleFormChange('yearOfRelease')} 
                />
              ) : (
                <Typography>{formValues.yearOfRelease}</Typography>
              )}
              <div>
              <IconButton onClick={() =>toggleEditMode('yearOfRelease')} aria-label={isEditable.yearOfRelease ? "save" : "edit"}>
                {isEditable.yearOfRelease ? <SaveIcon /> : <EditIcon />}
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
export default AdvertiserProfile;