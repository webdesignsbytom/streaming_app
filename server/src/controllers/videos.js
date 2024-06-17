import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import multer from 'multer';
import * as url from 'url';

// Get the directory name
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoDirectory = path.join(__dirname, '..', '..', 'videos');
const uploadDirectory = path.join(__dirname, '..', '..', 'uploads');
const compressedDirectory = path.join(__dirname, '..', '..', 'compressed');

let videos = fs
  .readdirSync(videoDirectory)
  .filter((file) => file.endsWith('.mp4'));
let currentVideoIndex = 0;

// Helper function to get video path
const getVideoPath = (index) => path.join(videoDirectory, videos[index]);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single('video');

export const getMainVideo = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Using a session-based approach for user-specific video tracking
  if (!req.session.currentVideoIndex) {
    req.session.currentVideoIndex = 0;
  }

  const videoPath = getVideoPath(req.session.currentVideoIndex);
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
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
};

export const getNextMainVideo = async (req, res) => {
  if (req.session.currentVideoIndex < videos.length - 1) {
    req.session.currentVideoIndex++;
  } else {
    req.session.currentVideoIndex = 0; // Loop back to the first video
  }
  res.redirect('/video');
};

export const getPreviousMainVideo = async (req, res) => {
  if (req.session.currentVideoIndex > 0) {
    req.session.currentVideoIndex--;
  } else {
    req.session.currentVideoIndex = videos.length - 1; // Loop back to the last video
  }
  res.redirect('/video');
};

export const uploadMainVideo = async (req, res) => {
  console.log('uploadMainVideo');
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading video' });
    }

    const filePath = req.file.path;
    const outputPath = path.join(
      compressedDirectory,
      `${Date.now()}-compressed.mp4`
    );

    // Use ffmpeg to compress the video
    ffmpeg(filePath)
      .output(outputPath)
      .videoCodec('libx264')
      .size('640x?')
      .format('mp4')
      .on('end', () => {
        // Delete the original file
        fs.unlinkSync(filePath);
        // Refresh the video list
        videos = fs
          .readdirSync(videoDirectory)
          .filter((file) => file.endsWith('.mp4'));
        res.json({
          message: 'Video uploaded and compressed successfully',
          path: outputPath,
        });
      })
      .on('error', (err) => {
        console.error(err);
        res.status(500).json({ message: 'Error compressing video' });
      })
      .run();
  });
};
