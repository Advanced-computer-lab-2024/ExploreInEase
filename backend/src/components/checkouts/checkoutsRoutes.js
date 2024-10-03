const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()


const checkoutController = require('./checkoutController');

// Route to search for products by name
router.get('/searchProductByName/:name', checkoutController.searchProductByName);

module.exports = router;
