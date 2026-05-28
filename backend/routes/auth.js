import express from 'express';
import axios from 'axios';
import db from '../firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { upsertSessionUser } from '../db/users.js';

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

    // fetch Spotify profile
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const spotifyUser = userResponse.data;

    // store tokens in session
    req.session.access_token = access_token;
    req.session.refresh_token = refresh_token;
    req.session.user = spotifyUser;

    // check if user already exists in Firebase
    const userRef = doc(db, 'users', spotifyUser.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // fetch liked songs, top songs, top artists
      const [likedSongsRes, topSongsRes, topArtistsRes] = await Promise.all([
        axios.get('https://api.spotify.com/v1/me/tracks?limit=10', {
          headers: { Authorization: `Bearer ${access_token}` }
        }),
        axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10', {
          headers: { Authorization: `Bearer ${access_token}` }
        }),
        axios.get('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10', {
          headers: { Authorization: `Bearer ${access_token}` }
        }),
      ]);

      // first time login — create user in Firebase
      await setDoc(userRef, {
        spotifyId: spotifyUser.id,
        displayName: spotifyUser.display_name,
        email: spotifyUser.email,
        profilePicture: spotifyUser.images?.[0]?.url || null,
        isPrivate: false,
        bio: '',
        createdAt: new Date().toISOString(),
        likedSongs: likedSongsRes.data.items,
        topSongs: topSongsRes.data.items,
        topArtists: topArtistsRes.data.items,
        liked_songs_isPrivate: false,
        top_songs_isPrivate: false,
        top_artists_isPrivate: false,
      });
      console.log('New user created:', spotifyUser.display_name);
    } else {
      // returning user — update profile picture and display name in case they changed
      await setDoc(userRef, {
        displayName: spotifyUser.display_name,
        profilePicture: spotifyUser.images?.[0]?.url || null,
      }, { merge: true });
      console.log('Returning user:', spotifyUser.display_name);
    }

<<<<<<< HEAD
=======
    try {
      await upsertSessionUser(userResponse.data);
    } catch (error) {
      console.warn('Unable to sync user profile to Firebase:', error.message);
    }

    // redirect to frontend
>>>>>>> 358f82a82b31e4f3cf33a4be7f84f4f9c1c6eb96
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
