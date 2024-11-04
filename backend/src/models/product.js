const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Products Schema
const ProductsSchema = new Schema({
    productId: {
        type: String,
        required: [true, 'Product ID is required'],
        unique: true,              // Ensures each product has a unique ID
        trim: true
    },
    picture: {
        type: String,              // URL or path to the product image
        required: [true, 'Picture is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0                     // Price cannot be negative
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: 10               // Minimum length for description
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId, // Foreign key to reference the seller
        ref: 'Users',               // Assuming you have a Users schema
        required: [true, 'Seller ID is required']
    },
    ratings: {
        type: Number,
        min: 0,
        max: 5,
        default: 0                 // Default rating
    },
    ratingSum: {
        type: Number,
        default: 0,
      },
      ratingCount: {
        type: Number,
        default: 0,
      },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',           // Assuming reviews are associated with Users
            required: true
        },
        comment: {
            type: String,
            required: [true, 'Review comment is required'],
            minlength: 1
        },

        createdAt: {
            type: Date,
            default: Date.now       // Timestamp for when the review was created
        }
    }],
    originalQuantity: {
        type: Number,
        required: [true, 'Original quantity is required'],
        min: 0                     // Original quantity cannot be negative
    },
    takenQuantity: {
        type: Number,
        default: 0,                // Initially zero
        min: 0                     // Taken quantity cannot be negative
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: 1                // Minimum length for product name
    },
    isActive: {
        type: Boolean,
        default: true               // Indicates whether the product is active or inactive
    }
}, {
    timestamps: true,               // Automatically add createdAt and updatedAt fields
    versionKey: false                // Disable the "__v" version key
});

// Create the Products Model
const Products = mongoose.models.Products || mongoose.model('Products', ProductsSchema);

module.exports = Products;
