const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

const checkoutController = require('../checkouts/checkoutController');

router.post('/addProduct', checkoutController.addProduct);
router.get('/getAvailableProducts', checkoutController.getAvailableProducts);
router.get('/filterProducts', checkoutController.getProductsByPriceRange);
router.put('/editProducts/:productId', checkoutController.updateProduct);
router.get('/sortProducts', checkoutController.getAvailableProductsSortedByRatings);



module.exports = router;