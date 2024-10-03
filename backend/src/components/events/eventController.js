const eventService = require('./eventService');
const { validationResult } = require('express-validator');

// Create a new preference tag
exports.createTag = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const tag = await eventService.createTag(req.body);
        res.status(201).json(tag);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all preference tags
exports.getAllTags = async (req, res) => {
    try {
        const tags = await eventService.getAllTags();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//tourist search 
exports.search = async (req, res) => {
    const { name, category, tag } = req.query;

    try {
        const results = await searchService.search({ name, category, tag });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
