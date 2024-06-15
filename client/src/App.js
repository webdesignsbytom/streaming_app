import { Route, Routes } from 'react-router-dom';
// Pages
import VideoPlayer from './pages/VideoPlayer';
import VideoUpload from './pages/VideoUpload';

function App() {
  return (
    <Routes>
      <Route path='/' element={<VideoPlayer />} />
      <Route path='/upload' element={<VideoUpload />} />
    </Routes>
  );
}

export default App;
