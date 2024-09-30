const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Users Schema
const UsersSchema = new Schema({
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
        select: false // Password will not be included in query results by default
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email format'],
        lowercase: true
    },
    nationalId: {
        type: String,
        required: function() {
            // Required for specific types
            return this.type === 'tourGuide' || this.type === 'advertiser' || this.type === 'seller';
        }
    },
    certificate: {
        type: String,
        required: function() {
            // Required for tourGuides
            return this.type === 'tourGuide';
        }
    },
    taxation: {
        type: String,
        required: function() {
            // Required for advertisers and sellers
            return this.type === 'advertiser' || this.type === 'seller';
        }
    },
    experience: {
        type: String,
        required: function() {
            // Required for tourGuides
            return this.type === 'tourGuide';
        }
    },
    previousWork: {
        type: String,
        required: function() {
            // Required for tourGuides
            return this.type === 'tourGuide';
        }
    },
    linkWebsite: {
        type: String,
        required: function() {
            // Required for advertisers
            return this.type === 'advertiser';
        }
    },
    hotline: {
        type: String,
        required: function() {
            // Required for advertisers
            return this.type === 'advertiser';
        }
    },
    companyProfile: {
        type: String,
        required: function() {
            // Required for advertisers
            return this.type === 'advertiser';
        }
    },
    sellerName: {
        type: String,
        required: function() {
            // Required for sellers
            return this.type === 'seller';
        }
    },
    description: {
        type: String,
        required: function() {
            // Required for sellers
            return this.type === 'seller';
        }
    },
    type: {
        type: String,
        required: [true, 'User type is required'],
        enum: ['advertiser', 'tourGuide', 'seller', 'tourismGovernor', 'admin'] // User types
    },
    selfPicture: {
        type: String,
        required: function() {
            // Required for tourGuides
            return this.type === 'tourGuide';
        }
    },
    logo: {
        type: String,
        required: function() {
            // Required for advertisers and sellers
            return this.type === 'advertiser' || this.type === 'seller';
        }
    },
    comment: {
        type: String,
        required: function() {
            // Required for tourGuides
            return this.type === 'tourGuide';
        }
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: function() {
            // Required for tourGuides
            return this.type === 'tourGuide';
        }
    }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false // Disable the "__v" version key
});

// Create the Users Model
const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;
