import axios from "axios";

const VIMEO_API = "https://api.vimeo.com";
const token = import.meta.env.VITE_VIMEO_ACCESS_TOKEN;

export const fetchPrivateVideos = async (videoId) => {
  try {
    const response = await axios.get(`${VIMEO_API}/videos/${videoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        per_page: 10, // fetch 10 videos per request
      },
    });
    return response.data; // array of video objects
  } catch (err) {
    console.error("Error fetching videos:", err);
    return [];
  }
};
