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
const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    // If the name is 'dateOfBirth', use the value directly, otherwise use event.target.value
    const newValue = name === 'dateOfBirth' ? valueOrEvent : valueOrEvent.target.value;
    
    setFormValues({ ...formValues, [name]: newValue });
  };
  return [formValues, handleChange];
};


const GenericDialog = ({
   username: initialUsername,
    email: initialEmail, 
    password: initialPassword,
     mobileNumber: initialMobile,
     yearExp:initialYearExp,
     prevWork:initialPrevWork,
     languages:initialLanguages }) =>
      
      {
      const [formValues, handleFormChange] = useForm({
        email: initialEmail||'',
        password: initialPassword||'',
        mobileNumber: initialMobile||'',
        yearExp: initialYearExp ||'',
        prevWork:initialPrevWork||'', // Format date to be compatible with DatePicker
        languages: initialLanguages || '',

      });
      const [isEditable, setIsEditable] = useState({
        email: false,
        password: false,
        mobileNumber: false,
        yearExp:false,
        prevWork:false,
        languages:false,
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ padding: 3 }}>
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


            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 4 }}>Mobile Number:</Typography>
              {isEditable.mobileNumber ? (
                <TextField
                  id="mobile-edit"
                  variant="standard"
                  type="text" 
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
              <IconButton onClick={() => toggleEditMode('mobileNumber')} aria-label={isEditable.mobileNumber ? 'save' : 'edit'}>
                {isEditable.mobileNumber ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>



            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: 2 }}>Year of Experience:</Typography>
                {isEditable.yearExp ? (
                  <TextField
                    id="yearExp-edit"
                    variant="standard"
                    type="number"
                    value={formValues.yearExp}
                    onChange={handleFormChange('yearExp')} // Using the generic change handler
                  />
                ) : (
                  <Typography>{formValues.yearExp} </Typography>
                )}
                <IconButton onClick={() =>toggleEditMode('yearExp')} aria-label={isEditable.yearExp ? "save" : "edit"}>
                  {isEditable.yearExp ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: 6 }}>Previous Work:</Typography>
                {isEditable.prevWork ? (
                  <TextField
                    id="PrevWork-edit"
                    variant="standard"
                    type="text"
                    value={formValues.prevWork}
                    onChange={handleFormChange('prevWork')} // Using the generic change handler
                  />
                ) : (
                  <Typography>{formValues.prevWork}</Typography>
                )}
                <IconButton onClick={() =>toggleEditMode('prevWork')} aria-label={isEditable.prevWork ? "save" : "edit"}>
                  {isEditable.prevWork ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ marginRight: 9 }}>Languages:</Typography>
                {isEditable.languages ? (
                  <TextField
                    id="Languages-edit"
                    variant="standard"
                    type="text"
                    value={formValues.languages}
                    onChange={handleFormChange('languages')} // Using the generic change handler
                  />
                ) : (
                  <Typography>{formValues.languages}</Typography>
                )}
                <IconButton onClick={() =>toggleEditMode('languages')} aria-label={isEditable.languages ? "save" : "edit"}>
                  {isEditable.languages ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </Box>
            </Box>

          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default GenericDialog;
