const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookedFlightSchema = new Schema({
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  },
  price: {
    type: Number,
  },
  departureTime: {
    type: Date,
  },
  arrivalTime: {
    type: Date,
  },
  personCount: {
    type: Number,
  },
  originCode: {
    type: String,
  },
  destinationCode: {
    type: String,
  },
});

const BookedFlight = mongoose.model("BookedFlight", bookedFlightSchema);

module.exports = BookedFlight;
