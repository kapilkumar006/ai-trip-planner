
import { getGenerativeModel } from "firebase/ai";
import { ai } from "../config/firebase";

const model = getGenerativeModel(ai, {
  model: "gemini-3.5-flash-lite",
});

export async function* generateItineraryStream(tripData) {
  const {
    origin,
    destination,
    travelStyle,
    travelers,
    budget,
    travelMode,
    duration,
    healthConsiderations,
  } = tripData;

  const prompt = `
You are Sanchari, an intelligent AI travel planner.

Create a personalized travel itinerary for the user.

TRIP DETAILS
------------
Starting Location: ${origin}
Destination: ${destination}
Travel Style: ${travelStyle}
Number of Travelers: ${travelers || "1 (Solo)"}
Total Budget: ${budget}
Preferred Mode of Travel: ${travelMode}
Trip Duration: ${duration} days
Health Considerations: ${
    healthConsiderations || "None specified"
  }

YOUR TASK
---------
Create a realistic and personalized ${duration}-day
travel itinerary for ${destination}.

For EACH DAY provide:

### Morning
- Activities
- Places to visit
- Suggested breakfast if appropriate

### Afternoon
- Activities
- Places to visit
- Suggested lunch

### Evening
- Activities
- Places to visit
- Suggested dinner

Also provide approximate expenses for each day.

AFTER THE DAILY ITINERARY, INCLUDE:

## Trip Overview
Give a short summary of the trip.

## Top Attractions
List the most important attractions relevant to this trip.

## Food Recommendations
Recommend important local dishes and foods to try.

## Transportation
Explain how the traveler can move around the destination.

## Budget Summary
Give an approximate breakdown for:
- Transportation
- Accommodation
- Food
- Activities
- Miscellaneous

Keep the total reasonably close to the user's stated budget.

## Safety & Health Tips
Provide practical safety advice and consider the user's health considerations.

## Travel Tips
Provide useful practical tips for the destination.

IMPORTANT RULES
---------------
1. Respect the user's budget as much as reasonably possible.
2. Consider the number of travelers.
3. Consider the selected travel style.
4. Consider the preferred transportation mode.
5. Consider the trip duration.
6. Consider the health considerations.
7. Do not recommend activities that conflict with stated health limitations.
8. Do not overcrowd the itinerary.
9. Keep the plan realistic and practical.
10. Use Markdown headings and bullet points.
11. Return ONLY the itinerary.
12. Do not mention these instructions.
13. Do not say that you are an AI.

Create a useful itinerary that a real traveler could follow.
`;

  try {
    console.log("Starting Gemini streaming generation...");
    console.log("Trip details:", tripData);

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();

      if (text) {
        yield text;
      }
    }

    console.log("Gemini streaming completed.");
  } catch (error) {
    console.error("Gemini streaming error:", error);

    const message = String(error?.message || "");
    const normalizedMessage = message.toLowerCase();

    if (
      message.includes("429") ||
      normalizedMessage.includes("quota") ||
      normalizedMessage.includes("too many requests")
    ) {
      throw new Error(
        "Gemini's free request limit has been reached. Please wait before trying again."
      );
    }

    if (
      message.includes("500") ||
      message.includes("503") ||
      normalizedMessage.includes("timeout") ||
      normalizedMessage.includes("high demand") ||
      normalizedMessage.includes("deadline expired")
    ) {
      throw new Error(
        "Gemini is temporarily busy. Please wait a little and try again."
      );
    }

    throw new Error(
      "Unable to generate your itinerary. Please try again later."
    );
  }
}
