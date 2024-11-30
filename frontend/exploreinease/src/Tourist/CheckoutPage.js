import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Paper,
  IconButton,
  Card,
  CardContent,
  Divider,
  Container,
  FormControl,
  FormLabel,
  useTheme
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';

const CheckoutPage = ({ cartItems = [] }) => {
  const theme = useTheme();
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    state: '',
    zip: '',
    address: ''
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const handleDateSelect = (date) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter(d => d !== date));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Section - Delivery Information */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Delivery Information
          </Typography>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={deliveryInfo.name}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, name: e.target.value})}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={deliveryInfo.mobile}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, mobile: e.target.value})}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={deliveryInfo.email}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, email: e.target.value})}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={deliveryInfo.city}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, city: e.target.value})}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={deliveryInfo.state}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, state: e.target.value})}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ZIP"
                  value={deliveryInfo.zip}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, zip: e.target.value})}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={deliveryInfo.address}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                  variant="outlined"
                  size="small"
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            {/* Calendar */}
            <Box sx={{ mt: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                mb: 2,
                px: 2
              }}>
                <IconButton onClick={handlePrevMonth} size="small">
                  <ChevronLeft />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {monthName}
                </Typography>
                <IconButton onClick={handleNextMonth} size="small">
                  <ChevronRight />
                </IconButton>
              </Box>

              <Grid container spacing={1}>
                {days.map(day => (
                  <Grid item xs={12/7} key={day}>
                    <Typography 
                      align="center" 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: theme.palette.text.secondary
                      }}
                    >
                      {day}
                    </Typography>
                  </Grid>
                ))}
                {[...Array(firstDayOfMonth)].map((_, index) => (
                  <Grid item xs={12/7} key={`empty-${index}`} />
                ))}
                {[...Array(daysInMonth)].map((_, index) => {
                  const currentDate = index + 1;
                  const isSelected = selectedDates.includes(currentDate);
                  
                  return (
                    <Grid item xs={12/7} key={currentDate}>
                      <Button
                        fullWidth
                        onClick={() => handleDateSelect(currentDate)}
                        sx={{
                          minWidth: 0,
                          borderRadius: '50%',
                          aspectRatio: '1',
                          p: 0,
                          backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
                          color: isSelected ? 'white' : theme.palette.text.primary,
                          '&:hover': {
                            backgroundColor: isSelected 
                              ? theme.palette.primary.dark 
                              : theme.palette.action.hover
                          }
                        }}
                      >
                        {currentDate}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            {/* Payment Method */}
            <Box sx={{ mt: 4 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                    Payment Method
                  </Typography>
                </FormLabel>
                <RadioGroup row defaultValue="cash">
                  <FormControlLabel 
                    value="online" 
                    control={<Radio />} 
                    label="Online Payment"
                    sx={{ mr: 4 }}
                  />
                  <FormControlLabel 
                    value="cash" 
                    control={<Radio />} 
                    label="Cash on Delivery"
                    sx={{ mr: 4 }}
                  />
                  <FormControlLabel 
                    value="pos" 
                    control={<Radio />} 
                    label="POS on Delivery"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Paper>
        </Grid>

        {/* Right Section - Order Summary */}
        <Grid item xs={12} lg={4}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Order Summary
          </Typography>

          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cartItems.map((item) => (
                  <Box 
                    key={item.id} 
                    sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: theme.palette.action.hover
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      sx={{ 
                        width: 64, 
                        height: 64, 
                        objectFit: 'cover', 
                        borderRadius: 1,
                        border: `1px solid ${theme.palette.divider}`
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.code}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        ${parseFloat(item.price).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 1,
                      bgcolor: theme.palette.action.hover,
                      borderRadius: 1,
                      p: 0.5
                    }}>
                      <IconButton size="small">
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton size="small">
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>${calculateSubtotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography>FREE</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Total (USD)
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    ${calculateSubtotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  bgcolor: "#1261A0",
                  '&:hover':  "#1261A0",
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;