
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import html2pdf from "html2pdf.js";

import Navbar from "../components/Navbar";
import { generateItineraryStream } from "../services/aiService";
import { saveTrip } from "../services/tripService";

import "../styles/TravelPlan.css";


function TravelPlan() {

  const location = useLocation();
  const navigate = useNavigate();


  // ==========================================
  // GET TRIP FORM DATA
  // ==========================================

  const formData = useMemo(() => {

    if (location.state) {
      return location.state;
    }

    try {
      const savedTrip = localStorage.getItem("tripData");

      return savedTrip ? JSON.parse(savedTrip) : null;

    } catch (error) {
      console.error("Error loading saved trip:", error);
      return null;
    }

  }, [location.state]);


  // ==========================================
  // STATES
  // ==========================================

  const [itinerary, setItinerary] = useState(
    formData?.itinerary || ""
  );

  const [isStreaming, setIsStreaming] = useState(
    Boolean(formData && !formData.itinerary)
  );

  const [streamError, setStreamError] = useState("");

  const [saveStatus, setSaveStatus] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [savedTripId, setSavedTripId] = useState(
    formData?.savedTripId || null
  );

  // Prevent duplicate AI generation in React StrictMode.
  const startedRef = useRef(false);


  // ==========================================
  // SAVE TRIP TO MYSQL
  // ==========================================

  const saveCurrentTrip = async (tripData) => {

    if (isSaving) {
      return;
    }

    if (savedTripId || tripData.savedTripId) {
      setSaveStatus("This trip is already saved to your account.");
      return;
    }

    if (!localStorage.getItem("sanchari_token")) {
      setSaveStatus(
        "Please log in to save this trip to your account."
      );
      return;
    }

    if (!tripData.itinerary?.trim()) {
      setSaveStatus("No completed itinerary available to save.");
      return;
    }

    try {

      setIsSaving(true);
      setSaveStatus("Saving your trip to MySQL...");

      const response = await saveTrip({

        origin: tripData.origin,
        destination: tripData.destination,

        travelStyle: tripData.travelStyle,
        travelers: tripData.travelers,

        budget: tripData.budget,
        travelMode: tripData.travelMode,

        duration: tripData.duration,

        healthConsiderations:
          tripData.healthConsiderations,

        itinerary: tripData.itinerary,

      });

      const newTripId = response.trip.id;

      // Update saved trip ID in React state.
      setSavedTripId(newTripId);

      // Preserve existing localStorage data.
      const updatedTripData = {
        ...tripData,
        savedTripId: newTripId,
        streaming: false,
      };

      localStorage.setItem(
        "tripData",
        JSON.stringify(updatedTripData)
      );

      setSaveStatus(
        "Your trip has been saved successfully!"
      );

      console.log("Trip saved to MySQL:", newTripId);

    } catch (error) {

      console.error("Database save error:", error);

      const errorMsg = error.message || "";
      if (
        errorMsg.toLowerCase().includes("token") ||
        errorMsg.toLowerCase().includes("unauthorized") ||
        errorMsg.toLowerCase().includes("expired")
      ) {
        localStorage.removeItem("sanchari_token");
        setSaveStatus(
          "Your login session has expired. Please log in again to save this trip to your account. Your itinerary is safely preserved!"
        );
      } else {
        setSaveStatus(
          "Your itinerary is saved locally, but could not " +
          "be saved to your account. " +
          errorMsg
        );
      }

    } finally {

      setIsSaving(false);

    }
  };


  // ==========================================
  // GENERATE AI ITINERARY
  // ==========================================

  useEffect(() => {

    if (
      !formData ||
      formData.itinerary ||
      startedRef.current
    ) {
      return;
    }

    startedRef.current = true;

    let completeText = "";

    const generate = async () => {

      try {

        setIsStreaming(true);
        setStreamError("");
        setSaveStatus("");

        // Stream itinerary from Firebase AI.
        for await (
          const text of generateItineraryStream(formData)
        ) {

          completeText += text;

          setItinerary(completeText);

        }

        if (!completeText.trim()) {
          throw new Error(
            "Gemini finished without returning an itinerary."
          );
        }

        // Prepare completed trip data.
        const completeTripData = {
          ...formData,
          itinerary: completeText,
          streaming: false,
        };

        // Save locally first.
        localStorage.setItem(
          "tripData",
          JSON.stringify(completeTripData)
        );

        console.log("Itinerary saved locally.");

        // ======================================
        // SAVE COMPLETED TRIP TO MYSQL
        // ======================================

        if (!localStorage.getItem("sanchari_token")) {

          setSaveStatus(
            "Please log in to save this trip to your account. " +
            "Your itinerary is saved locally."
          );

        } else {

          await saveCurrentTrip(completeTripData);

        }

      } catch (error) {

        console.error(
          "Itinerary streaming failed:",
          error
        );

        setStreamError(
          error.message ||
          "Unable to generate your itinerary. Please try again."
        );

        // Preserve partial response if generation fails.
        if (completeText.trim()) {

          localStorage.setItem(
            "tripData",
            JSON.stringify({
              ...formData,
              itinerary: completeText,
              streaming: false,
            })
          );

        }

      } finally {

        setIsStreaming(false);

      }

    };

    generate();

  }, [formData]);

  // ==========================================
  // AUTO-SAVE ON LOGIN IF ITINERARY IS READY
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("sanchari_token");
    if (token && itinerary && !savedTripId && !isStreaming && !isSaving) {
      const storedTrip = localStorage.getItem("tripData");
      if (storedTrip) {
        try {
          const tripData = JSON.parse(storedTrip);
          if (!tripData.savedTripId) {
            saveCurrentTrip({
              ...tripData,
              ...formData,
              itinerary,
            });
          }
        } catch (error) {
          console.error("Auto save parse error:", error);
        }
      }
    }
  }, [itinerary, savedTripId]);


  // ==========================================
  // RETRY SAVING EXISTING ITINERARY
  // ==========================================

  const handleRetrySave = async () => {

    if (isSaving) {
      return;
    }

    try {

      const storedTrip = localStorage.getItem("tripData");

      if (!storedTrip) {
        throw new Error("No saved itinerary found.");
      }

      const tripData = JSON.parse(storedTrip);

      // Use the currently displayed itinerary.
      const tripToSave = {
        ...tripData,
        ...formData,
        itinerary: itinerary || tripData.itinerary,
      };

      if (!tripToSave.itinerary?.trim()) {
        throw new Error("The generated itinerary is empty.");
      }

      if (tripData.savedTripId || savedTripId) {

        setSavedTripId(
          tripData.savedTripId || savedTripId
        );

        setSaveStatus(
          "This trip is already saved to your account."
        );

        return;
      }

      await saveCurrentTrip(tripToSave);

    } catch (error) {

      console.error("Retry save error:", error);

      const errorMsg = error.message || "";
      if (
        errorMsg.toLowerCase().includes("token") ||
        errorMsg.toLowerCase().includes("unauthorized") ||
        errorMsg.toLowerCase().includes("expired")
      ) {
        localStorage.removeItem("sanchari_token");
        setSaveStatus(
          "Your login session has expired. Please log in again to save this trip to your account. Your itinerary is safely preserved!"
        );
      } else {
        setSaveStatus(
          "Unable to save your trip: " + errorMsg
        );
      }

    }

  };


  // ==========================================
  // MODIFY TRIP
  // ==========================================

  const handleModifyPlan = () => {

    navigate("/destinations", {
      state: formData,
    });

  };


  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const handleDownload = async () => {

    if (isStreaming) {

      alert(
        "Please wait until your itinerary is complete."
      );

      return;
    }

    if (streamError && !itinerary.trim()) {

      alert("There is no itinerary to download.");

      return;
    }

    const output = document.getElementById(
      "travel-plan-output"
    );

    if (!output) {

      alert("Travel itinerary not found.");

      return;
    }

    try {

      const safeDestination = String(
        formData.destination || "Trip"
      )
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .trim()
        .replace(/\s+/g, "_")
        .slice(0, 60) || "Trip";

      const options = {

        margin: [10, 10, 10, 10],

        filename:
          `Sanchari_${safeDestination}_Itinerary.pdf`,

        image: {
          type: "jpeg",
          quality: 0.95,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        },

        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },

        pagebreak: {
          mode: ["css", "legacy"],
          avoid: [
            ".itinerary-title",
            ".ai-itinerary h1",
            ".ai-itinerary h2",
            ".ai-itinerary h3",
            ".ai-itinerary li",
          ],
        },

      };

      await html2pdf()
        .set(options)
        .from(output)
        .save();

    } catch (error) {

      console.error(
        "PDF generation error:",
        error
      );

      alert(
        "Unable to create PDF. Please try again."
      );

    }

  };


  // ==========================================
  // NO TRIP DETAILS
  // ==========================================

  if (!formData) {

    return (

      <>
        <Navbar />

        <div className="travel-plan-page">

          <div className="travel-plan-container no-trip">

            <div className="no-trip-icon">
              🌍
            </div>

            <h2>No Trip Details Found</h2>

            <p>
              Please go back and create your travel plan first.
            </p>

            <button
              className="modify-btn"
              onClick={() => navigate("/destinations")}
            >
              ← Plan a Trip
            </button>

          </div>

        </div>

      </>

    );

  }


  // ==========================================
  // MAIN TRAVEL PLAN PAGE
  // ==========================================

  return (

    <>
      <Navbar />

      <div className="travel-plan-page">

        <div className="travel-plan-container">


          {/* PAGE HEADER */}

          <div className="travel-plan-header">

            <div>

              <span className="travel-plan-label">
                ✨ YOUR PERSONALIZED TRIP
              </span>

              <h1>
                Your Travel Plan 🌍
              </h1>

              <p>
                Your personalized itinerary created by Sanchari AI
              </p>

            </div>

            <button
              className="download-btn"
              onClick={handleDownload}
              disabled={isStreaming}
            >
              📥 {isStreaming ? "Generating..." : "Download"}
            </button>

          </div>


          {/* TRIP SUMMARY */}

          <div className="trip-summary">


            <div className="summary-card">

              <span className="summary-icon">📍</span>

              <div>

                <span className="summary-label">
                  Traveling From
                </span>

                <strong>
                  {formData.origin || "Not specified"}
                </strong>

              </div>

            </div>


            <div className="summary-card">

              <span className="summary-icon">📌</span>

              <div>

                <span className="summary-label">
                  Destination
                </span>

                <strong>
                  {formData.destination || "Not specified"}
                </strong>

              </div>

            </div>


            <div className="summary-card">

              <span className="summary-icon">🎭</span>

              <div>

                <span className="summary-label">
                  Travel Style
                </span>

                <strong>
                  {formData.travelStyle || "Not specified"}
                </strong>

              </div>

            </div>


            <div className="summary-card">

              <span className="summary-icon">👥</span>

              <div>

                <span className="summary-label">
                  Travellers
                </span>

                <strong>
                  {formData.travelers || "1"}
                </strong>

              </div>

            </div>


            <div className="summary-card">

              <span className="summary-icon">✈️</span>

              <div>

                <span className="summary-label">
                  Travel Mode
                </span>

                <strong>
                  {formData.travelMode || "Not specified"}
                </strong>

              </div>

            </div>


            <div className="summary-card">

              <span className="summary-icon">📅</span>

              <div>

                <span className="summary-label">
                  Duration
                </span>

                <strong>
                  {formData.duration} Days
                </strong>

              </div>

            </div>


            <div className="summary-card">

              <span className="summary-icon">💰</span>

              <div>

                <span className="summary-label">
                  Budget
                </span>

                <strong>
                  ${formData.budget ?? "Not specified"}
                </strong>

              </div>

            </div>


            <div className="summary-card">

              <span className="summary-icon">⚕️</span>

              <div>

                <span className="summary-label">
                  Health
                </span>

                <strong>
                  {formData.healthConsiderations || "None"}
                </strong>

              </div>

            </div>


          </div>


          {/* AI ITINERARY */}

          <section
            id="travel-plan-output"
            className="itinerary-section"
          >

            <div className="itinerary-title">

              <div className="robot-icon">
                🤖
              </div>

              <div>

                <h2>
                  AI Travel Itinerary
                </h2>

                <p>
                  Your day-by-day personalized travel plan
                </p>

              </div>

            </div>


            {/* DATABASE SAVE STATUS */}

            <div
              style={{
                padding: "10px",
                margin: "10px 0",
              }}
            >

              {saveStatus && (

                <p
                  role="status"
                  style={{
                    color: "#2563eb",
                    fontWeight: "500",
                  }}
                >
                  {saveStatus}
                </p>

              )}


              {/* SAVE / RETRY / LOGIN BUTTONS */}

              {itinerary &&
                !isStreaming &&
                !isSaving &&
                !savedTripId &&
                (!localStorage.getItem("sanchari_token") ||
                  saveStatus.toLowerCase().includes("log in") ||
                  saveStatus.toLowerCase().includes("expired")) && (

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/login", {
                        state: { from: "/travel-plan" },
                      })
                    }
                    className="download-btn"
                    style={{
                      marginTop: "8px",
                      background: "linear-gradient(135deg, #7966f5, #a36cf5)",
                    }}
                  >
                    🔐 Log In to Save Trip
                  </button>

                )}

              {itinerary &&
                !isStreaming &&
                !isSaving &&
                !savedTripId &&
                localStorage.getItem("sanchari_token") &&
                !saveStatus.toLowerCase().includes("log in") &&
                !saveStatus.toLowerCase().includes("expired") && (

                  <button
                    type="button"
                    onClick={handleRetrySave}
                    className="download-btn"
                    style={{
                      marginTop: "8px",
                    }}
                  >
                    🔄 Retry Saving to MySQL & MongoDB
                  </button>

                )}


              {isSaving && (

                <p role="status">
                  Saving your trip...
                </p>

              )}

            </div>


            {/* ITINERARY CONTENT */}

            <div
              className="ai-itinerary"
              aria-live="polite"
            >

              {itinerary && (

                <ReactMarkdown>
                  {itinerary}
                </ReactMarkdown>

              )}


              {/* STREAMING STATUS */}

              {isStreaming && (

                <div
                  className="streaming-status"
                  role="status"
                >

                  <span>🤖</span>

                  <p>
                    {itinerary
                      ? "Sanchari is continuing your itinerary..."
                      : "Sanchari is planning your trip..."}
                  </p>

                </div>

              )}


              {/* STREAMING ERROR */}

              {streamError && (

                <div
                  className="empty-itinerary"
                  role="alert"
                >

                  <h3>
                    Unable to complete your itinerary
                  </h3>

                  <p>
                    {streamError}
                  </p>

                  <button
                    className="modify-btn"
                    onClick={() => navigate("/destinations")}
                  >
                    ← Try Again
                  </button>

                </div>

              )}


              {/* EMPTY ITINERARY */}

              {!itinerary &&
                !isStreaming &&
                !streamError && (

                  <div className="empty-itinerary">

                    <h3>
                      No itinerary generated
                    </h3>

                    <p>
                      Please create your travel plan again.
                    </p>

                  </div>

                )}

            </div>

          </section>


          {/* PAGE ACTIONS */}

          <div className="travel-plan-actions">

            <button
              className="modify-btn"
              onClick={handleModifyPlan}
            >
              ✏️ Modify Trip
            </button>

            <button
              className="download-btn bottom-download"
              onClick={handleDownload}
              disabled={isStreaming}
            >
              📥 Download Itinerary
            </button>

          </div>


          {/* HAPPY JOURNEY */}

          <div className="happy-journey">

            <span>✈️</span>

            <h3>
              Happy Journey!
            </h3>

            <span>🌍</span>

          </div>


        </div>

      </div>

    </>

  );

}

export default TravelPlan;
