import React, { useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Mic } from "lucide-react";
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
import { useDispatch } from "react-redux";
import { setValue } from "@/features/ui/fileSlice";

const AudioRecording = () => {
    const dispatch = useDispatch()
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
                        audioPreviewRef.current.srcObject = stream; // ✅ always show live preview
                    }
                }
            })
            .catch((err) => console.error("Error accessing camera/mic:", err));

        return () => {
            navigator.mediaDevices
                .getUserMedia({ video: false, audio: false });
            mounted = false;
            console.log('first')
            previewStream?.getTracks().forEach((track) => track.stop());
        };
    }
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

        ("uploaded_file", file);
        dispatch(setValue({ file: mediaBlobUrl, fileType: "audio" }));

        // try {
        //     const { error: uploadError } = await supabase.storage
        //         .from("media")
        //         .upload(newFilePath, file, { upsert: true })

        //     if (uploadError) {
        //         console.error("Error uploading file:", uploadError)
        //     }
        // } catch (err) {
        //     console.error("❌ Upload failed:", err);
        // }
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="p-2 rounded hover:bg-gray-200" onClick={VideoStream}>
                    <Mic className="w-6 h-6" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Record </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <p>
                        Status: <strong>{status}</strong>
                    </p>

                    {/* 🔴 Live Preview works while recording */}
                    <audio
                        ref={audioPreviewRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full max-w-md rounded border"
                    />

                    {/* Controls */}
                    <div className="flex gap-2">
                        <Button
                            onClick={startRecording}
                        >
                            <MicIcon className="w-12 h-12" />

                        </Button>
                        <Button
                            onClick={stopRecording}
                        >
                            <PauseIcon className="w-6 h-6" />

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
                            <audio
                                src={mediaBlobUrl}
                                controls
                                className="w-full max-w-md rounded border"
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AudioRecording


function MicIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
    )
}


function PauseIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="14" y="4" width="4" height="16" rx="1" />
            <rect x="6" y="4" width="4" height="16" rx="1" />
        </svg>
    )
}


function PlayIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
    )
}


function SettingsIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}