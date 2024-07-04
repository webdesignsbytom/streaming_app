import React, { useState } from 'react';
import client from '../../api/client';

function TestPage() {
  const [displayMessage, setDisplayMessage] = useState('Waiting for...');

  const testApi = (event) => {
    event.preventDefault();
    console.log('start');
    setDisplayMessage('loading...');
    client
      .get(`/admin/admin-test`)
      .then((res) => {
        console.log('res', res);
        setDisplayMessage(res.data.data.message);
      })
      .catch((err) => {
        console.error('Unable to test api', err);
        setDisplayMessage('Error: ' + err.message);
      });
  };

  return (
    <div className='h-screen max-h-screen overflow-hidden'>
      <section className='grid items-center justify-center h-full w-full'>
        <button
          onClick={testApi}
          className='grid items-center justify-center text-center w-52 h-16 bg-blue-400 hover:brightness-110 active:scale-95 rounded-lg'
        >
          <div>TEST API</div>
        </button>

        <div className='tet-center'>{displayMessage}</div>
      </section>
    </div>
  );
}

export default TestPage;
