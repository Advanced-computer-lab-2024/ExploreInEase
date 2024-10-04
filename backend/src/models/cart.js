const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Establishes a reference to the Product model
      required: true,
    },
    quantity: {
      type: Number,
      min: [1, "Quantity must be at least 1"], // Validates minimum quantity
      required: true, // Ensures every cart item has a quantity
    },
  },
  { _id: false }
); // Disables the automatic _id field for subdocuments 3ashan does not need an id

// Define the Cart schema
const cartSchema = new Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist", // Establishes a reference to the Tourist model
      required: true, // Ensures every cart is associated with a tourist
      unique: true, // Guarantees one cart per tourist
    },
    products: [cartItemSchema], // Embeds an array of cart items
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create indexes for optimization 3ashan ya5ly el process eno beydwar 3ala el haga 2asra3 fel carstschema
cartSchema.index({ touristId: 1 });
cartItemSchema.index({ productId: 1 });

// Compile the Cart model
const Cart = mongoose.models.Cart ||mongoose.model("Cart", cartSchema);

// Export the Cart model for use in other parts of the application
module.exports = Cart;
