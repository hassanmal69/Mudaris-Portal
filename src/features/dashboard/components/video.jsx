import React, { useEffect, useRef, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { supabase } from '../../../../supabaseClient.js';
import axios from 'axios'
const Video = () => {
    const videoPreviewRef = useRef(null);
    const [previewStream, setPreviewStream] = useState(null);
    useEffect(() => {
        let mounted = true;
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                if (mounted) {
                    setPreviewStream(stream);
                    if (videoPreviewRef.current) {
                        videoPreviewRef.current.srcObject = stream;
                    }
                }
            })
            .catch(err => console.error("Error accessing camera/mic:", err));

        return () => {
            mounted = false;
            // Clean up tracks when unmounting
            previewStream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl
    } = useReactMediaRecorder({
        video: true,
        audio: true,
        mediaStream: previewStream
    });
    const handleSubmit = async () => {
        if (!mediaBlobUrl) return;

        const blob = await fetch(mediaBlobUrl).then(res => res.blob());
        const file = new File([blob], `video-${Date.now()}.webm`, { type: blob.type });

        const formData = new FormData();
        formData.append('uploaded_file', file);         // 🔸 name="uploaded_file" matches Multer field
        console.log(file)
        try {
            const res = await axios.post('/api/videoSend', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload success:', res.data);
        } catch (err) {
            console.error('Upload failed:', err);
        }

    };

    return (
        <div className="p-4 space-y-4">
            <p>Status: <strong>{status}</strong></p>

            {/* Live Preview */}
            <div>
                <h4 className="mb-1">Live Preview</h4>
                <video
                    ref={videoPreviewRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full max-w-md rounded"
                />
            </div>

            {/* Record Controls */}
            <div className="space-x-2">
                <button
                    onClick={startRecording}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >Start Recording</button>
                <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >Stop Recording</button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-purple-500 text-white rounded"
                >Send</button>
            </div>

            {/* Playback of what you recorded */}
            {mediaBlobUrl && (
                <div>
                    <h4 className="mt-4 mb-1">Playback</h4>
                    <p>{mediaBlobUrl}</p>
                    <video
                        src={mediaBlobUrl}
                        controls
                        className="w-full max-w-md rounded"
                    />
                </div>
            )}
        </div>

    );
};

export default Video;
// const fileName = `video-${Date.now()}.webm`;
//     const { data, error } = await supabase.storage.from('media')
//         .upload(`video/${fileName}`, blob, {
//             contentType: 'video/webm',
//             upsert: false, // set to true if you want to overwrite duplicates
//         })
//     if (error) {
//         console.error('❌ Upload failed:', error);
//         return null;
//     }

//     console.log('✅ Uploaded:', data);

//     // Optional: generate public URL
//     const { data: publicUrlData } = supabase.storage
//         .from('media')
//         .getPublicUrl(`video/${fileName}`);

//     console.log('🌐 Public URL:', publicUrlData?.publicUrl);
