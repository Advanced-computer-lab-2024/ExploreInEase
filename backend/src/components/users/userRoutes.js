const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const userController = require('./userController');


router.delete('/users/:username', userController.deleteUserByUsername);
router.post('/addGovernerOrAdmin', userController.addGovernerOrAdmin);



module.exports = router;
