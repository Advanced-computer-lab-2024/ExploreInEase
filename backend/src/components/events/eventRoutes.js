const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()


const eventController = require('./eventController');

// Routes for creating and getting preference tags
router.post('/preferenceTags', eventController.createTag);
router.get('/preferenceTags', eventController.getAllTags);


router.get('/touristSearch', eventController.search);




module.exports = router;
