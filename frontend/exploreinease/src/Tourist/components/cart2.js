import React, { useState,useEffect } from "react";
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
import axios from "axios";
import AddToWishListButton from "./AddToWishListButton";
import AddToCartButton from "./AddToCartButton";

const CartPage = () => {

    const [activeStep] = useState(1); // Active step for stepper navigation
    const [cartItems, setCartItems] = useState([
      // {
      //   id: 1,
      //   product_id: '672a3f5b09ecb52acb373c37',
      //   name: "Apple AirPods Pro",
      //   color: "White",
      //   price: 249.99,
      //   count: 1,
      //   image: "https://via.placeholder.com/80", // Replace with real image
      // },
      // {
      //   id: 2,
      //   product_id: '672a4032287be6cf170d66a6',
      //   name: "Apple AirPods Max",
      //   color: "Silver",
      //   price: 549.99,
      //   count: 1,
      //   image: "https://via.placeholder.com/80", // Replace with real image
      // },
      // {
      //   id: 3,
      //   product_id: '672a4061287be6cf170d66a8',
      //   name: "Apple HomePod Mini",
      //   color: "Silver",
      //   price: 99.99,
      //   count: 1,
      //   image: "https://via.placeholder.com/80", // Replace with real image
      // },
    ]);

    localStorage.setItem("UserId", "6752e7c65f08a3b694655e6b");

  const UserId= localStorage.getItem("UserId");

  

  useEffect(()=>{
    
      //Fetch cart items from API

  
  
      const fetchCart = async () => {
        try {
          const res = await axios.get(`http://localhost:3030/getCart/${UserId}`);
          const fetchedProducts = res.data.products || [];
    
          const formattedItems = fetchedProducts.map((product) => ({
            id: product._id,
            product_id: product._id,
            name: product.name,
            color: product.color || "N/A", // If no color provided
            price: product.price,
            count: product.quantity,
            image: `http://localhost:3030/uploads/${product.picture}` // Adjust base URL as needed
          }));

          console.log(formattedItems);
    
          setCartItems(formattedItems);
        } catch (err) {
          console.log(err);
        }
      };
    
      fetchCart();
    
  }, []);

  const [promoCode, setPromoCode] = useState("");

  const handleIncrease = async (id) => {
    const itemIndex = cartItems.findIndex((item) => item.id === id);
    let newCount; // to store the updated quantity

  setCartItems((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        newCount = item.count + 1;
        return { ...item, count: newCount };
      }
      return item;
    })
  );

  // Use newCount in the request URL
  await axios
    .put(`http://localhost:3030/editQuantityInCart/${UserId}/${itemIndex}/${newCount}`)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });


  };

  const handleDecrease = async (id) => {
    const itemIndex = cartItems.findIndex((item) => item.id === id);
    let newCount; // to store the updated quantity

  setCartItems((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        newCount = item.count - 1;
        return { ...item, count: newCount };
      }
      return item;
    })
  );

  // Use newCount in the request URL
  await axios
    .put(`http://localhost:3030/editQuantityInCart/${UserId}/${itemIndex}/${newCount}`)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  const handleRemove = async (id) => {

    await axios.delete(`http://localhost:3030/removeCart/${UserId}/${id}`).then((res) => {
      console.log(res.data);
    }
    ).catch((err) => {
      console.log(err);
    });


    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.count, 0);
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Add StepperNavigation */}
      <StepperNavigation activeStep={activeStep} />

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
                      }}
                    />
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
                    <AddToWishListButton productId={item.product_id} />  
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
              sx={{ marginBottom: "20px" }}
            />
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
              sx={{
                marginTop: "20px",
                backgroundColor: "#1261A0",
                color: "#fff",
              }}

              onClick={() => {
                console.log("final cart items",cartItems);
              }
              }

            >
              Continue to Checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;