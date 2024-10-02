const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const userController = require('../users/userController');


router.delete('/deleteUserByIdAndType', userController.deleteUserByIdAndType);
router.post('/addGovernerOrAdmin', userController.addGovernerOrAdmin);
router.get('/fetchAllUsersAndTourists', userController.fetchAllUsersAndTourists);




module.exports = router;
