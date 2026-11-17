
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/api/trips`;

// ==========================================
// COMMON API REQUEST FUNCTION
// ==========================================

const tripRequest = async (endpoint = "", options = {}) => {
  const token = localStorage.getItem("sanchari_token");

  if (!token) {
    throw new Error("Please login to continue.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong with the trip API."
    );
  }

  return data;
};


// ==========================================
// CREATE / SAVE TRIP
// POST /api/trips
// ==========================================

export const saveTrip = async (tripData) => {
  return await tripRequest("", {
    method: "POST",
    body: JSON.stringify(tripData),
  });
};


// ==========================================
// GET ALL SAVED TRIPS
// GET /api/trips
// ==========================================

export const getTrips = async () => {
  return await tripRequest("", {
    method: "GET",
  });
};


// ==========================================
// GET ONE SAVED TRIP
// GET /api/trips/:id
// ==========================================

export const getTripById = async (tripId) => {
  return await tripRequest(`/${tripId}`, {
    method: "GET",
  });
};


// ==========================================
// UPDATE SAVED TRIP
// PUT /api/trips/:id
// ==========================================

export const updateTrip = async (tripId, tripData) => {
  return await tripRequest(`/${tripId}`, {
    method: "PUT",
    body: JSON.stringify(tripData),
  });
};


// ==========================================
// DELETE SAVED TRIP
// DELETE /api/trips/:id
// ==========================================

export const deleteTrip = async (tripId) => {
  return await tripRequest(`/${tripId}`, {
    method: "DELETE",
  });
};
