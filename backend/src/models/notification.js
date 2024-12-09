const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Notification Schema
const notificationSchema = new Schema({
    title: {
        type: String,
    },
    body: {
        type: String,
    },
    user: {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        user_type: {
            type: String,
        }
    }
}, {
    timestamps: true,               // Automatically add createdAt and updatedAt fields
    versionKey: false                // Disable the "__v" version key
});

// Create the Notification Model
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = Notification;
