const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const userController = require('../users/userController');


router.get('/upcomingEvents/:username', userController.getTouristUpcommingEvents);


module.exports = router;
