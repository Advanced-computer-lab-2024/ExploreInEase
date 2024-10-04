const eventRepository = require('./eventRepository');


// Service to create a new preference tag
exports.createHistoricalTag = async (tag) => {
    return await eventRepository.createHistoricalTag(tag);
};

// Service to search across multiple collections (activities, historical places, itineraries)
exports.search = async ({ name, category, tag }) => {
    const activityResults = await eventRepository.searchActivities(name, category, tag);
    const historicalPlaceResults = await eventRepository.searchHistoricalPlaces(name, tag);
    const itineraryResults = await eventRepository.searchItineraries(name, tag);

    return {
        activities: activityResults,
        historicalPlaces: historicalPlaceResults,
        itineraries: itineraryResults,
    };
};
