import express from 'express';
import axios from 'axios';

const router = express.Router();

// middleware to check if logged in
const requireAuth = (req, res, next) => {
  if (!req.session.access_token) {
    return res.status(401).json('Not logged in');
  }
  next();
};

const spotifyAPI = (token) => axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: { Authorization: `Bearer ${token}` }
});

// get liked songs
router.get('/liked-songs', requireAuth, async (req, res) => {
  try {
    const response = await spotifyAPI(req.session.access_token).get('/me/tracks?limit=50');
    res.json(response.data);
  } catch (error) {
    res.status(500).json(`Error fetching liked songs: ${error}`);
  }
});

// get top artists (time_range: short_term, medium_term, long_term)
router.get('/top-artists', requireAuth, async (req, res) => {
  const { time_range = 'medium_term' } = req.query;
  try {
    const response = await spotifyAPI(req.session.access_token).get(`/me/top/artists?time_range=${time_range}&limit=50`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json(`Error fetching top artists: ${error}`);
  }
});

// get top songs (time_range: short_term, medium_term, long_term)
router.get('/top-songs', requireAuth, async (req, res) => {
  const { time_range = 'medium_term' } = req.query;
  try {
    const response = await spotifyAPI(req.session.access_token).get(`/me/top/tracks?time_range=${time_range}&limit=50`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json(`Error fetching top songs: ${error}`);
  }
});

export default router;