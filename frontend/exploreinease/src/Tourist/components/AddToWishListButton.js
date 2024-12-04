import React, { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";

const AddToWishListButton = ({ productId }) => {

    console.log("prod : ",productId);

    const handleAddToWishList = async () => {

        const reqbody = {
            productId: productId
        }

        const userId = localStorage.getItem("UserId");

        await axios.post(`http://localhost:3030/addWishlist/${userId}`,reqbody).then((res) => {
            console.log(res.data);
            console.log("Added to cart", productId);

            }).catch((err) => {
            console.log(err);
            }
        );
    };


    return (
        <IconButton
        onClick={() => {
            // Add to cart
            // console.log("Added to cart", product);
            handleAddToWishList();
        }}
        >
        <FavoriteIcon />
        </IconButton>
    );
    };

export default AddToWishListButton;
