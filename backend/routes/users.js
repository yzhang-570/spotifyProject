import express from 'express';
import db from '../firebase.js';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json('Not logged in');
  }
  next();
};

// get all public users (for Discover page)
router.get('/', async (req, res) => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnap = await getDocs(usersRef);

    const users = [];
    usersSnap.forEach((doc) => {
      const data = doc.data();
      if (!data.isPrivate) {
        users.push(data);
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json(`Error fetching users: ${error}`);
  }
});

// update user profile
router.put('/update', requireAuth, async (req, res) => {
  const { bio, isPrivate, liked_songs_isPrivate, top_songs_isPrivate, top_artists_isPrivate } = req.body;

  try {
    const userRef = doc(db, 'users', req.session.user.id);
    await updateDoc(userRef, {
      ...(bio !== undefined && { bio }),
      ...(isPrivate !== undefined && { isPrivate }),
      ...(liked_songs_isPrivate !== undefined && { liked_songs_isPrivate }),
      ...(top_songs_isPrivate !== undefined && { top_songs_isPrivate }),
      ...(top_artists_isPrivate !== undefined && { top_artists_isPrivate }),
    });

    res.json('Profile updated successfully');
  } catch (error) {
    res.status(500).json(`Error updating profile: ${error}`);
  }
});

// get a user by ID
router.get('/:id', async (req, res) => {
  try {
    const userRef = doc(db, 'users', req.params.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return res.status(404).json('User not found');
    }

    res.json(userSnap.data());
  } catch (error) {
    res.status(500).json(`Error fetching user: ${error}`);
  }
});

export default router;