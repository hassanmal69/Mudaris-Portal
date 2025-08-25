import React, { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { addValue } from "@/features/ui/fileSlice";
import { useDispatch } from "react-redux";

const VideoRecording = () => {
  const dispatch = useDispatch();
  const videoPreviewRef = useRef(null);
  const [previewStream, setPreviewStream] = useState(null);
  //for live stream purpose
  const VideoStream = () => {
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (mounted) {
          setPreviewStream(stream);
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream; // ✅ always show live preview
          }
        }
      })
      .catch((err) => console.error("Error accessing camera/mic:", err));

    return () => {
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: false });
      mounted = false;
      previewStream?.getTracks().forEach((track) => track.stop());
    };
  }

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      video: true,
      audio: true,
      mediaStream: previewStream,
    });

  const handleSubmit = async () => {
    if (!mediaBlobUrl) return;

    const blob = await fetch(mediaBlobUrl).then((res) => res.blob());
    const file = new File([blob], `video-${Date.now()}.webm`, {
      type: blob.type,
    });

    const fileName = `video-${Date.now()}.webm`
    dispatch(addValue({
      fileLink: mediaBlobUrl,
      file: file,
      fileType: "video",
      filePath: `video/recorded/${fileName}`
    }));

    // try {
    //   const { error: uploadError } = await supabase.storage
    //     .from("media")
    //     .upload(newFilePath, file, { upsert: true })

    //   if (uploadError) {
    //     console.error("Error uploading file:", uploadError)
    //   }
    // } catch (err) {
    //   console.error("❌ Upload failed:", err);
    // }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded hover:bg-gray-200" onClick={VideoStream}>
          <Video className="w-6 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record a Video</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            Status: <strong>{status}</strong>
          </p>

          {/* 🔴 Live Preview works while recording */}
          <video
            ref={videoPreviewRef}
            autoPlay
            muted
            playsInline
            className="w-full max-w-md rounded border"
          />

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              onClick={startRecording}
              className="bg-green-500 hover:bg-green-600"
            >
              Start
            </Button>
            <Button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600"
            >
              Stop
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Send
            </Button>
          </div>

          {/* Playback after recording */}
          {mediaBlobUrl && (
            <div>
              <h4 className="mt-4 mb-1 font-medium">Playback</h4>
              <video
                src={mediaBlobUrl}
                controls
                className="w-full max-w-md rounded border"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoRecording;
