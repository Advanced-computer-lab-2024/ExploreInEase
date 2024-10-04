const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    quantity: {
      type: Number,
      min: [1, "Quantity must be at least 1"], 
      required: true, // Ensures every cart item has a quantity
    },
  },
  { _id: false }
); // Disables the automatic _id field for subdocuments 3ashan does not need an id

const cartSchema = new Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist", 
      required: true, // Ensures every cart is associated with a tourist
      unique: true, // Guarantees one cart per tourist
    },
    products: [cartItemSchema], // Embeds an array of cart items
  },
  {
    timestamps: true, y
  }
);

// Create indexes for optimization 3ashan ya5ly el process eno beydwar 3ala el haga 2asra3 fel carstschema
cartSchema.index({ touristId: 1 });
cartItemSchema.index({ productId: 1 });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
