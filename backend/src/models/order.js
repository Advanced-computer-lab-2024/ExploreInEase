const mongoose = require("mongoose");
const Tourist = require("./tourist");
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
      enum: ["delivered", "pending", "canceled"],
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
    quantities: [
      {
        type: Number,
        min: [1, "Quantity cannot be less than 1"], // Minimum validation in Mongoose
        required: true,
      },
    ],
    dateDelivered: {
      type: Date,
      default: null, // Initially null; set when status is 'delivered'
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
