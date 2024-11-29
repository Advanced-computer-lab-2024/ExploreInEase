const mongoose = require("mongoose");
const Complaint = require("../../models/models/complaint");

//sprint 2

//save complaint
const saveComplaint = async (complaintData) => {
  const complaint = new Complaint(complaintData);
  return await complaint.save();
};

const getAllComplaints = async () => {
  try {
    const complaints = await Complaint.find()
      .populate("touristId", "username email") // Populate tourist details with specific fields
      .sort({ dateOfComplaint: -1 }); // Sort by date in descending order

    return complaints;
  } catch (error) {
    console.error("Error fetching complaints:", error);
    throw new Error("Could not retrieve complaints");
  }
};

const getSelectedComplaint = async (complaintId) => {
  // Validate the complaintId format (should be a valid ObjectId)
  //   if (!mongoose.Types.ObjectId.isValid(complaintId)) {
  // throw new Error("Invalid complaint ID format.");
  //   }

  try {
    console.log(complaintId);
    const complaint = await Complaint.findById(complaintId).populate(
      "touristId",
      "username email"
    ); // Populate tourist details

    if (!complaint) {
      throw new Error("Complaint not found.");
    }
    return complaint;
  } catch (error) {
    console.error("Error fetching complaint details:", error);
    throw new Error("Could not retrieve complaint");
  }
};

//76

const updateStatus = async (complaintId, status) => {
  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { status },
    { new: true } // Return the updated document
  ).populate("touristId", "username email"); // Optionally populate tourist details

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  return complaint;
};

//77
const addReply = async (complaintId, reply) => {
  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { reply },
    { new: true }
  ).populate("touristId", "username email");

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  return complaint;
};

const findComplaintsByTourist = async (touristId) => {
  const complaints = await Complaint.find({ touristId }).populate(
    "touristId",
    "username email"
  );
  return complaints;
};

//delete
const deleteAllComplaints = async () => {
  try {
    await Complaint.deleteMany(); // Delete all complaints
  } catch (error) {
    console.error("Repository Error deleting complaints:", error);
    throw new Error("Could not delete complaints");
  }
};

module.exports = {
  saveComplaint,
  getAllComplaints,
  getSelectedComplaint,
  updateStatus,
  addReply,
  findComplaintsByTourist,
  deleteAllComplaints,
};