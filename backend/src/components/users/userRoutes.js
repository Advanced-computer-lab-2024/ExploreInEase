const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Tourist = require('../../models/tourist')
const userController= require('./userController')
const userRepository = require('./userRepository')






/**
 * @swagger
 * /createTourGuide/{_id}:
 *   post:
 *     summary: Create a new tour guide profile
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to convert to tour guide
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourGuide'
 *     responses:
 *       201:
 *         description: Tour guide created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourGuide'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /getTourGuide/{_id}:
 *   get:
 *     summary: Retrieve a tour guide profile
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tour guide to retrieve
 *     responses:
 *       200:
 *         description: Tour guide profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourGuide'
 *       404:
 *         description: Tour guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /updateTourGuide/{_id}:
 *   put:
 *     summary: Update a tour guide profile
 *     tags: [Tour Guide]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tour guide to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourGuide'
 *     responses:
 *       200:
 *         description: Tour guide updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TourGuide'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tour guide not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */








router.post('/createTourGuide/:_id', userController.createTourGuide);
router.get('/getTourGuide/:_id', userController.getTourGuide);
router.put('/updateTourGuide/:_id', userController.updateTourGuide);








/**
 * @swagger
 * /createAdvertiser/{_id}:
 *   post:
 *     summary: Create a new advertiser profile
 *     tags: [Advertiser]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to convert to advertiser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Advertiser'
 *     responses:
 *       201:
 *         description: Advertiser profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advertiser'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /getAdvertiser/{_id}:
 *   get:
 *     summary: Retrieve an advertiser profile
 *     tags: [Advertiser]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the advertiser to retrieve
 *     responses:
 *       200:
 *         description: Advertiser profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advertiser'
 *       404:
 *         description: Advertiser not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /updateAdvertiser/{_id}:
 *   put:
 *     summary: Update an advertiser profile
 *     tags: [Advertiser]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the advertiser to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Advertiser'
 *     responses:
 *       200:
 *         description: Advertiser profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advertiser'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Advertiser not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */




router.post('/createAdvertiser/:_id', userController.createAdvertiser);
router.get('/getAdvertiser/:_id', userController.getAdvertiser);
router.put('/updateAdvertiser/:_id', userController.updateAdvertiser);





/**
 * @swagger
 * /createSeller/{_id}:
 *   post:
 *     summary: Create a new seller profile
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to convert to seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seller'
 *     responses:
 *       201:
 *         description: Seller profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seller'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /getSeller/{_id}:
 *   get:
 *     summary: Retrieve a seller profile
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the seller to retrieve
 *     responses:
 *       200:
 *         description: Seller profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seller'
 *       404:
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /updateSeller/{_id}:
 *   put:
 *     summary: Update a seller profile
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the seller to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Seller'
 *     responses:
 *       200:
 *         description: Seller profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seller'
 *       400:
 *         description: Bad Request, validation errors
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Seller not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */



router.post('/createSeller/:_id', userController.createSeller);
router.get('/getSeller/:_id', userController.getSeller);
router.put('/updateSeller/:_id', userController.updateSeller);

/**
 * @swagger
 * /getTourist/{_id}:
 *   get:
 *     summary: Retrieve a tourist profile
 *     tags: [Tourist]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tourist to retrieve
 *     responses:
 *       200:
 *         description: Tourist profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tourist'
 *       404:
 *         description: Tourist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /updateTourist/{_id}:
 *   put:
 *     summary: Update a tourist profile (excluding username and wallet)
 *     tags: [Tourist]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tourist to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tourist'
 *     responses:
 *       200:
 *         description: Tourist profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tourist'
 *       400:
 *         description: Bad Request, cannot update username or wallet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tourist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


router.get('/getTourist/:_id', userController.getTourist);
router.put('/updateTourist/:_id', userController.updateTourist);


module.exports = router;



//flow : controller (checks valid inputs) -> service ( does the actual function i want) -> repo (deals with db)