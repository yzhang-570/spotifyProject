import express from 'express';
import axios from 'axios';

const router = express.Router();

const scopes = [
  'user-top-read',
  'user-library-read',
  'user-read-private',
  'user-read-email',
].join(' ');

// step 1: redirect user to Spotify login
router.get('/login', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    scope: scopes,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

// step 2: Spotify redirects here after login
router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
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

    const { access_token, refresh_token } = response.data;

    // store tokens in session
    req.session.access_token = access_token;
    req.session.refresh_token = refresh_token;

    // fetch and store user profile
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    req.session.user = userResponse.data;

    // redirect to frontend
    res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json('Authentication failed');
  }
});

// step 3: check if logged in
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json('Not logged in');
  }
});

// step 4: logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json('Logged out');
});

export default router;