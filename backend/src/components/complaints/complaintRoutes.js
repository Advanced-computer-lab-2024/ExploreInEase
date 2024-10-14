const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const complaintController = require("../complaints/complaintController");

// Route for filing a complaint
router.post("/fileComplaint", complaintController.fileComplaint);

module.exports = router;
