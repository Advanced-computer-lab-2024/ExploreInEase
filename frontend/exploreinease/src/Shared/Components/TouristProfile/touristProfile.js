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

const EducationStateDropDown = [
  {
    value: 'Student',
    label: 'Student',
  },
  {
    value: 'Employee',
    label: 'Employee',
  },
];
const useForm = (initialValues) => {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (name) => (valueOrEvent) => {
    // If the name is 'dateOfBirth', use the value directly, otherwise use event.target.value
    const newValue = name === 'dateOfBirth' ? valueOrEvent : valueOrEvent.target.value;
    
    setFormValues({ ...formValues, [name]: newValue });
  };
  return [formValues, handleChange];
};



const TouristProfile = ({
  username: initialUsername,
  email: initialEmail,
  password: initialPassword,
  mobileNumber: initialMobile,
  nationality: initialNat,
  dateOfBirth: initialDateOfBirth,
  educationState: initialEducationState,
  wallet: initialWallet,
  currency: initialCurrency
}) => {
  const [formValues, handleFormChange] = useForm({
    email: initialEmail||null,
    password: initialPassword||null,
    mobileNumber: initialMobile||null,
    nationality: initialNat ||null,
    dateOfBirth:initialDateOfBirth||null, // Format date to be compatible with DatePicker
    educationState: initialEducationState || null,
    wallet: initialWallet || 0, // Default to 0 if wallet is not provided
    currency: initialCurrency
  });

  const [isEditable, setIsEditable] = useState({
    email: false,
    password: false,
    mobileNumber: false,
    nationality: false,
    dateOfBirth: false,
    educationState: false,
    wallet: false,
    currency: false
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
  
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
                    pattern: "[0-9]{10}", // Example pattern for a 10-digit number
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

       
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 8 }}>Nationality:</Typography>
              {isEditable.nationality ? (
                <TextField
                  id="nationality-edit"
                  variant="standard"
                  value={formValues.nationality}
                  onChange={handleFormChange('nationality')}
                />
              ) : (
                <Typography>{formValues.nationality}</Typography>
              )}
              <IconButton onClick={() => toggleEditMode('nationality')} aria-label={isEditable.nationality ? 'save' : 'edit'}>
                {isEditable.nationality ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
             
         
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 8 }}>Date of Birth:</Typography>
              {isEditable.dateOfBirth ? (
                // <DatePicker 
                //   value={formValues.dateOfBirth} 
                //   onChange={(newValue) => handleFormChange('dateOfBirth')(newValue)} // Handle change correctly
                //   slotProps={{ textField: { variant: 'outlined' } }}             />
                <TextField
                id="email-edit"
                variant="standard"
                type="date"
                value={formValues.dateOfBirth}
                onChange={handleFormChange('email')}
              />
             
              ) : (
                <Typography>{formValues.dateOfBirth?.format('DD/MM/YYYY')}</Typography> // Adjust format as needed
              )}
              <IconButton onClick={() => toggleEditMode('dateOfBirth')} aria-label={isEditable.dateOfBirth ? 'save' : 'edit'}>
                {isEditable.dateOfBirth ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>

        
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 3 }}>Education State:</Typography>
              {isEditable.educationState ? (
                      <TextField
                      id="standard-select-currency-native"
                      select
                      onChange={handleFormChange('educationState')}
                      slotProps={{
                        select: {
                          native: true,
                        },
                      }}
                      variant="standard"
                    >
                      {EducationStateDropDown.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
              ) : (
                <Typography>{formValues.educationState}</Typography>
              )}
              <IconButton onClick={() => toggleEditMode('educationState')} aria-label={isEditable.educationState ? 'save' : 'edit'}>
                {isEditable.educationState ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>

        
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: 0 }}>Wallet:</Typography>
              <Typography sx={{ marginLeft: 1 }}>{formValues.currency}</Typography>
              <Typography>{formValues.wallet}</Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </div>
    </LocalizationProvider>
  );
};

export default TouristProfile;
