const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const eventController = require('../events/eventController');

/**
 * @swagger
 * /GetMyEvents:
 *   get:
 *     summary: Retrieve user events by user ID and userType
 *     tags: [Events]
 *     parameters:
 *       - in: body
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *       - in: body
 *         name: userType
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's type
 *     responses:
 *       200:
 *         description: A list of events for the user
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.get('/GetMyEvents', eventController.getUserEvents);

/**
 * @swagger
 * /createCategory:
 *   post:
 *     summary: Create a new activity category
 *     tags: [Activity Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

// Create activity category
router.post('/createCategory', eventController.createCategory);


/**
 * @swagger
 * /getAllCategories:
 *   get:
 *     summary: Retrieve all activity categories
 *     tags: [Activity Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *       500:
 *         description: Server error
 */

// Read all activity categories
router.get('/getAllCategories', eventController.getAllCategories); 



/**
 * @swagger
 * /updateCategoryById/{id}:
 *   put:
 *     summary: Update an activity category by ID
 *     tags: [Activity Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the category
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */


// Update by name activity category
router.put('/updateCategoryById/:id', eventController.updateCategoryById);


/**
 * @swagger
 * /deleteCategoryById/{id}:
 *   delete:
 *     summary: Delete an activity category by ID
 *     tags: [Activity Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

// Delete by name activity category
router.delete('/deleteCategoryById/:id', eventController.deleteCategoryById); 

/**
 * @swagger
 * /createTag:
 *   post:
 *     summary: Create a new preference tag
 *     tags: [Preference Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the tag
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
// Create a new preference tag
router.post('/createTag', eventController.createTag);


/**
 * @swagger
 * /getAllTags:
 *   get:
 *     summary: Retrieve all preference tags
 *     tags: [Preference Tags]
 *     responses:
 *       200:
 *         description: A list of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *       500:
 *         description: Server error
 */
// Get all preference tags
router.get('/getAllTags', eventController.getAllTags);


/**
 * @swagger
 * /updateTagById/{id}:
 *   put:
 *     summary: Update a preference tag by ID
 *     tags: [Preference Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tag to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the tag
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */

// Update a preference tag by name
router.put('/updateTagById/:id', eventController.updateTagById);


/**
 * @swagger
 * /deleteTagById/{id}:
 *   delete:
 *     summary: Delete a preference tag by ID
 *     tags: [Preference Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tag to delete
 *     responses:
 *       200:
 *         description: Tag deleted successfully
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */

// Delete a preference tag by name
router.delete('/deleteTagById/:id', eventController.deleteTagById);

module.exports = router;
