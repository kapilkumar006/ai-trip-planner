import { API_BASE_URL } from "../config/api";

export const getDestinations = async () => {
  const response = await fetch(`${API_BASE_URL}/api/destinations`);

  if (!response.ok) {
    throw new Error("Failed to fetch destinations");
  }

  const data = await response.json();

  return data.destinations;
};