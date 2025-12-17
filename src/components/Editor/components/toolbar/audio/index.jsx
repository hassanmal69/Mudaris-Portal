import React, { useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addValue } from "@/redux/features/ui/fileSlice";

const AudioRecording = () => {
  const dispatch = useDispatch();
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
    });
  useEffect(() => {
    if (status === "stopped" && mediaBlobUrl) {
      handleSubmit();
    }
  }, [status, mediaBlobUrl]);

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
  };

  return (
    <div className="">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(status === 'idle' || status === 'stopped') && (
            <Button onClick={startRecording}>
              <Mic className="w-20 h-20  text-(--primary-foreground" />
            </Button>
          )}
          {status === 'recording' && (
            <Button variant="destructive" onClick={stopRecording}>
              <StopCircle className="w-20 h-20" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecording;
