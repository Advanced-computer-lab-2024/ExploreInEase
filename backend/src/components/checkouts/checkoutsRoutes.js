const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const checkoutController = require('../checkouts/checkoutController');

// Define the route for calculating sales and availability
router.get('/availableQuantityAndSales', checkoutController.availableQuantityAndSales);




//New ElNew code 


// Route to create an order
router.post('/createOrderWalletOrCod', checkoutController.createOrderWalletOrCod);


// Route to create an order with card payment
router.post('/createOrderCard', checkoutController.createOrderWithCard);



// Route for viewing delivered orders
router.get('/myOrders/:touristId/:currency', checkoutController.viewMyOrders);





// Route for canceling an order
router.delete('/cancelOrders', checkoutController.cancelOrder);





module.exports = router;
