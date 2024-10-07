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
import NetworkService from '../../../NetworkService';
import { useLocation } from 'react-router-dom';

const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    // If the name is 'dateOfBirth', use the value directly, otherwise use event.target.value
    const newValue = name === 'dateOfBirth' ? valueOrEvent : valueOrEvent.target.value;
    
    setFormValues({ ...formValues, [name]: newValue });
  };
  return [formValues, handleChange];
};
const AdvertiserProfile = (props) => {
  const location=useLocation();
  const { advertiser } = location.state || {};  

  const initialUsername = advertiser?.advertiser.username || '';
  const initialEmail = advertiser?.advertiser.email || '';
  const initialPassword = advertiser?.advertiser.password || '';
  const initiallinkWebsite = advertiser?.advertiser.linkWebsite || '';
  const initialHotline = advertiser?.advertiser.hotline || '';
  const initiallinkedInLink = advertiser?.advertiser.linkedInLink || '';
  const initialIndustry = advertiser?.advertiser.industry || '';
  const initialnoEmployees = advertiser?.advertiser.noEmployees || '';
  const initialfounded = advertiser?.advertiser.founded || '';

  const [formValues, handleFormChange] = useForm({
    username: initialUsername || '',
    email: initialEmail || '',
    password: initialPassword || '',
    linkWebsite: initiallinkWebsite || '',
    hotline: initialHotline || '',
    linkedInLink: initiallinkedInLink || '',
    industry: initialIndustry || '',
    noEmployees: initialnoEmployees || '',
    founded: initialfounded || '',
  });

    const [isEditable, setIsEditable] = useState({
      email: false,
      password: false,
      linkWebsite: false,
      hotline: false,
      linkedInLink: false,
      industry: false,
      noEmployees: false,
      founded: false
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
        linkWebsite: true,
        hotline: true,
        linkedInLink: true,
        industry: true,
        noEmployees: true,
        founded: true
  
      };
      setIsEditable(newEditableState);
  
      if (allEditable) {
        handleSave(); // Save values if switching to non-editable mode
      }
    };
    const handleSave = async () => {
      const updatedAdvertiser = {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
        linkWebsite: formValues.linkWebsite,
        hotline: formValues.hotline,
        linkedInLink: formValues.linkedInLink,
        industry: formValues.industry,
        noEmployees: formValues.noEmployees,
        founded: formValues.founded
      };
      const options = {
        apiPath: `/updateAdvertiser/${advertiser.advertiser._id}`,
        urlParam: advertiser.advertiser._id,
        body: updatedAdvertiser,
      };
      const response = await NetworkService.put(options);
      console.log('Response: ', response);

      handleFormChange({
        ...formValues,
        email: response.advertiser.email,
        password: response.advertiser.password,
        linkWebsite: response.advertiser.linkWebsite,
        hotline: response.advertiser.hotline,
        linkedInLink: response.advertiser.linkedInLink,
        industry: response.advertiser.industry,
        noEmployees: response.advertiser.noEmployees,
        founded: response.advertiser.founded
      });

      setIsEditable({
        email: false,
        password: false,
        linkWebsite: false,
        hotline: false,
        linkedInLink: false,
        industry: false,
        noEmployees: false,
        founded: false
  
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
              {isEditable.linkWebsite ? (
                <TextField
                fullWidth
                  id="linkWebsite-edit"
                  variant="standard"
                  type="url"
                  value={formValues.linkWebsite}
                  onChange={handleFormChange('linkWebsite')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.linkWebsite}</Typography>
              )}
               <div>

              <IconButton onClick={() => toggleEditMode('linkWebsite')} aria-label={isEditable.linkWebsite ? "save" : "edit"}>
                {isEditable.linkWebsite ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>
  
            <Divider sx={{ mb: 2 }} />

            <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ marginRight: 8 ,fontWeight:"bold"}}>Linkedin Profile:</Typography>
              {isEditable.linkedInLink ? (
                <TextField
                fullWidth
                  id="Linkedin-edit"
                  variant="standard"
                  type="url"
                  value={formValues.linkedInLink}
                  onChange={handleFormChange('linkedInLink')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.linkedInLink}</Typography>
              )}
              <div>
              <IconButton onClick={() => toggleEditMode('linkedInLink')} aria-label={isEditable.linkedInLink ? "save" : "edit"}>
                {isEditable.linkedInLink ? <SaveIcon /> : <EditIcon />}
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
              {isEditable.noEmployees ? (
                <TextField
                fullWidth
                  id="hotline-edit"
                  variant="standard"
                  type="text"
                  value={formValues.noEmployees}
                  onChange={handleFormChange('noEmployees')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.noEmployees}</Typography>
              )}
              <div>
              <IconButton onClick={() => toggleEditMode('noEmployees')} aria-label={isEditable.noEmployees ? "save" : "edit"}>
                {isEditable.noEmployees ? <SaveIcon /> : <EditIcon />}
              </IconButton>
              </div>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ marginRight: 8 ,fontWeight:"bold"}}>Year of Release:</Typography>
              {isEditable.founded ? (
                <TextField
                fullWidth
                  id="founded-edit"
                  variant="standard"
                  type="link"
                  value={formValues.founded}
                  onChange={handleFormChange('founded')} 
                />
              ) : (
                <Typography>{formValues.founded}</Typography>
              )}
              <div>
              <IconButton onClick={() =>toggleEditMode('founded')} aria-label={isEditable.founded ? "save" : "edit"}>
                {isEditable.founded ? <SaveIcon /> : <EditIcon />}
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