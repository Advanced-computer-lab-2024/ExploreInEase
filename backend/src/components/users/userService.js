const express = require('express')
const userRepo = require('./userRepository');

// Tour Guide
exports.createTourGuide = async (tourGuideData) => {
    return await userRepo.updateUserData(tourGuideData);
};

// Get a tour guide
exports.getTourGuide = async (id) => {
    return await userRepo.findUserById(id);
};

// Update a tour guide
exports.updateTourGuide = async (id, updateData) => {
    return await userRepo.updateUserData(id, updateData);
};


//Advertiser
exports.createAdvertiser = async (advertiserData) => {
    return await userRepo.updateUserData(advertiserData);
};

// Get an advertiser
exports.getAdvertiser = async (id) => {
    return await userRepo.findUserById(id);
};

// Update an advertiser
exports.updateAdvertiser = async (id, updateData) => {
    return await userRepo.updateUserData(id, updateData);
};


//Seller
exports.createSeller = async (sellerData) => {
    return await userRepo.updateUserData(sellerData);
};

// Get a seller
exports.getSeller = async (id) => {
    return await userRepo.findUserById(id);
};

// Update a seller
exports.updateSeller = async (id, updateData) => {
    return await userRepo.updateUserData(id, updateData);
};


//Tourist

// Get a tourist
exports.getTourist = async (id) => {
    return await userRepo.getTouristById(id);
};

// Update a tourist (excluding username and wallet)
exports.updateTourist = async (id, updateData) => {
    return await userRepo.updateTourist(id, updateData);
};
