const eventRepository = require('./eventRepository');


exports.createHistoricalTag = async (tag) => {
    return await eventRepository.createHistoricalTag(tag);
};


