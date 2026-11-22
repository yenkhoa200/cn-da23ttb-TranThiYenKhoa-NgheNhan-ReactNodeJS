import { readApiResponse } from "./apiResponse.js";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

async function request(path) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/tourist/${path}`);
  } catch {
    throw new Error("Không thể kết nối máy chủ để tải nội dung du khách.");
  }

  return readApiResponse(response);
}

const touristContentService = {
  getArtisans: () => request("artisans"),
  getStories: () => request("stories"),
  getTraditionalCrafts: () => request("traditional-crafts"),
};

export default touristContentService;
