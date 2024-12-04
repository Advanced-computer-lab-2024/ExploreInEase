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
import axios from "axios";

const AddToCartButton = ({ productId }) => {

    const handleAddToCart = async () => {

        const reqbody = {
            productId: productId,
            quantity:1
        }

        const userId = localStorage.getItem("UserId");

        await axios.post(`http://localhost:3030/addCart/${userId}`,reqbody).then((res) => {
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
            handleAddToCart();
        }}
        >
        <AddShoppingCart />
        </IconButton>
    );
    };

export default AddToCartButton;
