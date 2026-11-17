
import express from "express";
import mongoose from "mongoose";

import db from "../config/db.js";
import verifyToken from "../middleware/authMiddleware.js";
import Itinerary from "../models/Itinerary.js";

const router = express.Router();

// All trip routes require a valid JWT.
router.use(verifyToken);


// ==========================================
// HELPER: GET ITINERARY FROM MONGODB
// ==========================================

const getMongoItinerary = async (mongodbId) => {
  if (!mongodbId || !mongoose.Types.ObjectId.isValid(mongodbId)) {
    return null;
  }

  const document = await Itinerary.findById(mongodbId).lean();

  return document ? document.itinerary : null;
};


// ==========================================
// CREATE A SAVED TRIP
// POST /api/trips
// ==========================================

router.post("/", async (req, res) => {
  let createdItinerary = null;

  try {
    const {
      travelingFrom,
      origin,
      destination,
      tripType,
      travelStyle,
      budget,
      numDays,
      duration,
      numPeople,
      travelers,
      travelMode,
      healthConsiderations,
      itinerary,
    } = req.body;

    const tripOrigin = travelingFrom ?? origin ?? null;
    const tripDestination = destination?.trim();

    if (!tripDestination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required.",
      });
    }

    if (itinerary === undefined || itinerary === null || itinerary === "") {
      return res.status(400).json({
        success: false,
        message: "AI-generated itinerary is required.",
      });
    }

    const days = Number(numDays ?? duration);
    const people = Number(numPeople ?? travelers);
    const tripBudget = Number(budget);

    if (!Number.isInteger(days) || days <= 0 ||
        !Number.isInteger(people) || people <= 0 ||
        !Number.isFinite(tripBudget) || tripBudget < 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid trip details.",
      });
    }

    // 1. Save the detailed itinerary in MongoDB.
    createdItinerary = await Itinerary.create({
      userId: req.user.id,
      origin: tripOrigin,
      destination: tripDestination,
      tripType: tripType ?? travelStyle ?? "",
      budget: tripBudget,
      currency: "USD",
      numDays: days,
      numPeople: people,
      travelMode: travelMode ?? "",
      healthConsiderations: healthConsiderations ?? "",
      itinerary,
    });

    // 2. Save trip metadata and MongoDB reference in MySQL.
    const [result] = await db.query(
      `INSERT INTO saved_trips
       (
         user_id,
         origin,
         destination,
         trip_type,
         budget,
         num_days,
         num_people,
         travel_mode,
         health_considerations,
         itinerary,
         mongodb_id
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        tripOrigin,
        tripDestination,
        tripType ?? travelStyle ?? null,
        tripBudget,
        days,
        people,
        travelMode ?? null,
        healthConsiderations ?? null,
        null,
        createdItinerary._id.toString(),
      ]
    );

    // 3. Retrieve the newly created MySQL record.
    const [rows] = await db.query(
      `SELECT * FROM saved_trips
       WHERE id = ? AND user_id = ?`,
      [result.insertId, req.user.id]
    );

    return res.status(201).json({
      success: true,
      message: "Trip and AI itinerary saved successfully.",
      trip: {
        ...rows[0],
        itinerary,
      },
    });

  } catch (error) {
    // If MySQL saving fails, remove the newly created MongoDB document.
    if (createdItinerary) {
      try {
        await Itinerary.findByIdAndDelete(createdItinerary._id);
      } catch (cleanupError) {
        console.error("MongoDB cleanup error:", cleanupError);
      }
    }

    console.error("Create trip error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save trip and itinerary.",
    });
  }
});


// ==========================================
// GET ALL SAVED TRIPS
// GET /api/trips
// ==========================================

router.get("/", async (req, res) => {
  try {
    const [trips] = await db.query(
      `SELECT * FROM saved_trips
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    // Retrieve each detailed itinerary from MongoDB.
    const tripsWithItineraries = await Promise.all(
      trips.map(async (trip) => {
        let savedItinerary = trip.itinerary;

        if (trip.mongodb_id) {
          const mongoItinerary = await getMongoItinerary(
            trip.mongodb_id
          );

          if (mongoItinerary !== null) {
            savedItinerary = mongoItinerary;
          }
        }

        return {
          ...trip,
          itinerary: savedItinerary,
        };
      })
    );

    return res.status(200).json({
      success: true,
      trips: tripsWithItineraries,
    });

  } catch (error) {
    console.error("Get trips error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve trips.",
    });
  }
});


// ==========================================
// GET ONE SAVED TRIP
// GET /api/trips/:id
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const tripId = Number(req.params.id);

    if (!Number.isInteger(tripId) || tripId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID.",
      });
    }

    const [trips] = await db.query(
      `SELECT * FROM saved_trips
       WHERE id = ? AND user_id = ?`,
      [tripId, req.user.id]
    );

    if (trips.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    const trip = trips[0];

    if (trip.mongodb_id) {
      const mongoItinerary = await getMongoItinerary(
        trip.mongodb_id
      );

      if (mongoItinerary !== null) {
        trip.itinerary = mongoItinerary;
      }
    }

    return res.status(200).json({
      success: true,
      trip,
    });

  } catch (error) {
    console.error("Get trip error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve trip.",
    });
  }
});


// ==========================================
// UPDATE A SAVED TRIP
// PUT /api/trips/:id
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const tripId = Number(req.params.id);

    if (!Number.isInteger(tripId) || tripId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID.",
      });
    }

    const [existingTrips] = await db.query(
      `SELECT * FROM saved_trips
       WHERE id = ? AND user_id = ?`,
      [tripId, req.user.id]
    );

    if (existingTrips.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    const existing = existingTrips[0];
    const body = req.body;

    const origin =
      body.travelingFrom ?? body.origin ?? existing.origin;

    const destination =
      body.destination === undefined
        ? existing.destination
        : body.destination?.trim();

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination cannot be empty.",
      });
    }

    const tripType =
      body.tripType ?? body.travelStyle ?? existing.trip_type;

    const budget =
      body.budget === undefined
        ? existing.budget
        : Number(body.budget);

    if (budget !== null && (!Number.isFinite(budget) || budget < 0)) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a valid non-negative number.",
      });
    }

    const rawDays = body.numDays ?? body.duration;
    const rawPeople = body.numPeople ?? body.travelers;

    const days =
      rawDays === undefined ? existing.num_days : Number(rawDays);

    const people =
      rawPeople === undefined ? existing.num_people : Number(rawPeople);

    if (
      days !== null &&
      days !== undefined &&
      (!Number.isInteger(days) || days <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Number of days must be a positive integer.",
      });
    }

    if (
      people !== null &&
      people !== undefined &&
      (!Number.isInteger(people) || people <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Number of people must be a positive integer.",
      });
    }

    const travelMode =
      body.travelMode === undefined
        ? existing.travel_mode
        : body.travelMode;

    const healthConsiderations =
      body.healthConsiderations === undefined
        ? existing.health_considerations
        : body.healthConsiderations;

    let mongodbId = existing.mongodb_id;

    // Update the itinerary in MongoDB only if a new itinerary is supplied.
    if (body.itinerary !== undefined) {
      if (mongodbId && mongoose.Types.ObjectId.isValid(mongodbId)) {
        const updatedDocument = await Itinerary.findOneAndUpdate(
          {
            _id: mongodbId,
            userId: req.user.id,
          },
          {
            $set: {
              origin,
              destination,
              tripType,
              budget,
              numDays: days,
              numPeople: people,
              travelMode,
              healthConsiderations,
              itinerary: body.itinerary,
            },
          },
          { new: true, runValidators: true }
        );

        if (!updatedDocument) {
          return res.status(404).json({
            success: false,
            message: "MongoDB itinerary not found.",
          });
        }
      } else {
        // Migrate an older MySQL-only trip to MongoDB.
        const newDocument = await Itinerary.create({
          userId: req.user.id,
          origin,
          destination,
          tripType,
          budget,
          currency: "USD",
          numDays: days,
          numPeople: people,
          travelMode,
          healthConsiderations,
          itinerary: body.itinerary,
        });

        mongodbId = newDocument._id.toString();
      }
    } else if (mongodbId) {
      // Keep MongoDB trip details synchronized with edited metadata.
      await Itinerary.updateOne(
        {
          _id: mongodbId,
          userId: req.user.id,
        },
        {
          $set: {
            origin,
            destination,
            tripType,
            budget,
            numDays: days,
            numPeople: people,
            travelMode,
            healthConsiderations,
          },
        }
      );
    }

    await db.query(
      `UPDATE saved_trips
       SET
         origin = ?,
         destination = ?,
         trip_type = ?,
         budget = ?,
         num_days = ?,
         num_people = ?,
         travel_mode = ?,
         health_considerations = ?,
         mongodb_id = ?
       WHERE id = ? AND user_id = ?`,
      [
        origin,
        destination,
        tripType,
        budget,
        days ?? null,
        people ?? null,
        travelMode,
        healthConsiderations,
        mongodbId ?? null,
        tripId,
        req.user.id,
      ]
    );

    const [updatedTrips] = await db.query(
      `SELECT * FROM saved_trips
       WHERE id = ? AND user_id = ?`,
      [tripId, req.user.id]
    );

    const updatedTrip = updatedTrips[0];

    if (updatedTrip.mongodb_id) {
      const mongoItinerary = await getMongoItinerary(
        updatedTrip.mongodb_id
      );

      if (mongoItinerary !== null) {
        updatedTrip.itinerary = mongoItinerary;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully.",
      trip: updatedTrip,
    });

  } catch (error) {
    console.error("Update trip error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update trip.",
    });
  }
});


// ==========================================
// DELETE A SAVED TRIP
// DELETE /api/trips/:id
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const tripId = Number(req.params.id);

    if (!Number.isInteger(tripId) || tripId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID.",
      });
    }

    const [trips] = await db.query(
      `SELECT * FROM saved_trips
       WHERE id = ? AND user_id = ?`,
      [tripId, req.user.id]
    );

    if (trips.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    const mongodbId = trips[0].mongodb_id;

    // Delete the MongoDB itinerary belonging to this user.
    if (mongodbId && mongoose.Types.ObjectId.isValid(mongodbId)) {
      await Itinerary.deleteOne({
        _id: mongodbId,
        userId: req.user.id,
      });
    }

    // Delete the MySQL saved-trip record.
    await db.query(
      `DELETE FROM saved_trips
       WHERE id = ? AND user_id = ?`,
      [tripId, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: "Trip and associated itinerary deleted successfully.",
    });

  } catch (error) {
    console.error("Delete trip error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete trip.",
    });
  }
});


// ==========================================
// EXPORT ROUTER
// ==========================================

export default router;
