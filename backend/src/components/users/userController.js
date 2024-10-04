const userService = require("../users/userService");

//get all tourist upcomming activity
const getTouristUpcommingEvents = async (req, res) => {
  const { username } = req.params;

  // Check if username is not a string
  if (typeof username !== "string") {
    return res.status(400).json({ error: "Username must be a string" });
  }
  if (!username) {
    return res.status(400).json({ message: "username is required" });
  }
  try {
    const events = await userService.getTouristUpcommingEvents(username);
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ error: "An error occurred", details: error.message });
  }
};


//get all tourist upcomming iteritary

//get all tourist upcomming historical places/musems


module.exports = {
  getTouristUpcommingEvents,
};
