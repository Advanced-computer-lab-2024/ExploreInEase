const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const checkoutController=require("../checkouts/checkoutController");


router.patch('/products/:productId', checkoutController.archiveOrUnarchiveProduct);


module.exports = router;