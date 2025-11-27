import React, { useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Mic, PauseIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addValue } from "@/redux/features/ui/fileSlice";
// import { setValue } from "@/features/ui/fileSlice";

const AudioRecording = ({ toolbarStyles }) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const audioPreviewRef = useRef(null);
  const [previewStream, setPreviewStream] = useState(null);
  //for live stream purpose
  const VideoStream = () => {
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        if (mounted) {
          setPreviewStream(stream);
          if (audioPreviewRef.current) {
            audioPreviewRef.current.srcObject = stream;
          }
        }
      })
      .catch((err) => console.error("Error accessing camera/mic:", err));

    return () => {
      navigator.mediaDevices.getUserMedia({ video: false, audio: false });
      mounted = false;
      previewStream?.getTracks().forEach((track) => track.stop());
    };
  };
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      mediaStream: previewStream,
    });
  const handleSubmit = async () => {
    if (!mediaBlobUrl) return;

    const blob = await fetch(mediaBlobUrl).then((res) => res.blob());
    const file = new File([blob], `video-${Date.now()}.webm`, {
      type: blob.type,
    });

    const fileName = `audio-${Date.now()}.webm`;
    dispatch(
      addValue({
        fileLink: mediaBlobUrl,
        file: file,
        fileType: "audio",
        filePath: `audio/${fileName}`,
      })
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={VideoStream}>
          <Mic className="h-4 w-4" style={toolbarStyles} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p>
            Status: <strong>{status}</strong>
          </p>

          <audio
            ref={audioPreviewRef}
            autoPlay
            muted
            playsInline
            className="w-full max-w-md rounded border"
          />

          {/* Controls */}
          <div className="flex gap-2">
            <Button onClick={startRecording}>
              <Mic className="w-12 h-12" />
            </Button>
            <Button variant="destructive" onClick={stopRecording}>
              <PauseIcon className="w-6 h-6" />
            </Button>
            <Button variant="success" onClick={handleSubmit}>
              Send
            </Button>
          </div>

          {/* Playback after recording */}
          {mediaBlobUrl && (
            <div>
              <h4 className="mt-4 mb-1 font-medium">Playback</h4>
              <audio
                controls
                className="w-full appearance-none rounded-lg p-2"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioRecording;
