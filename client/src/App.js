import { Route, Routes } from 'react-router-dom';
// Pages
import VideoPlayerPage from './pages/video/VideoPlayerPage';
import VideoUploadPage from './pages/video/VideoUploadPage';
import HomePage from './pages/home/HomePage';
import TestPage from './pages/test/TestPage';

function App() {
  return (
    <Routes>
      <Route path='/' index element={<HomePage />} />
      <Route path='/videos' element={<VideoPlayerPage />} />
      <Route path='/upload' element={<VideoUploadPage />} />
      <Route path='/test' element={<TestPage />} />
    </Routes>
  );
}

export default App;
