import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import * as url from 'url';
import session from 'express-session';
import { join } from 'path';
// Routes
import videoRouter from './routes/videos.js';

const app = express();
app.disable('x-powered-by');

// Add middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Configure sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'efw8fw8fne2',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

const PORT = process.env.PORT || 3001;

// Get the directory name
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
app.use('/videos', videoRouter);

// Server interface page
app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: join(__dirname, 'views'),
  });
});

// For all unknown requests 404 page returns
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
