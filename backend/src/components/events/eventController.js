const eventService = require("../events/eventService");

//sarah

const GetupcommingActivitesFilter = async (req, res) => {
  try {
    const { budget, date, categoryId, rating } = req.query;

    const filters = {
      budget: budget ? parseFloat(budget) : undefined, //ye7welo to float
      date,
      categoryId,
      rating: rating ? parseint(rating) : undefined,
    };

    console.log("Filters:", filters);
    const activities = await eventService.getFilteredUpcomingActivities(
      filters
    );

    return res.status(200).json(activities);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await eventService.getAllUpcomingEvents();
    return res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

const filterHistoricalPlacesByTags = async (req, res) => {
  try {
    const { tags } = req.query; // Extract tags from query parameters

    // Convert tags into an array
    const tagsArray = Array.isArray(tags) ? tags : [tags];

    const filteredHistoricalPlaces =
      await eventService.getFilteredHistoricalPlaces(tagsArray);
    return res.status(200).json(filteredHistoricalPlaces);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

const getFilteredItineraries = async (req, res) => {
  try {
    const { budget, date, preferences, language } = req.query;

    // Pass the query parameters to the service
    const itineraries = await eventService.getFilteredItineraries({
      budget,
      date,
      preferences,
      language,
    });

    return res.status(200).json({
      success: true,
      total: itineraries.length,
      itineraries,
    });
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching itineraries",
      details: error.message,
    });
  }
};

//sprint 2

module.exports = {
  GetupcommingActivitesFilter,
  getUpcomingEvents,
  filterHistoricalPlacesByTags,
  getFilteredItineraries,
};
