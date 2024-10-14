const complaintService = require("../complaints/complaintService");

//sprint 2

//req 74
const fileComplaint = async (req, res) => {
  //console.log("i am here");
  try {
    const { touristId, problem } = req.body;

    if (!touristId || !problem) {
      return res.status(400).json({
        success: false,
        message: "tourist Id and problem description is required.",
      });
    }

    const complaint = await complaintService.createComplaint(req.body);
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


//req 75
const AdminViewComplain=async(req,res)=>{
    
}





module.exports = {
  fileComplaint,
};
