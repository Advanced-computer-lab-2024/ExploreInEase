const express = require('express')
const userRepo = require('./userRepository');


// Tour Guide
exports.createTourGuide = async (_id,tourGuideData) => {
    return await userRepo.updateUserData(_id,tourGuideData);
};

// Get a tour guide
exports.getTourGuide = async (_id) => {
    return await userRepo.findUserById(_id);
};



// Update a tour guide
exports.updateTourGuide = async (_id, updateData) => {
    return await userRepo.updateUserData(_id, updateData);
};


//Advertiser
exports.createAdvertiser = async (_id,advertiserData) => {
    console.log(_id,advertiserData);
    return await userRepo.updateUserData(_id,advertiserData);
};

// Get an advertiser
exports.getAdvertiser = async (_id) => {
    return await userRepo.findUserById(_id);
};

// Update an advertiser
exports.updateAdvertiser = async (_id, updateData) => {
    return await userRepo.updateUserData(_id, updateData);
};


//Seller
exports.createSeller = async (_id,sellerData) => {
    return await userRepo.updateUserData(_id,sellerData);
};

// Get a seller
exports.getSeller = async (_id) => {
    return await userRepo.findUserById(_id);
};

// Update a seller
exports.updateSeller = async (_id, updateData) => {
    return await userRepo.updateUserData(_id, updateData);
};


//Tourist

// Get a tourist
exports.getTourist = async (_id) => {
    return await userRepo.getTouristById(_id);
};

// Update a tourist (excluding username and wallet)
exports.updateTourist = async (_id, updateData) => {
    return await userRepo.updateTourist(_id, updateData);
};
