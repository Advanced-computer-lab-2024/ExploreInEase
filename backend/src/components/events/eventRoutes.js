const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const eventController = require("../events/eventController");

router.get("/upcomingEvents", eventController.getUpcomingEvents);

router.get("/filterUpcommingActivites",eventController.GetupcommingActivitesFilter);

router.get("/filteritineraries",eventController.getFilteredItineraries);

router.get("/historicalPlacesByTags", eventController.filterHistoricalPlacesByTags);





//sprint 2




module.exports = router;

