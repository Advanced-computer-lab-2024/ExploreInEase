import React, { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { Remove, Add, Close } from "@mui/icons-material";
import StepperNavigation from "./StepperNavigation";
import CheckoutPage from "./CheckoutPage";


const CartPage = () => {

    const [activeStep] = useState(0); // Active step for stepper navigation
    const [isCheckoutView, setIsCheckoutView] = useState(false);
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

    const [promoCode, setPromoCode] = useState("");

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

            {isCheckoutView ? (
                <CheckoutPage cartItems={cartItems} />
            ) : (

            <><Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
                        Cart ({cartItems.length} products)
                    </Typography><Grid container spacing={4}>
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
                                        onClick={() => setIsCheckoutView(true)}
                                        sx={{
                                            marginTop: "20px",
                                            backgroundColor: "#1261A0",
                                            color: "#fff",
                                        }}
                                    >
                                        Continue to Checkout
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid></>
            )}
        </Box>
    );
};

export default CartPage;
