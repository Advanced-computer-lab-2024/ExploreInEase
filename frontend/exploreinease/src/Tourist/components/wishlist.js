import React, { useState, useEffect } from "react";
import { Box, Divider, Grid, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import AddToWishListButton from "./AddToWishListButton";
import axios from "axios";

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const UserId = localStorage.getItem("UserId");


  useEffect(() => {
    const getWishList = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/getWishlist/${UserId}`);
        const wishlistData = response.data.wishlist.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          description: item.description,
          ratings: item.ratings,
          image: item.picture, // Update this to match your image storage logic
        }));
        setWishlistItems(wishlistData);

        console.log(wishlistData);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    getWishList();
  }, []);

  const handleRemove = async (id) => {
    await axios.delete(`http://localhost:3030/removeWishlist/${UserId}/${id}`).then((res) => {
      console.log(res.data);
    }
    ).catch((err) => {
      console.log(err);
    });

    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
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
          textAlign: "center",
        }}
      >
        WishList
        <Typography>({wishlistItems.length} products)</Typography>
      </Typography>
      <Box
        sx={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        <Grid container spacing={2}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Box
                sx={{
                  minHeight: "150px",
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
                    {item.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ratings: {item.ratings} / 5
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginRight: "20px" }}
                >
                  ${item.price.toFixed(2)}
                </Typography>
                {/* <AddToWishListButton productId={item.id} /> */}
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
