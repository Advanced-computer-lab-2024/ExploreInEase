const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const userController = require('../users/userController');


router.delete('/deleteUserByUsername', userController.deleteUserByUsername);
router.post('/addGovernerOrAdmin', userController.addGovernerOrAdmin);
router.get('/upcomingEvents/:username', userController.getTouristUpcommingEvents);


module.exports = router;
