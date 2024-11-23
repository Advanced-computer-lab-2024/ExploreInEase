const mongoose = require("mongoose");
const Tourist = require("../models/tourist");
const Products = require("../models/product");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist", // Reference to the Tourist model
      required: true,
    },
    status: {
      type: String,
      enum: ["delivered", "pending"],
      default: "pending",
      required: true,
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", // Reference to the Product model
        required: true,
      },
    ],
    productsIdsQuantity: [{
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' }, // Reference to Itinerary schema
      quantity: { type: Number} // Ensure price is not negative
    }],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0                     // Price cannot be negative
    },
    dateDelivered: {
      type: Date,
      
    },
    addressToBeDelivered: {
      
        street: { type: String },
        city: { type: String},
        country: { type: String},
        zipCode: { type: String, match: [/^\d{5}$/, 'Invalid zip code'] }
    
    },
  },
  {
    timestamps: true, // bey7ot adds createdAt and updatedAt fields beta3 el order
  }
);

const Order = mongoose.models.Order ||mongoose.model("Order", orderSchema);

module.exports = Order;
