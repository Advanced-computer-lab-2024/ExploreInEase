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
  
    const handleClickShowPassword = () => {
      setShowPassword((prevShow) => !prevShow);
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  

  return(
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Card sx={{ padding: 3 }}>
      <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete="off">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ marginRight: 9 }}>Username:</Typography>
            <Typography>{initialUsername}</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 16 }}>Email:</Typography>
              {isEditable.email ? (
                <TextField
                  id="email-edit"
                  variant="standard"
                  value={formValues.email}
                  onChange={handleFormChange('email')}      
                />
              ) : (
                <Typography>{formValues.email}</Typography>
              )}
              <IconButton onClick={() => toggleEditMode('email')} aria-label={isEditable.email ? 'save' : 'edit'}>
                {isEditable.email ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Box>


          <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 9 }}>Password:</Typography>
              {isEditable.password ? (
                <Input
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
              <IconButton onClick={() => toggleEditMode('password')} aria-label={isEditable.password ? 'save' : 'edit'}>
                {isEditable.password ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>


          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 15 }}>Hotline:</Typography>
              {isEditable.hotline ? (
                <TextField
                  id="hotline-edit"
                  variant="standard"
                  type="number"
                  value={formValues.hotline}
                   onChange={handleFormChange('hotline')}// Using the generic change handler
                />
              ) : (
                <Typography>{formValues.hotline}</Typography>
              )}
              <IconButton onClick={() => toggleEditMode('hotline') } aria-label={isEditable.hotline ? "save" : "edit"}>
                {isEditable.hotline ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 10 }}>Website Link:</Typography>
              {isEditable.webLink ? (
                <TextField
                  id="webLink-edit"
                  variant="standard"
                  type="url"
                  value={formValues.webLink}
                  onChange={handleFormChange('webLink')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.webLink}</Typography>
              )}
              <IconButton onClick={() => toggleEditMode('webLink')} aria-label={isEditable.webLink ? "save" : "edit"}>
                {isEditable.webLink ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 8 }}>Linkedin Profile:</Typography>
              {isEditable.companyLinkedinProfile ? (
                <TextField
                  id="Linkedin-edit"
                  variant="standard"
                  type="url"
                  value={formValues.companyLinkedinProfile}
                  onChange={handleFormChange('companyLinkedinProfile')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.companyLinkedinProfile}</Typography>
              )}
              <IconButton onClick={() => toggleEditMode('companyLinkedinProfile')} aria-label={isEditable.companyLinkedinProfile ? "save" : "edit"}>
                {isEditable.companyLinkedinProfile ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Box>


          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 14 }}>Industry:</Typography>
              {isEditable.industry ? (
                <TextField
                  id="industry-edit"
                  variant="standard"
                  type="link"
                  value={formValues.industry}
                  onChange={handleFormChange('industry')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.industry}</Typography>
              )}
              <IconButton onClick={() => toggleEditMode('industry')} aria-label={isEditable.industry ? "save" : "edit"}>
                {isEditable.industry ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 2 }}>Number of Employees:</Typography>
              {isEditable.companySize ? (
                <TextField
                  id="hotline-edit"
                  variant="standard"
                  type="text"
                  value={formValues.companySize}
                  onChange={handleFormChange('companySize')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.companySize}</Typography>
              )}
              <IconButton onClick={() => toggleEditMode('companySize')} aria-label={isEditable.companySize ? "save" : "edit"}>
                {isEditable.companySize ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 8 }}>Year of Release:</Typography>
              {isEditable.yearOfRelease ? (
                <TextField
                  id="YearOfRelease-edit"
                  variant="standard"
                  type="link"
                  value={formValues.yearOfRelease}
                  onChange={handleFormChange('yearOfRelease')} 
                />
              ) : (
                <Typography>{formValues.yearOfRelease}</Typography>
              )}
              <IconButton onClick={() =>toggleEditMode('yearOfRelease')} aria-label={isEditable.yearOfRelease ? "save" : "edit"}>
                {isEditable.yearOfRelease ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>    
    </Card>
  </div>
  );
};
export default AdvertiserProfile;