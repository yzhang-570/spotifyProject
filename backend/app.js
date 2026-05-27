import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import authRouter from './routes/auth.js';
import spotifyRouter from './routes/spotify.js';

const app = express();
const port = process.env.PORT || 8888;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
  }
}));

// routers must come AFTER session
app.use('/auth', authRouter);
app.use('/spotify', spotifyRouter);

app.get('/', (req, res) => {
  res.json('Welcome to root.');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});