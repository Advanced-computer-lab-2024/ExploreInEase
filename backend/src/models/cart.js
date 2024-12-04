const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Cart schema
const cartSchema = new Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist", // Establishes a reference to the Tourist model
    },
    products: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Establishes a reference to the Product model
      },
      quantity: {
        type: Number,
      },
    }]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Compile the Cart model
const Cart = mongoose.models.Cart ||mongoose.model("Cart", cartSchema);

// Export the Cart model for use in other parts of the application
module.exports = Cart;
