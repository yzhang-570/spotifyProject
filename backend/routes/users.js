import express from 'express';
import db from '../firebase.js';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

import { fetchUserFollowings, fetchUserFollowers, createFollow, deleteFollow, fetchUserIsFollowing } from '../db/followsDB.js'

const router = express.Router();

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json('Not logged in');
  }
  next();
};

// get all users (for Discover page)
router.get('/', async (req, res) => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnap = await getDocs(usersRef);

    const users = [];
    usersSnap.forEach((doc) => {
      const data = doc.data();
      users.push({ id: doc.id, ...data });
    });

    res.json(users);
  } catch (error) {
    res.status(500).json(`Error fetching users: ${error}`);
  }
});

// update user profile
router.put('/update', requireAuth, async (req, res) => {
  const { displayName, bio, isPrivate, liked_songs_isPrivate, top_songs_isPrivate, top_artists_isPrivate } = req.body;

  try {
    const userRef = doc(db, 'users', req.session.user.id);
    await updateDoc(userRef, {
      'displayName': displayName,
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
router.get('/:userID', async (req, res) => {
  try {
    const userRef = doc(db, 'users', req.params.userID);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return res.status(404).json('User not found');
    }

    res.json(userSnap.data());
  } catch (error) {
    res.status(500).json(`Error fetching user: ${error}`);
  }
});


/*Follows------------------- */

// fetchUserFollowings, fetchUserFollowers, createFollow, deleteFollow

// Get followers for a user
router.get('/:userID/followers', async (req, res) => {
  const { userID } = req.params;
  try {
    const followerData = await fetchUserFollowers(userID);
    res.status(200).json(followerData);
  } catch (error) {
    res.status(500).json(`Error fetching followers: ${error}`);
  }
});

// Get following for a user
router.get('/:userID/following', async (req, res) => {
  const { userID } = req.params;
  try {
    const followingData = await fetchUserFollowings(userID);
    res.status(200).json(followingData);
  } catch (error) {
    res.status(500).json(`Error fetching following: ${error}`);
  }
});

// Get following status for a user and target user
router.get('/:userID/following/:targetUserID', async (req, res) => {
  const { userID, targetUserID } = req.params;
  try {
    const isFollowing = await fetchUserIsFollowing(userID, targetUserID);
    res.status(200).json({'isFollowing': isFollowing});
  } catch (error) {
    res.status(500).json(`Error checking follow status: ${error}`);
  }
})

// Create a follow
router.post('/:userID/following/:targetUserID', async (req, res) => {
  const { userID, targetUserID } = req.params;
  try {
    await createFollow(userID, targetUserID);
    res.status(201);
  }
  catch (error) {
    res.status(500).json(`Error creating follow: ${error}`);
  }
});

// Delete a follow
router.delete('/:userID/following/:targetUserID', async (req, res) => {
  const { userID, targetUserID } = req.params;
  try {
    await deleteFollow(userID, targetUserID);
    res.status(204);
  }
  catch (error) {
    res.status(500).json(`Error deleting follower: ${error}`);
  }
});

export default router;