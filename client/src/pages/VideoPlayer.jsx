import React, { useEffect, useRef } from 'react';
// Api
import client from '../api/client';

function VideoPlayer() {
  const videoRef = useRef(null);

  const fetchVideo = async (url) => {
    client
      .getVideo(url)
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
    fetchVideo('/videos/video');
  }, []);

  const requestNextVideo = () => fetchVideo('/videos/next-video');
  const requestPreviousVideo = () => fetchVideo('/videos/previous-video');

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
