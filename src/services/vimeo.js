import axios from "axios";

const VIMEO_API = "https://api.vimeo.com";
const token = import.meta.env.VITE_VIMEO_ACCESS_TOKEN;

export const fetchVideos = async (userId) => {
  try {
    const response = await axios.get(`${VIMEO_API}/users/${userId}/videos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        per_page: 50, // fetch 50 videos per request
      },
    });
    return response.data.data; // array of video objects
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
};
