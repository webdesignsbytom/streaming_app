import React, { useState } from 'react';
// Api
import client from '../../api/client';
import LoadingSpinner from '../../components/LoadingSpinner'

function VideoUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('Waiting for upload...');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    setHasSucceeded(false)
    if (!selectedFile) {
      setUploadStatus('Please select a file.');
      return;
    }
    setUploadStatus('Uploading file...');
    setIsUploading(true)
    const formData = new FormData();
    formData.append('video', selectedFile);

    client
      .postVideo('/videos/upload-video', formData, false)
      .then((res) => {
        console.log('res', res.data);
        console.log('res', res.data.message);
        setUploadStatus(`Upload successful! Video URL: ${res.data.url} >>> `);
        setHasSucceeded(true)
        setIsUploading(false)
      })

      .catch((err) => {
        console.error('Error uploading file:', err);
        setUploadStatus('Error uploading file.');
        setIsUploading(false)
        setHasSucceeded(false)
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
        <div className='w-1/2 mx-auto'>
        <div className='my-2'>
          {hasSucceeded && <h2 className='text-green-500 text-2xl font-bold'>SUCCESS</h2>}
        </div>
        <div>

          <p>{uploadStatus}</p>
        </div>

          <div className='grid justify-center my-4'>
            {isUploading && <LoadingSpinner width={'w-16'} height={'h-16'} />}
          </div>
        </div>
      </section>
    </div>
  );
}

export default VideoUploadPage;
