
import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
      index: true,
    },

    origin: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    tripType: {
      type: String,
      default: "",
    },

    budget: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "USD",
    },

    numDays: {
      type: Number,
      required: true,
    },

    numPeople: {
      type: Number,
      required: true,
    },

    travelMode: {
      type: String,
      default: "",
    },

    healthConsiderations: {
      type: String,
      default: "",
    },

    itinerary: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "itineraries",
  }
);

const Itinerary = mongoose.model(
  "Itinerary",
  itinerarySchema
);

export default Itinerary;
