import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className='grid h-screen bg-blue-200 w-full'>
      <main className='grid justify-center items-center h-full w-full'>
        <section>
          <div className='mb-10 text-center'>
            <h1>STREAMING SERVER</h1>
          </div>

          <section className='grid grid-cols-2 gap-6'>
            <div className='grid bg-slate-600 rounded px-6 py-4 w-full text-white cursor-pointer active:scale-95 hover:brightness-90'>
              <Link to='/videos'>Videos</Link>
            </div>
            <div className='grid bg-slate-600 rounded px-6 py-4 w-full text-white cursor-pointer active:scale-95 hover:brightness-90'>
              <Link to='/upload'>Upload</Link>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
