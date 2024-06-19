import { Route, Routes } from 'react-router-dom';
// Pages
import VideoPlayerPage from './pages/video/VideoPlayerPage';
import VideoUploadPage from './pages/video/VideoUploadPage';
import HomePage from './pages/home/HomePage';

function App() {
  return (
    <Routes>
      <Route path='/' index element={<HomePage />} />
      <Route path='/videos' element={<VideoPlayerPage />} />
      <Route path='/upload' element={<VideoUploadPage />} />
    </Routes>
  );
}

export default App;
