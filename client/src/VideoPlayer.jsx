import React, { useEffect, useRef } from 'react';
import axios from 'axios';

function VideoPlayer() {
  const videoRef = useRef(null);
  console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/video`,
        {
          responseType: 'blob',
        }
      );
      const videoUrl = URL.createObjectURL(response.data);
      videoRef.current.src = videoUrl;
    } catch (error) {
      console.error('Error fetching video:', error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  const requestNextVideo = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/next`);
      fetchVideo();
    } catch (error) {
      console.error('Error requesting next video:', error);
    }
  };

  const requestPreviousVideo = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/previous`);
      fetchVideo();
    } catch (error) {
      console.error('Error requesting previous video:', error);
    }
  };

  return (
    <div className='grid h-screen w-full overflow-hidden'>
      <video
        ref={videoRef}
        autoPlay
        className='h-full w-full object-contain'
        controls
      />
      <div className='absolute bottom-0 left-0 right-0 flex justify-between p-4'>
        <button
          onClick={requestPreviousVideo}
          className='bg-gray-800 text-white py-2 px-4 rounded'
        >
          Previous
        </button>
        <button
          onClick={requestNextVideo}
          className='bg-gray-800 text-white py-2 px-4 rounded'
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;
