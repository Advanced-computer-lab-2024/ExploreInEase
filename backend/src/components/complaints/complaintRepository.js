const Complaint = require("../../models/complaint");

//sprint 2

//save complaint
const saveComplaint = async (complaintData) => {
  const complaint = new Complaint(complaintData);
  return await complaint.save();
};

module.exports = {
  saveComplaint,
};
