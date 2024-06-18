import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import client from '../api/client';

function VideoPlayer() {
  const videoRef = useRef(null);
  console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL);

  const fetchVideo = async () => {
    client
      .getVideo(`/videos/video`)
      .then((res) => {
        console.log('response', res.data);
        const videoUrl = URL.createObjectURL(res.data);
        videoRef.current.src = videoUrl;
      })
      .catch((err) => {
        console.error('Unable to get video', err);
      });
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  const requestNextVideo = async () => {
    client
      .getVideo(`/videos/next-video`)
      .then((res) => {
        console.log('response', res.data);
        const videoUrl = URL.createObjectURL(res.data);
        videoRef.current.src = videoUrl;
      })
      .catch((err) => {
        console.error('Unable to get video', err);
      });
  };

  const requestPreviousVideo = async () => {
    client
      .getVideo(`/videos/previous-video`)
      .then((res) => {
        console.log('response', res.data);
        const videoUrl = URL.createObjectURL(res.data);
        videoRef.current.src = videoUrl;
      })
      .catch((err) => {
        console.error('Unable to get video', err);
      });
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
