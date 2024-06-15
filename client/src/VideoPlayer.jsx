import React, { useEffect, useRef } from 'react';
import axios from 'axios';

function VideoPlayer() {
    const videoRef = useRef(null);

    const fetchVideo = async () => {
        const response = await axios.get('http://localhost:3001/video', {
            responseType: 'blob',
        });
        const videoUrl = URL.createObjectURL(response.data);
        videoRef.current.src = videoUrl;
    };

    useEffect(() => {
        fetchVideo();
    }, []);

    const requestNextVideo = async () => {
        await axios.get('http://localhost:3001/next');
        fetchVideo();
    };

    const requestPreviousVideo = async () => {
        await axios.get('http://localhost:3001/previous');
        fetchVideo();
    };

    return (
        <div className='grid h-screen w-full overflow-hidden'>
            <video ref={videoRef} autoPlay className='h-full w-full object-contain' controls />
            <div className="absolute bottom-0 left-0 right-0 flex justify-between p-4">
                <button onClick={requestPreviousVideo} className="bg-gray-800 text-white py-2 px-4 rounded">
                    Previous
                </button>
                <button onClick={requestNextVideo} className="bg-gray-800 text-white py-2 px-4 rounded">
                    Next
                </button>
            </div>
        </div>
    );
}

export default VideoPlayer;
