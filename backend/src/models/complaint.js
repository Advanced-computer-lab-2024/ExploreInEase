const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Complaints schema
const complaintSchema = new Schema({
  title:{
    type: String,
    required: true,
  },
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist", // Reference to the Tourist model mesh el schema
    required: true,
  },
  problem: {
    type: String,
    required: true,
  },
  dateOfComplaint: {
    type: Date,
    default: Date.now, // bey7ot el date lew7adoo
  },
  status: {
    type: String,
    enum: ["pending", "resolved"], // Enum for status (resolved when there is a reply)
    default: "pending", // Default status is pending
  },
  reply: {
    type: String,
    default: "", // Admin reply, can be an empty string if not yet replied
  },
});

// Create the Complaint model
const Complaint = mongoose.models.Complaint ||mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
