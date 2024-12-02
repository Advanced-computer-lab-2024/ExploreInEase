import React, { useState } from "react";
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
import { Remove, Add, Close } from "@mui/icons-material";
import StepperNavigation from "./StepperNavigtion";
// import CheckoutPage from "./CheckoutPage";
import './Payment.css'; // Add your styles here
const CartPage = () => {
    const [promoCode, setPromoCode] = useState("");
    const [activeStep,setActiveStep] = useState(0); 
    const [isFlipped, setIsFlipped] = useState(false);
    const [isCheckoutView, setIsCheckoutView] = useState(false);
    const [isPaymentProceed, setIsPaymentProceed] = useState(false);
    const theme = useTheme();
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isBackVisible, setIsBackVisible] = useState(false);
    const [deliveryInfo, setDeliveryInfo] = useState({
      name: '',
      mobile: '',
      email: '',
      city: '',
      state: '',
      zip: '',
      address: ''
    });
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Apple AirPods Pro",
            color: "White",
            price: 249.99,
            count: 1,
            image: "https://via.placeholder.com/80", // Replace with real image
        },
        {
            id: 2,
            name: "Apple AirPods Max",
            color: "Silver",
            price: 549.99,
            count: 1,
            image: "https://via.placeholder.com/80", // Replace with real image
        },
        {
            id: 3,
            name: "Apple HomePod Mini",
            color: "Silver",
            price: 99.99,
            count: 1,
            image: "https://via.placeholder.com/80", // Replace with real image
        },
    ]);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        cvv: '',
      });
      const handleChange = (field, value) => {
        setCardDetails((prev) => ({
          ...prev,
          [field]: value,
        }));
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails((prev) => ({ ...prev, [name]: value }));
      };
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
    
      const handleOnClickButton=(title)=>{
         if (title=='Continue to Checkout'){
            setIsPaymentProceed(false);
            setActiveStep(1);
            setIsCheckoutView(true);
        } else if (title =='Proceed to Payment'){
            setIsCheckoutView(false);
            setActiveStep(2);
            setIsPaymentProceed(true);
        }else {

        }
      }

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
    const handleIncrease = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, count: item.count + 1 } : item
            )
        );
    };

    const handleDecrease = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.count > 1
                    ? { ...item, count: item.count - 1 }
                    : item
            )
        );
    };

    const handleRemove = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.count, 0);
    };

    return (
        <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Add StepperNavigation */}
            <StepperNavigation activeStep={activeStep} />
            {isCheckoutView && !isPaymentProceed && (
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
                          onClick={() =>handleOnClickButton("Proceed to Payment")}
                        >
                          Proceed to Payment
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Container>            ) }
            {!isCheckoutView && !isPaymentProceed &&
                (   
            <>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
                        Cart ({cartItems.length} products)
                    </Typography>
                    <Grid container spacing={4}>
                            {/* Cart Items Section */}
                            <Grid item xs={12} md={8}>
                                <Box
                                    sx={{
                                        backgroundColor: "#fff",
                                        borderRadius: "10px",
                                        padding: "20px",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    {cartItems.map((item) => (
                                        <Box key={item.id} sx={{ marginBottom: "20px" }}>
                                            <Grid container alignItems="center">
                                                <Grid item xs={2}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        style={{
                                                            width: "80px",
                                                            height: "80px",
                                                            borderRadius: "10px",
                                                        }} />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography variant="subtitle1">{item.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.color}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <IconButton onClick={() => handleDecrease(item.id)}>
                                                            <Remove />
                                                        </IconButton>
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                margin: "0 10px",
                                                                fontWeight: "bold",
                                                                width: "20px",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {item.count}
                                                        </Typography>
                                                        <IconButton onClick={() => handleIncrease(item.id)}>
                                                            <Add />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                                        ${item.price.toFixed(2)}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <IconButton onClick={() => handleRemove(item.id)}>
                                                        <Close />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                            <Divider sx={{ margin: "10px 0" }} />
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>

                            {/* Promo Code & Summary Section */}
                            <Grid item xs={12} md={4}>
                                <Box
                                    sx={{
                                        backgroundColor: "#f9f9f9",
                                        borderRadius: "10px",
                                        padding: "20px",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                                        Promo Code
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="Type here..."
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        sx={{ marginBottom: "20px" }} />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ backgroundColor: "#1261A0", color: "#fff", marginBottom: "20px" }}
                                    >
                                        Apply
                                    </Button>

                                    <Divider sx={{ marginBottom: "20px" }} />

                                    <Typography variant="body1" sx={{ display: "flex", justifyContent: "space-between" }}>
                                        Subtotal: <span>${calculateTotal().toFixed(2)}</span>
                                    </Typography>
                                    <Typography variant="body1" sx={{ display: "flex", justifyContent: "space-between" }}>
                                        Discount: <span>-$0.00</span>
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontWeight: "bold",
                                            marginTop: "20px",
                                        }}
                                    >
                                        Total: <span>${calculateTotal().toFixed(2)}</span>
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => handleOnClickButton("Continue to Checkout")}
                                        sx={{
                                            marginTop: "20px",
                                            backgroundColor: "#1261A0",
                                            color: "#fff",
                                        }}
                                    >Continue to Checkout
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid></>
            )}
            { isPaymentProceed && !isCheckoutView && 
            (

                <Grid container spacing={4}>
                  <Box sx={{ p: 4, textAlign: "center",marginTop:7}}>
  {/* Credit Card Display */}
  <Box sx={{ perspective: "1000px", margin: "0 auto", width: 300,marginBottom:7 }}>
    <Box
      className={`credit-card ${isFlipped ? "flipped" : ""}`}
      onClick={() => setIsFlipped((prev) => !prev)} // Optional manual flipping
      sx={{
        width: 300,
        height: 180,
        position: "relative",
        transformStyle: "preserve-3d",
        transition: "transform 0.6s",
      }}
    >
      {/* Front Side */}
      <Paper
        className="credit-card-front"
        sx={{
          p: 2,
          width: "100%",
          height: "100%",
          color: "white",
          borderRadius: 2,
          position: "absolute",
          backfaceVisibility: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(145deg, #1976d2, #0d47a1)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
          Visa
        </Typography>
        <Box
          sx={{
            width: 50,
            height: 30,
            backgroundColor: "silver",
            borderRadius: 1,
            mb: 2,
          }}
        />
        <Typography variant="h6" sx={{ letterSpacing: 2 }}>
          {cardDetails.cardNumber || "•••• •••• •••• ••••"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            px: 2,
            mt: 2,
          }}
        >
          <Typography variant="body1">
            {cardDetails.expiryDate || "MM/YY"}
          </Typography>
          <Typography variant="body1">
            {cardDetails.cardholderName || "Cardholder Name"}
          </Typography>
        </Box>
      </Paper>

      {/* Back Side */}
      <Paper
        className="credit-card-back"
        sx={{
          p: 2,
          width: "100%",
          height: "100%",
          color: "white",
          borderRadius: 2,
          position: "absolute",
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(145deg, #1976d2, #0d47a1)",
        }}
      >
        <Box
          className="magnetic-strip"
          sx={{ width: "100%", height: 40, backgroundColor: "#333", mb: 2 }}
        />
        <Typography variant="body1" sx={{ mt: 4, textAlign: "center" }}>
          CVV: {cardDetails.cvv || "•••"}
        </Typography>
      </Paper>
    </Box>
  </Box>

  {/* Input Fields */}
  <Card sx={{ mt: 4, p: 3, boxShadow: 3 }}>
  <CardContent>
    <Typography variant="h5" gutterBottom>
      Credit Card Details
    </Typography>
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
      <TextField
        label="Card Number"
        type="text"
        inputProps={{ maxLength: 19 }}
        placeholder="1234 5678 9012 3456"
        value={cardDetails.cardNumber}
        onChange={(e) =>
          handleChange(
            "cardNumber",
            e.target.value.replace(/[^0-9]/g, "").replace(/(.{4})/g, "$1 ").trim()
          )
        }
        onFocus={() => setIsFlipped(false)} // Ensure card stays on front
      />
      <TextField
        label="Expiry Date"
        type="text"
        placeholder="MM/YY"
        value={cardDetails.expiryDate}
        onChange={(e) => handleChange("expiryDate", e.target.value)}
        onFocus={() => setIsFlipped(false)} // Ensure card stays on front
      />
      <TextField
        label="Cardholder Name"
        type="text"
        placeholder="John Doe"
        value={cardDetails.cardholderName}
        onChange={(e) => handleChange("cardholderName", e.target.value)}
        onFocus={() => setIsFlipped(false)} // Ensure card stays on front
      />
      <TextField
        label="CVV"
        type="text"
        inputProps={{ maxLength: 3 }}
        placeholder="123"
        value={cardDetails.cvv}
        onChange={(e) =>
          handleChange("cvv", e.target.value.replace(/[^0-9]/g, ""))
        }
        onFocus={() => setIsFlipped(true)} // Flip to back
        onBlur={() => setIsFlipped(false)} // Flip back to front when focus is lost
      />
    </Box>
  </CardContent>
</Card>

</Box>

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
                            <Typography>{calculateSubtotal().toFixed(2)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="text.secondary">
                              promoCode discount 
                            </Typography>
                            {promoCode.length>0?(  
                           <Typography >
                             30%
                            </Typography>):(
                                     <Typography>
                                     0%
                                    </Typography>
                            )}
                       
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography color="text.secondary">Shipping</Typography>
                            <Typography>FREE</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Total 
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {calculateSubtotal().toFixed(2)}
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
                          onClick={() =>handleOnClickButton("Proceed to Payment")}
                        >
                          Proceed to Payment
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
              </Grid>

            )
           }

        </Box>
    );
};

export default CartPage;
