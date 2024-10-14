const complaintRepository = require("../../components/complaints/complaintRepository");
const Tourist = require("../../models/tourist");

//sprint2

//Creating el complaint
const createComplaint = async (complaintData) => {
  const { touristId } = complaintData;

  //validiation lel tourist
  const touristExists = await Tourist.findById(touristId);
  if (!touristExists) {
    throw new Error("Invalid Tourist Id: No such tourist found.");
  }

  return await complaintRepository.saveComplaint(complaintData);
};

module.exports = {
  createComplaint,
};
