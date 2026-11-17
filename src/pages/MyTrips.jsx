
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getTrips,
  updateTrip,
  deleteTrip,
} from "../services/tripService";

import "../styles/MyTrips.css";


function MyTrips() {

  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingTripId, setEditingTripId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [saving, setSaving] = useState(false);
  const [deletingTripId, setDeletingTripId] = useState(null);


  // ==========================================
  // FETCH SAVED TRIPS
  // ==========================================

  const fetchTrips = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await getTrips();

      setTrips(response.trips || []);

    } catch (err) {

      console.error("Error fetching trips:", err);

      setError(
        err.message || "Unable to load your trips."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchTrips();
  }, []);


  // ==========================================
  // VIEW ITINERARY
  // ==========================================

  const handleViewTrip = (trip) => {

    const tripData = {

      savedTripId: trip.id,

      origin: trip.origin,
      destination: trip.destination,

      travelStyle: trip.trip_type,
      budget: trip.budget,

      duration: trip.num_days,
      travelers: trip.num_people,

      travelMode: trip.travel_mode,

      healthConsiderations:
        trip.health_considerations,

      itinerary: trip.itinerary || "",

      streaming: false,

    };

    localStorage.setItem(
      "tripData",
      JSON.stringify(tripData)
    );

    navigate("/travel-plan", {
      state: tripData,
    });

  };


  // ==========================================
  // START EDITING
  // ==========================================

  const handleEditClick = (trip) => {

    setMessage("");
    setError("");

    setEditingTripId(trip.id);

    setEditForm({

      origin: trip.origin || "",
      destination: trip.destination || "",
      tripType: trip.trip_type || "",
      budget: trip.budget || "",
      numDays: trip.num_days || "",
      numPeople: trip.num_people || "",

    });

  };


  // ==========================================
  // HANDLE EDIT INPUTS
  // ==========================================

  const handleEditChange = (e) => {

    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ==========================================
  // CANCEL EDITING
  // ==========================================

  const handleCancelEdit = () => {

    setEditingTripId(null);
    setEditForm({});

  };


  // ==========================================
  // UPDATE TRIP
  // PUT /api/trips/:id
  // ==========================================

  const handleUpdateTrip = async (tripId) => {

    try {

      setSaving(true);
      setError("");
      setMessage("");

      if (!editForm.destination.trim()) {
        throw new Error("Destination is required.");
      }

      const days = Number(editForm.numDays);
      const people = Number(editForm.numPeople);

      if (!Number.isInteger(days) || days <= 0) {
        throw new Error(
          "Number of days must be a positive integer."
        );
      }

      if (!Number.isInteger(people) || people <= 0) {
        throw new Error(
          "Number of travellers must be a positive integer."
        );
      }

      const response = await updateTrip(tripId, {

        origin: editForm.origin.trim() || null,

        destination: editForm.destination.trim(),

        tripType: editForm.tripType.trim() || null,

        budget: editForm.budget.trim() || null,

        numDays: days,

        numPeople: people,

      });

      // Update the corresponding trip in React state.
      setTrips((previousTrips) =>
        previousTrips.map((trip) =>
          trip.id === tripId
            ? response.trip
            : trip
        )
      );

      setEditingTripId(null);
      setEditForm({});

      setMessage("Trip updated successfully!");

    } catch (err) {

      console.error("Update trip error:", err);

      setError(
        err.message || "Unable to update trip."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // DELETE TRIP
  // DELETE /api/trips/:id
  // ==========================================

  const handleDeleteTrip = async (tripId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this saved trip? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingTripId(tripId);

      setError("");
      setMessage("");

      await deleteTrip(tripId);

      // Remove deleted trip from the page.
      setTrips((previousTrips) =>
        previousTrips.filter(
          (trip) => trip.id !== tripId
        )
      );

      if (editingTripId === tripId) {
        handleCancelEdit();
      }

      setMessage("Trip deleted successfully!");

    } catch (err) {

      console.error("Delete trip error:", err);

      setError(
        err.message || "Unable to delete trip."
      );

    } finally {

      setDeletingTripId(null);

    }

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="my-trips-page">

          <div className="my-trips-container">

            <div className="my-trips-loading">
              <h2>Loading your trips...</h2>
              <p>Please wait while we retrieve your itineraries.</p>
            </div>

          </div>

        </div>
      </>
    );

  }


  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (

    <>
      <Navbar />

      <div className="my-trips-page">

        <div className="my-trips-container">


          {/* PAGE HEADER */}

          <div className="my-trips-header">

            <h1>My Trips 🌍</h1>

            <p>Your saved travel itineraries</p>

          </div>


          {/* SUCCESS MESSAGE */}

          {message && (

            <div className="my-trips-success" role="status">
              {message}
            </div>

          )}


          {/* ERROR MESSAGE */}

          {error && (

            <div className="my-trips-error" role="alert">

              <p>{error}</p>

            </div>

          )}


          {/* EMPTY STATE */}

          {!error && trips.length === 0 && (

            <div className="my-trips-empty">

              <h2>✈️ No Saved Trips Yet</h2>

              <p>
                Your travel adventures will appear here
                after you save an itinerary.
              </p>

              <button
                className="view-trip-btn"
                onClick={() => navigate("/destinations")}
              >
                Plan Your First Trip
              </button>

            </div>

          )}


          {/* TRIP CARDS */}

          {!error && trips.length > 0 && (

            <div className="my-trips-grid">

              {trips.map((trip) => (

                <div
                  key={trip.id}
                  className="trip-card"
                >

                  {editingTripId === trip.id ? (

                    /* ==================================
                       EDIT FORM
                    ================================== */

                    <div className="trip-edit-form">

                      <h2>Edit Trip ✏️</h2>

                      <label htmlFor={`origin-${trip.id}`}>
                        Traveling From
                      </label>

                      <input
                        id={`origin-${trip.id}`}
                        type="text"
                        name="origin"
                        value={editForm.origin}
                        onChange={handleEditChange}
                      />


                      <label htmlFor={`destination-${trip.id}`}>
                        Destination
                      </label>

                      <input
                        id={`destination-${trip.id}`}
                        type="text"
                        name="destination"
                        value={editForm.destination}
                        onChange={handleEditChange}
                        required
                      />


                      <label htmlFor={`type-${trip.id}`}>
                        Travel Style
                      </label>

                      <input
                        id={`type-${trip.id}`}
                        type="text"
                        name="tripType"
                        value={editForm.tripType}
                        onChange={handleEditChange}
                      />


                      <label htmlFor={`budget-${trip.id}`}>
                        Budget (USD)
                      </label>

                      <input
                        id={`budget-${trip.id}`}
                        type="number"
                        min="0"
                        step="any"
                        name="budget"
                        value={editForm.budget}
                        onChange={handleEditChange}
                      />


                      <label htmlFor={`days-${trip.id}`}>
                        Number of Days
                      </label>

                      <input
                        id={`days-${trip.id}`}
                        type="number"
                        min="1"
                        step="1"
                        name="numDays"
                        value={editForm.numDays}
                        onChange={handleEditChange}
                        required
                      />


                      <label htmlFor={`people-${trip.id}`}>
                        Number of Travellers
                      </label>

                      <input
                        id={`people-${trip.id}`}
                        type="number"
                        min="1"
                        step="1"
                        name="numPeople"
                        value={editForm.numPeople}
                        onChange={handleEditChange}
                        required
                      />


                      <div className="trip-action-buttons">

                        <button
                          className="save-trip-btn"
                          onClick={() => handleUpdateTrip(trip.id)}
                          disabled={saving}
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                          className="cancel-trip-btn"
                          onClick={handleCancelEdit}
                          disabled={saving}
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  ) : (

                    /* ==================================
                       TRIP DETAILS
                    ================================== */

                    <>

                      <h2>
                        🌍 {trip.destination}
                      </h2>

                      <div className="trip-details">

                        <p>
                          <strong>From:</strong>{" "}
                          {trip.origin || "Not specified"}
                        </p>

                        <p>
                          <strong>Travel style:</strong>{" "}
                          {trip.trip_type || "Not specified"}
                        </p>

                        <p>
                          <strong>Duration:</strong>{" "}
                          {trip.num_days || "Not specified"} days
                        </p>

                        <p>
                          <strong>Travellers:</strong>{" "}
                          {trip.num_people || "Not specified"}
                        </p>

                        <p>
                          <strong>Budget:</strong>{" "}
                          {trip.budget
                            ? `$${trip.budget}`
                            : "Not specified"}
                        </p>

                        <p>
                          <strong>Travel mode:</strong>{" "}
                          {trip.travel_mode || "Not specified"}
                        </p>

                        <p>
                          <strong>Health considerations:</strong>{" "}
                          {trip.health_considerations || "None"}
                        </p>

                        <p>
                          <strong>Created:</strong>{" "}
                          {formatDate(trip.created_at)}
                        </p>

                      </div>


                      {/* TRIP ACTIONS */}

                      <div className="trip-action-buttons">

                        <button
                          className="view-trip-btn"
                          onClick={() => handleViewTrip(trip)}
                        >
                          View Itinerary →
                        </button>

                        <button
                          className="edit-trip-btn"
                          onClick={() => handleEditClick(trip)}
                          disabled={deletingTripId === trip.id}
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-trip-btn"
                          onClick={() => handleDeleteTrip(trip.id)}
                          disabled={deletingTripId === trip.id}
                        >
                          {deletingTripId === trip.id
                            ? "Deleting..."
                            : "🗑 Delete"}
                        </button>

                      </div>

                    </>

                  )}

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </>

  );

}

export default MyTrips;
