const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const eventController = require('../events/eventController');

// Route to get user events
router.get('/user/GetMyEvents', eventController.getUserEvents);

// Create activity category
router.post('/categories', eventController.createCategory);

// Read all activity categories
router.get('/categories', eventController.getAllCategories); 

// Update by name activity category
router.put('/categories/:categoryName', eventController.updateCategoryByName);

// Delete by name activity category
router.delete('/categories/:categoryName', eventController.deleteCategoryByName); 

// Create a new preference tag
router.post('/tags', eventController.createTag);

// Get all preference tags
router.get('/tags', eventController.getAllTags);

// Update a preference tag by name
router.put('/tags/:tagName', eventController.updateTagByName);

// Delete a preference tag by name
router.delete('/tags/:tagName', eventController.deleteTagByName);

module.exports = router;
