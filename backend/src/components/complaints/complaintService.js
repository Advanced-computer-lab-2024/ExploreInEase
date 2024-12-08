const complaintRepository = require("../../components/complaints/complaintRepository");
const Tourist = require("../../models/tourist");
const User = require("../../models/user");

//sprint2

//req 72 Creating el complaint
const createComplaint = async (complaintData) => {
  const { touristId } = complaintData;
   console.log(touristId)
  //validiation lel tourist
  const touristExists = await Tourist.findById(touristId);
  if (!touristExists) {
    throw new Error("Invalid Tourist Id: No such tourist found.");
  }

  return await complaintRepository.saveComplaint(complaintData);
};

//re73
const ViewComplain = async (adminId) => {
  const admin = await User.findById(adminId);
  if (!admin || admin.type !== "admin") {
    throw new Error("Access denied. Admins only.");
  }

  try {
    const complaints = await complaintRepository.getAllComplaints();

    return complaints.map((complaint) => ({
      _id: complaint._id,
      title: complaint.title,
      touristId: complaint.touristId ? complaint.touristId._id : null,
      touristName: complaint.touristId ? complaint.touristId.username : "Unknown",
      touristEmail: complaint.touristId ? complaint.touristId.email : "Unknown",
      problem: complaint.problem,
      dateOfComplaint: complaint.dateOfComplaint,
      status: complaint.status,
      reply: complaint.reply,
    }));
  } catch (error) {
    console.error("Error in ViewComplain:", error);
    throw new Error("Failed to retrieve complaints.");
  }
};

const getComplaintDetails = async (adminId, complaintId) => {
  // Validate if the user is an admin
  const admin = await User.findById(adminId);
  if (!admin || admin.type !== "admin") {
    throw new Error("Access denied. Admins only.");
  }
  const complaint = await complaintRepository.getSelectedComplaint(complaintId);
  return {
    complaint,
  };
};

//76
const updateComplaintStatus = async (adminId, complaintId, status) => {
  const admin = await User.findById(adminId);
  if (!admin || admin.type !== "admin") {
    throw new Error("Access denied. Admins only.");
  }

  const updatedComplaint = await complaintRepository.updateStatus(
    complaintId,
    status
  );
  return updatedComplaint;
};

//77
const replyToComplaint = async (adminId, complaintId, reply) => {
  const admin = await User.findById(adminId);
  if (!admin || admin.type !== "admin") {
    throw new Error("Access denied. Admins only.");
  }

  const updatedComplaint = await complaintRepository.addReply(
    complaintId,
    reply
  );
  return updatedComplaint;
};

//80
const getTouristComplaints = async (touristId) => {
  //validiation lel tourist
  const touristExists = await Tourist.findById(touristId);
  if (!touristExists) {
    throw new Error("Invalid Tourist Id: No such tourist found.");
  }
  const complaints = await complaintRepository.findComplaintsByTourist(
    touristId
  );
  if(!complaints){
    return [];
  }
  return complaints.map((complaint) => ({
    _id: complaint._id,
    title:complaint.title,
    problem: complaint.problem,
    dateOfComplaint: complaint.dateOfComplaint,
    status: complaint.status,
    reply: complaint.reply,
  }));
};
//delete
const deleteAllComplaints = async (adminId) => {
  const admin = await User.findById(adminId);
  if (!admin || admin.type !== "admin") {
    throw new Error("Access denied. Admins only.");
  }

  await complaintRepository.deleteAllComplaints();
  return { message: "All complaints have been deleted." };
};
module.exports = {
  createComplaint,
  ViewComplain,
  getComplaintDetails,
  updateComplaintStatus,
  replyToComplaint,
  getTouristComplaints,
  deleteAllComplaints,
};