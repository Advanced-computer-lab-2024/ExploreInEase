const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Users Schema
const PromoCodesSchema = new Schema({
    promoCodes: {
        type: String
    }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
    versionKey: false // Disable the "__v" version key
});

// Create the PromoCodesSchema Model
const PromoCodes = mongoose.model('PromoCodes', PromoCodesSchema);

module.exports = PromoCodes;
