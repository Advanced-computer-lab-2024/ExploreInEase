import React, { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AddShoppingCart } from "@mui/icons-material";








const WishList = () => {
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

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Box
      sx={{
        display: "grid",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
         <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "0px",
            textAlign: "center",
          }}
        >
          WishList 
          <Typography>({cartItems.length} products)</Typography>
          
        </Typography>
      <Box
        sx={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          padding: "50px",
        }}
      >
       

        <Grid container spacing={2}>
          {cartItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#f5f5f5",
                  marginBottom: "10px",
                }}
              >
                <Box sx={{ marginRight: "20px" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "10px",
                    }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.color}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginRight: "20px" }}
                >
                  ${item.price.toFixed(2)}
                </Typography>
                <IconButton>
                    <AddShoppingCart />
                </IconButton>
                <IconButton onClick={() => handleRemove(item.id)}>
                  <Close />
                </IconButton>
              </Box>
              <Divider />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default WishList;
