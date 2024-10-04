const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()


const eventController = require('./eventController');

// Routes for creating and getting preference tags
router.post('/createHistoricalTag', eventController.createHistoricalTag);
router.get('/getHistoricalTag', eventController.getAllTags);


router.get('/touristSearch', eventController.search);




module.exports = router;
