import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { fetchVideos } from "../services/vimeo";

export default function VimeoGallery({ userId }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getVideos = async () => {
      const data = await fetchVideos(userId);
      setVideos(data);
    };
    getVideos();
  }, [userId]);

  return (
    <div>
      {videos.length === 0 && <p>Loading lectures...</p>}
      {videos.map((video) => (
        <div key={video.uri} style={{ marginBottom: "20px" }}>
          <h3>{video.name}</h3>
          <ReactPlayer
            url={video.link} // Vimeo streaming link
            controls
            width="100%"
            height="360px"
          />
        </div>
      ))}
    </div>
  );
}
