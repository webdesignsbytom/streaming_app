import React, { useState } from 'react';
// Api
import client from '../api/client';

function VideoUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('Waiting for upload...');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file.');
      return;
    }
    setUploadStatus('Uploading file...');

    const formData = new FormData();
    formData.append('video', selectedFile);

    client
      .postVideo('/videos/upload-video', formData, false)
      .then((res) => {
        console.log('res', res);
        setUploadStatus(`Upload successful! Video URL: ${res.data.url}`);
      })

      .catch((err) => {
        console.error('Error uploading file:', err);
        setUploadStatus('Error uploading file.');
      });
  };

  return (
    <div className='grid bg-gray-50 h-screen'>
      <section className='text-center text-xl font-semibold'>
        <h1>Video Upload</h1>
      </section>

      <section className='grid gap-2'>
        <div className='grid justify-center h-fit'>
          <input
            className='outline outline-1 outline-gray-500 rounded p-1'
            type='file'
            accept='video/*'
            onChange={handleFileChange}
          />
        </div>
        <div className='grid justify-center h-fit'>
          <button
            className='bg-slate-800 rounded py-2 px-6 active:scale-95 text-white '
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
      </section>

      <section className='text-center'>
        <p>{uploadStatus}</p>
      </section>
    </div>
  );
}

export default VideoUpload;
