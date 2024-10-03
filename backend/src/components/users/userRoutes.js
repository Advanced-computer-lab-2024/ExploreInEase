const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const userController = require('../users/userController');


router.delete('/deleteUserByUsername', userController.deleteUserByUsername);
router.post('/addGovernerOrAdmin', userController.addGovernerOrAdmin);
router.post('/addProduct', userController.addProduct);
router.get('/getAvailableProducts', userController.getAvailableProducts);
router.get('/filterProducts', userController.getProductsByPriceRange);
router.put('/editProducts/:productId', userController.updateProduct);



module.exports = router;
