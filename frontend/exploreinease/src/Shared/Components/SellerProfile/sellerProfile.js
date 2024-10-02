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

const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    const newValue = name === 'dateOfBirth' ? valueOrEvent : valueOrEvent.target.value;
    setFormValues({ ...formValues, [name]: newValue });
  };
  return [formValues, handleChange];
};

const SellerProfile =(
  {username: initialUsername,
     email: initialEmail,
      password: initialPassword,
      specialties:initialSpecialties})=>{
        const [formValues, handleFormChange] = useForm({
          email: initialEmail||'',
          password: initialPassword||'',
          specialties:initialSpecialties||''
      });
      const [isEditable, setIsEditable] = useState({
        email: false,
        password: false,
        specialties:false
      });
      const firstInitial = formValues.name ? formValues.name.charAt(0).toUpperCase() : '?';

    
    const [showPassword, setShowPassword] = React.useState(initialPassword);


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
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Card sx={{ padding: 3 }}>
    <Avatar
          sx={{
            bgcolor: 'darkblue',
            color: 'white',
            width: 80,
            height: 70,
            fontSize: 24,
            margin: 2,
            alignItems:'center'
          }}
        >
          {firstInitial}
        </Avatar>
      <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete="off">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ marginRight: 9 }}>Username:</Typography>
            <Typography>{initialUsername}</Typography>
          </Box>


              
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 13.5 }}>Email:</Typography>
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
              <Typography sx={{ marginRight: 8 }}>Specialties:</Typography>
              {isEditable.specialties ? (
                <TextField
                  id="description-edit"
                  variant="standard"
                  type="text"
                  value={formValues.specialties}
                  onChange={handleFormChange('specialties')} // Using the generic change handler
                />
              ) : (
                <Typography>{formValues.specialties}</Typography>
              )}
              <IconButton onClick={() => toggleEditMode('specialties')} aria-label={isEditable.specialties ? "save" : "edit"}>
                {isEditable.specialties ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  </div>
  );
};
export default SellerProfile;