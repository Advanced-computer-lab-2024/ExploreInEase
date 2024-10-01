const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const userController = require('../users/userController');


router.delete('/deleteUserByUsername', userController.deleteUserByUsername);
router.post('/addGovernerOrAdmin', userController.addGovernerOrAdmin);
router.get('/getAvailableProducts', userController.getAvailableProducts);



module.exports = router;
