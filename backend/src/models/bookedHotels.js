const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookedHotelSchema = new Schema({
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  },
  price: {
    type: Number,
  },
  iataCode: {
    type: String,
  },
  hotelName: {
    type: String,
  },
  hotelId: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  personCount: {
    type: Number,
  },
});

module.exports = mongoose.model("BookedHotel", bookedHotelSchema);
