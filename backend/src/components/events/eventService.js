const eventRepository = require('./eventRepository');


// Service to create a new preference tag
exports.createHistoricalTag = async (tag) => {
    return await eventRepository.createHistoricalTag(tag);
};


