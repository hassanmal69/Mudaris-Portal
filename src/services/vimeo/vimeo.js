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

// client identifier: ea889f62734e9123bd796f55e661cbf5e8f3bfdf
// Client secrets : cF/TPA140eFW5tpBuyfoawFZLnFZvLy2wYELbGV06wsz4MpOWNgBIah6t+/kFemqEzjVfs3p+IZSNcseuJpI1Ef3DmzYIDikDfpxc3sPo2jPdGJvfLqF3ukeBg/Azwv7
// Authorize URL : https://api.vimeo.com/oauth/authorize
// Access Token URL : https://api.vimeo.com/oauth/access_token
