import axios from "axios";
import { FEED_URL } from "../config/apiConfig";

// ✅ Fetch feed items with pagination
export const getFeedItems = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${FEED_URL}?page=${page}&limit=${limit}`);
    return response.data; // Returns { items, totalPages, currentPage }
  } catch (error) {
    console.error("Error fetching feed data:", error);
    return { items: [], totalPages: 1, currentPage: 1 };
  }
};
