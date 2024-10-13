const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Tourist Schema
const TouristSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
    },
    mobileNum: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^\d{10,15}$/, 'Invalid mobile number'], // Supports 10 to 15 digit numbers
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email format'], // Basic email validation
    },
    nation: {
        type: String,
        required: [true, 'Nation is required'],
        trim: true,
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    
    profession: {
        type: String,
        required: [true,'Profession is required'],
        required: true
    },
    itineraryId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary', // Foreign key reference to Itinerary schema
    }],
    activityId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity', // Foreign key reference to Activity schema
    }],
    historicalplaceId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HistoricalPlace', // Foreign key reference to HistoricalPlace schema
    }],
    bookmark: {
        type: String, // You can change this to a specific type based on the data you expect
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now, // Auto-sets to the current date/time
        immutable: true // This value cannot be changed once set
    },
    addresses: [
        {
            street: { type: String },
            city: { type: String},
            country: { type: String},
            zipCode: { type: String, match: [/^\d{5}$/, 'Invalid zip code'] }
        }
    ],
    points: {
        type: Number,
        default: 0,
        min: 0 // Ensures points cannot go below zero
    },
    wishlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Assuming you have a Product schema for products in the wishlist
    }],
    wallet: {
        type: Number,
        default: 0, // Starting wallet balance
        min: 0 // Ensures wallet balance cannot be negative
    },
    requestDeletion: {
        type: Boolean,
        default: false
    },
    redeemedPoints: {
        type: Number,
        default: 0,
        min: 0 // Ensures points cannot go below zero
    },
    archived: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    }]    
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    versionKey: false // Disable the version key field "__v"
});

// Model the schema
const Tourist = mongoose.model('Tourist', TouristSchema);

module.exports = Tourist;
