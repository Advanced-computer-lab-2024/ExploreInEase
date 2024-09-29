const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Tourist Schema
const TouristSchema = new Schema({
    UserName: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    Password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false // Password will not be included in queries unless explicitly selected
    },
    MobileNum: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^\d{10,15}$/, 'Invalid mobile number'], // Supports 10 to 15 digit numbers
    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email format'], // Basic email validation
    },
    Nation: {
        type: String,
        required: [true, 'Nation is required'],
        trim: true,
    },
    DateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
    },
    JobOrStudent: {
        type: String,
        enum: ['Job', 'Student'], // Restrict to either 'Job' or 'Student'
        required: true
    },
    Itinerary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary', // Foreign key reference to Itinerary schema
        required: true
    },
    ActivityID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity', // Foreign key reference to Activity schema
        required: true
    },
    HistoricalPlaceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HistoricalPlace', // Foreign key reference to HistoricalPlace schema
        required: true
    },
    Bookmark: {
        type: String, // You can change this to a specific type based on the data you expect
        default: ''
    },
    CreatedAt: {
        type: Date,
        default: Date.now, // Auto-sets to the current date/time
        immutable: true // This value cannot be changed once set
    },
    Addresses: [
        {
            Street: { type: String, required: true },
            City: { type: String, required: true },
            Country: { type: String, required: true },
            ZipCode: { type: String, match: [/^\d{5}$/, 'Invalid zip code'] }
        }
    ],
    Points: {
        type: Number,
        default: 0,
        min: 0 // Ensures points cannot go below zero
    },
    Wishlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Assuming you have a Product schema for products in the wishlist
        required: false
    }],
    Wallet: {
        type: Number,
        default: 0, // Starting wallet balance
        min: 0 // Ensures wallet balance cannot be negative
    }
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    versionKey: false // Disable the version key field "__v"
});

// Middleware to hash password before saving
TouristSchema.pre('save', async function(next) {
    if (this.isModified('Password')) {
        this.Password = await hashPassword(this.Password); // Assumes hashPassword is a function to hash the password
    }
    next();
});

// Model the schema
const Tourist = mongoose.model('Tourist', TouristSchema);

module.exports = Tourist;
