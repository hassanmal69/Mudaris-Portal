import { Plus, Mic, Send } from "lucide-react";
import React from "react";
import "./addon.css";
import VideoRecording from "../../../pages/dashboard/components/video.jsx";
import AudioRecording from "@/pages/dashboard/components/audio";
const AddOn = () => {
  const [recordVideo, setRecordVideo] = React.useState(false);
  const [recordAudio, setRecordAudio] = React.useState(false);
  return (
    <section className="addon-container bg-[#eee]">
      <div className="addon-group">
        <div className="first">
          <button title="file">
            <Plus className="w-5 h-5" />
          </button>
          <button title="mention">
            <span className="w-5 h-5">@</span>
          </button>
          <button title="video">
            {/* <Video className="w-5 h-5" /> */}
          <VideoRecording/>
          </button>
          <button title="audio">
            <AudioRecording/>
          </button>
        </div>

        <div className="last">
          <button title="submit" type="submit">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddOn;
