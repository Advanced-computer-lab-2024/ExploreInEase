const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const checkoutController = require('../checkouts/checkoutController');

// Define the route for calculating sales and availability
router.get('/availableQuantityAndSales', checkoutController.availableQuantityAndSales);



module.exports = router;
