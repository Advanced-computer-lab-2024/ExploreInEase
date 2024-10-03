const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Tourist = require('../../models/tourist')
const userController= require('./userController')
const userRepository = require('./userRepository')

router.post('/tourGuide', userController.createTourGuide);
router.get('/tourGuide/:id', userController.getTourGuide);
router.put('/tourGuide/:id', userController.updateTourGuide);

router.post('/advertiser', userController.createAdvertiser);
router.get('/advertiser/:id', userController.getAdvertiser);
router.put('/advertiser/:id', userController.updateAdvertiser);

router.post('/seller', userController.createSeller);
router.get('/seller/:id', userController.getSeller);
router.put('/seller/:id', userController.updateSeller);

router.get('/tourist/:id', userController.getTourist);
router.put('/tourist/:id', userController.updateTourist);

router.get('/fetchAllUsers',userRepository.fetchAllUsers)

module.exports = router;


//flow : controller (checks valid inputs) -> service ( does the actual function i want) -> repo (deals with db)