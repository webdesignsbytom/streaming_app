import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import * as url from 'url';

const app = express();
app.disable('x-powered-by');

// Add middleware
app.use(cors({
  origin: "*"
}));

const PORT = 3001;

// Get the directory name
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get video files from directory
const videoDirectory = path.join(__dirname, 'videos');
let videos = fs.readdirSync(videoDirectory).filter(file => file.endsWith('.mp4'));
let currentVideoIndex = 0;

// Helper function to get video path
const getVideoPath = (index) => path.join(videoDirectory, videos[index]);

app.get('/', (req, res) => {
  res.send('Welcome to the Video Streaming Server. Use /video to stream a video.');
});


app.get('/video', (req, res) => {
  const videoPath = getVideoPath(currentVideoIndex);
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.get('/next', (req, res) => {
  if (currentVideoIndex < videos.length - 1) {
    currentVideoIndex++;
  } else {
    currentVideoIndex = 0; // Loop back to the first video
  }
  res.redirect('/video');
});

app.get('/previous', (req, res) => {
  if (currentVideoIndex > 0) {
    currentVideoIndex--;
  } else {
    currentVideoIndex = videos.length - 1; // Loop back to the last video
  }
  res.redirect('/video');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
