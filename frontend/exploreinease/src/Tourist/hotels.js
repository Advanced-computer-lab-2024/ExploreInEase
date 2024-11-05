import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, Grid, InputLabel, FormControl, Box, Typography, Card, CardContent } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
const Hotels =()=>{
    const [searchParams, setSearchParams] = useState({
        startDate: null,
        endDate: null,
        peopleCount: null,
        currency: '',
      });
      const handleDateChange = (field) => (date) => {
        setSearchParams((prev) => ({ ...prev, [field]: date }));
      };
    
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSearch = () => {
        // Implement the logic to search hotels with the searchParams data
        console.log("Search parameters:", searchParams);
        setSearchParams({
            startDate: null,
            endDate: null,
            peopleCount: null,
            currency: '', 
        });
        // You can use searchParams.startDate, searchParams.endDate, etc. to make an API call
      };
    

      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Card sx={{ width: '100%', maxWidth: 500, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Hotel Search
                </Typography>
                <Grid container spacing={3}>
                  {/* Start Date */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <DatePicker
                      label="startDate"
                        value={searchParams.startDate}
                        onChange={handleDateChange('startDate')}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </FormControl>
                  </Grid>
                  {/* End Date */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <DatePicker
                      label="endDate"
                        value={searchParams.endDate}
                        onChange={handleDateChange('endDate')}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </FormControl>
                  </Grid>
                  {/* People Count */}
                  <Grid item xs={12}>
                    <TextField
                      label="Number of People"
                      type="number"
                      value={searchParams.peopleCount}
                      onChange={handleInputChange}
                      fullWidth
                      InputProps={{ inputProps: { min: 1 }, startAdornment: <PeopleIcon sx={{ color: 'action.active', mr: 1 }} /> }}
                    />
                  </Grid>
                  {/* Currency */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        label="currency"
                        value={searchParams.currency}
                        onChange={handleInputChange}
                        startAdornment={<AttachMoneyIcon sx={{ color: 'action.active', mr: 1 }} />}
                      >
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                        <MenuItem value="EGP">EGP</MenuItem>

                        {/* Additional currency options */}
                      </Select>
                    </FormControl>
                  </Grid>
    
                  {/* Search Button */}
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSearch}
                      sx={{ mt: 2, p: 1.5 }}
                    >
                      Search Hotels
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </LocalizationProvider>
      );
}
export default Hotels;
