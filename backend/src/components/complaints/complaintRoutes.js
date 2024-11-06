const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const complaintController = require("../complaints/complaintController");

// Route for filing a complaint
router.post("/fileComplaint/:touristId/:problem/:title", complaintController.fileComplaint);

router.get("/ViewComplaints", complaintController.AdminViewComplain);

router.get("/ViewSelectedComplaint/:complaintId",complaintController.AdminViewSelectedComplain);

router.patch("/markComplaint/:complaintId",complaintController.markComplaint);

router.patch("/replyComplaint/:complaintId",complaintController.replyToComplaint);

router.get("/myComplaints/:touristId", complaintController.getMyComplaints);

router.delete("/deleteAllComplaints", complaintController.deleteAllComplaints);
module.exports = router;