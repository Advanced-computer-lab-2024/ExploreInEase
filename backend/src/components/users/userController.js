const express = require('express')
const mongoose = require('mongoose')
const Tourist = require('../../models/tourist')
const User = require('../../models/user')

const router = express.Router()

const userService = require('./userService');
const { validationResult } = require('express-validator');

// Input validation middleware
const validateTourGuide = [
    // Add validation logic here (e.g., check required fields)
];

//Tour Guide
exports.createTourGuide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const tourGuide = await userService.createTourGuide(req.params._id,req.body);
        res.status(201).json(tourGuide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a tour guide profile
exports.getTourGuide = async (req, res) => {
    try {
        const tourGuide = await userService.getTourGuide(req.params._id);
        if (!tourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        res.status(200).json(tourGuide);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a tour guide profile
exports.updateTourGuide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedTourGuide = await userService.updateTourGuide(req.params._id, req.body);
        if (!updatedTourGuide) {
            return res.status(404).json({ message: 'Tour guide not found' });
        }
        res.status(200).json(updatedTourGuide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//Advertiser
exports.createAdvertiser = async (req, res) => {
    console.log("dakahal");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log("conroller : ",req.params._id,req.body)
        const advertiser = await userService.createAdvertiser(req.params._id,req.body);
        res.status(201).json(advertiser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get an advertiser profile
exports.getAdvertiser = async (req, res) => {
    try {
        const advertiser = await userService.getAdvertiser(req.params._id);
        if (!advertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }
        res.status(200).json(advertiser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an advertiser profile
exports.updateAdvertiser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedAdvertiser = await userService.updateAdvertiser(req.params._id, req.body);
        if (!updatedAdvertiser) {
            return res.status(404).json({ message: 'Advertiser not found' });
        }
        res.status(200).json(updatedAdvertiser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//Seller


// Create a seller
exports.createSeller = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const seller = await userService.createSeller(req.params._id,req.body);
        res.status(201).json(seller);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a seller profile
exports.getSeller = async (req, res) => {
    try {
        const seller = await userService.getSeller(req.params._id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json(seller);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a seller profile
exports.updateSeller = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedSeller = await userService.updateSeller(req.params._id, req.body);
        if (!updatedSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json(updatedSeller);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//Tourist


// Get a tourist profile
exports.getTourist = async (req, res) => {
    try {
        const tourist = await userService.getTourist(req.params._id);
        if (!tourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.status(200).json(tourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a tourist profile (excluding username and wallet)
exports.updateTourist = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updateData = { ...req.body };
        if(updateData.username){
            return res.status(400).json({ message: 'Cannot update username' });
        }else if(updateData.wallet){
            return res.status(400).json({ message: 'Cannot update wallet' });
        }

        const updatedTourist = await userService.updateTourist(req.params._id, updateData);
        if (!updatedTourist) {
            return res.status(404).json({ message: 'Tourist not found' });
        }
        res.status(200).json(updatedTourist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
