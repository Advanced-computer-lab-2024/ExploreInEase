const complaintService = require("../complaints/complaintService");

//sprint 2

//req 74 (tourist file complain)
const fileComplaint = async (req, res) => {
  //console.log("i am here");
  try {
    const { touristId } = req.params;

    const {  problem } = req.params;
    const {  title } = req.params;
    console.log(touristId)
    console.log(problem)


    if (!touristId || !problem|| !title) {
      return res.status(400).json({
        success: false,
        message: "tourist Id and problem description  is required.",
      });
    }

    const complaint = await complaintService.createComplaint(req.params);
    return res.status(201).json({
      success: true,
      message: "Complaint filed successfully.",
      complaint,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "An error occurred while filing the complaint.",
      details: error.message,
    });
  }
};

//req 75 (admin view complain)
const AdminViewComplain = async (req, res) => {
  try {
    const { adminId } = req.query;
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin id needed ",
      });
    }

    const complaints = await complaintService.ViewComplain(adminId);


    if (complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found." });
    }
    return res.status(201).json({
      success: true,
      total: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the complaint.",
      details: error.message,
    });
  }
};

//75 view selected complian
const AdminViewSelectedComplain = async (req, res) => {
  try {
    const { adminId } = req.query;
    const { complaintId } = req.params;
    console.log(complaintId);
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin id needed ",
      });
    }
    const complaint = await complaintService.getComplaintDetails(
      adminId,
      complaintId
    );
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the complaint.",
      details: error.message,
    });
  }
};

//76
const markComplaint = async (req, res) => {
  try {
    const { adminId } = req.query;
    const { complaintId } = req.params;
    const { status } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin id is required.",
      });
    }

    if (!status || (status !== "pending" && status !== "resolved")) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. It must be either 'pending' or 'resolved'.",
      });
    }

    // Call the service to mark the complaint
    const updatedComplaint = await complaintService.updateComplaintStatus(
      adminId,
      complaintId,
      status
    );

    return res.status(200).json({
      success: true,
      data: updatedComplaint,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "An error occurred while marking the complaint.",
      details: error.message,
    });
  }
};

//77
const replyToComplaint = async (req, res) => {
  try {
    const { adminId } = req.query;
    const { complaintId } = req.params;
    const { reply } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin id is required.",
      });
    }

    if (!reply) {
      return res.status(400).json({
        success: false,
        message: "Reply is required.",
      });
    }

    // Call the service to reply to the complaint
    const updatedComplaint = await complaintService.replyToComplaint(
      adminId,
      complaintId,
      reply
    );

    return res.status(200).json({
      success: true,
      data: updatedComplaint,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "An error occurred while replying to the complaint.",
      details: error.message,
    });
  }
};

//80
const getMyComplaints = async (req, res) => {
  try {
    const { touristId } = req.params;
    console.log(touristId);
    if (!touristId) {
      return res.status(400).json({
        success: false,
        message: "tourist Id and problem description is required.",
      });
    }

    const complaints = await complaintService.getTouristComplaints(touristId);

    if (complaints.length === 0) {
      return res.status(200).json({
        success: true,
        data: complaints.length,
      });
    }

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the complaints.",
      details: error.message,
    });
  }
};

//delete all complaints
const deleteAllComplaints = async (req, res) => {
  try {
    const { adminId } = req.query;
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    const result = await complaintService.deleteAllComplaints(adminId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting complaints.",
      details: error.message,
    });
  }
};

module.exports = {
  fileComplaint,
  AdminViewComplain,
  AdminViewSelectedComplain,
  markComplaint,
  replyToComplaint,
  getMyComplaints,
  deleteAllComplaints,
};