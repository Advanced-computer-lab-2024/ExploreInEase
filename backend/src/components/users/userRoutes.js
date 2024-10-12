const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const userController = require('../users/userController');


/**
 * @swagger
 * /deleteUserByIdAndType:
 *   delete:
 *     summary: Delete a user by _id and userType
 *     description: Deletes a user based on the provided userType and prevents self-deletion.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               userType:
 *                 type: string
 *               selfId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid input or trying to delete oneself
 *       403:
 *         description: Unauthorized action
 *       500:
 *         description: Server error
 */
router.delete('/deleteUserByIdAndType', userController.deleteUserByIdAndType);

/**
 * @swagger
 * /addGovernorOrAdmin:
 *   post:
 *     summary: Add a new governor or admin
 *     description: Creates a new tourism governor or admin.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               type:
 *                 type: string
 *               
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server error
 */
router.post('/addGovernorOrAdmin', userController.addGovernorOrAdmin);

/**
 * @swagger
 * /fetchAllUsersAndTourists:
 *   get:
 *     summary: Fetch all users and tourists
 *     description: Retrieve data from the Users and Tourists tables.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved data
 *       500:
 *         description: Server error
 */
router.get('/fetchAllUsersAndTourists', userController.fetchAllUsersAndTourists);






//New Codeeee

router.put('/acceptTerms', userController.acceptTerms);
router.put('/requestDeletion', userController.requestDeletion);
router.get('/deletionrequests', userController.getUsersForDeletion);




module.exports = router;
