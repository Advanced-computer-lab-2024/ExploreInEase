const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const eventController = require("../events/eventController");

// Route to get user events
router.get("/user/GetMyEvents", eventController.getUserEvents);

// Create activity category
router.post("/createCategory", eventController.createCategory);

// Read all activity categories
router.get("/getAllCategories", eventController.getAllCategories);

// Update by name activity category
router.put("/updateCategoryById/:id", eventController.updateCategoryById);

// Delete by name activity category
router.delete("/deleteCategoryById/:id", eventController.deleteCategoryById);

// Create a new preference tag
router.post("/createTag", eventController.createTag);

// Get all preference tags
router.get("/getAllTags", eventController.getAllTags);

// Update a preference tag by name
router.put("/updateTagById/:id", eventController.updateTagById);

// Delete a preference tag by name
router.delete("/deleteTagById/:id", eventController.deleteTagById);

router.get("/filterUpcommingActivites",eventController.GetupcommingActivitesFilter);

router.get("/upcomingEvents", eventController.getUpcomingEvents);
// Get all activites
router.get("/getAllactivites", eventController.getAllActivities);

router.get("/historicalPlacesByTags", eventController.filterHistoricalPlacesByTags);

module.exports = router;
