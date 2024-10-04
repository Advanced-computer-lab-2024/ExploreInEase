const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Tourist = require('../../models/tourist')
const userController= require('./userController')
const userRepository = require('./userRepository')

router.post('/createTourGuide/:_id', userController.createTourGuide);
router.get('/getTourGuide/:_id', userController.getTourGuide);
router.put('/updateTourGuide/:_id', userController.updateTourGuide);

router.post('/createAdvertiser/:_id', userController.createAdvertiser);
router.get('/getAdvertiser/:_id', userController.getAdvertiser);
router.put('/updateAdvertiser/:_id', userController.updateAdvertiser);

router.post('/createSeller/:_id', userController.createSeller);
router.get('/getSeller/:_id', userController.getSeller);
router.put('/updateSeller/:_id', userController.updateSeller);

router.get('/getTourist/:_id', userController.getTourist);
router.put('/updateTourist/:_id', userController.updateTourist);


module.exports = router;



//flow : controller (checks valid inputs) -> service ( does the actual function i want) -> repo (deals with db)