const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Tourist = require('../../models/tourist')
const userController= require('./userController')
const userRepository = require('./userRepository')

router.post('/tourGuide', userController.createTourGuide);
router.get('/tourGuide/:id', userController.getTourGuide);
router.put('/updatedTourGuide/:id', userController.updateTourGuide);

router.post('/advertiser', userController.createAdvertiser);
router.get('/advertiser/:_id', userController.getAdvertiser);
router.put('/advertiser/:_id', userController.updateAdvertiser);

router.post('/seller', userController.createSeller);
router.get('/seller/:_id', userController.getSeller);
router.put('/seller/:_id', userController.updateSeller);

router.get('/tourist/:_id', userController.getTourist);
router.put('/tourist/:_id', userController.updateTourist);

router.get('/fetchAllUsers',userRepository.fetchAllUsers)

module.exports = router;



//flow : controller (checks valid inputs) -> service ( does the actual function i want) -> repo (deals with db)