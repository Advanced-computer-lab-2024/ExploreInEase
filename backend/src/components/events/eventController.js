const eventService = require('./eventService');
const { validationResult } = require('express-validator');

// Create a new preference tag
exports.createHistoricalTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const tag = await eventService.createHistoricalTag(req.body);
        res.status(201).json(tag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




