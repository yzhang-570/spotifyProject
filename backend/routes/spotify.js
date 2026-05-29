import express from 'express';
import axios from 'axios';

const router = express.Router();

// middleware to check if logged in
const requireAuth = (req, res, next) => {
  if (!req.session.access_token) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
};

const spotifyAPI = (token) => axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: { Authorization: `Bearer ${token}` }
});

// refresh token if spotify call fails
const refreshAccessToken = async (req) => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: req.session.refresh_token,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
    }
  );

  req.session.access_token = response.data.access_token;

  await new Promise((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });

  return req.session.access_token;
};

const spotifyGet = async (req, path) => {
  try {
    return await spotifyAPI(req.session.access_token).get(path);
  } catch (error) {
    if (error.response?.status === 401 && req.session.refresh_token) {
      await refreshAccessToken(req);
      return await spotifyAPI(req.session.access_token).get(path);
    }
    throw error;
  }
};

// track artists dont include images, so fetch full artist data
const enrichArtistsWithImages = async (req, artists) => {
  const needsImages = artists.some((artist) => !artist.images?.length);
  if (!needsImages || artists.length === 0) {
    return artists;
  }

  const ids = artists
    .map((artist) => artist.id)
    .filter(Boolean)
    .slice(0, 50)
    .join(',');

  if (!ids) {
    return artists;
  }

  try {
    const artistsResponse = await spotifyGet(req, `/artists?ids=${ids}`);
    const fullArtists = (artistsResponse.data.artists || []).filter(Boolean);
    const artistMap = new Map();

    for (const artist of fullArtists) {
      if (artist.id) {
        artistMap.set(artist.id, artist);
      }
    }

    return artists.map((artist) => {
      const fullArtist = artistMap.get(artist.id);
      if (fullArtist?.images?.length) {
        return { ...artist, images: fullArtist.images, name: fullArtist.name || artist.name };
      }
      return artist;
    });
  } catch (error) {
    // still return artists even if image fetch fails
    return artists;
  }
};

// get liked songs
router.get('/liked-songs', requireAuth, async (req, res) => {
  try {
    const response = await spotifyGet(req, '/me/tracks?limit=50');
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Error fetching liked songs' });
  }
});

// get top artists (time_range: short_term, medium_term, long_term)
router.get('/top-artists', requireAuth, async (req, res) => {
  const { time_range = 'medium_term' } = req.query;
  try {
    const response = await spotifyGet(req, `/me/top/artists?time_range=${time_range}&limit=50`);
    let items = response.data.items || [];

    // spotify sometimes returns empty artists but top tracks still has data
    if (items.length === 0) {
      const tracksResponse = await spotifyGet(req, `/me/top/tracks?time_range=${time_range}&limit=50`);
      const seen = new Set();
      items = [];

      for (const track of tracksResponse.data.items || []) {
        for (const artist of track.artists || []) {
          if (!seen.has(artist.id)) {
            seen.add(artist.id);
            items.push(artist);
          }
        }
      }
    }

    items = await enrichArtistsWithImages(req, items);

    res.json({ ...response.data, items });
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Error fetching top artists' });
  }
});

// get top songs (time_range: short_term, medium_term, long_term)
router.get('/top-songs', requireAuth, async (req, res) => {
  const { time_range = 'medium_term' } = req.query;
  try {
    const response = await spotifyGet(req, `/me/top/tracks?time_range=${time_range}&limit=50`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Error fetching top songs' });
  }
});

export default router;