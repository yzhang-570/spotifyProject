import db from '../firebase.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const getInitials = (value) => {
  if (!value) return 'U';

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

export const normalizeUserProfile = (id, data = {}) => {
  const displayName =
    data.displayName ||
    data.display_name ||
    data.name ||
    data.username ||
    data.email ||
    id;
  const username = data.username || data.spotifyId || id;

  return {
    id,
    name: displayName,
    username,
    email: data.email || '',
    bio: data.bio || data.status || '',
    initials: data.initials || getInitials(displayName || username),
    isPrivate: Boolean(data.isPrivate),
    profilePicture: data.profile_img || data.profileImageURL || '',
  };
};

// update user profile (insert/create if not exists)
  // updates user document with (ONLY) **information from Spotify
export const upsertSessionUser = async (spotifyUser) => {

  // console.log('inside upsertSessionUser');

  if (!spotifyUser?.id) {
    return null;
  }

  const userRef = doc(db, 'users', spotifyUser.id);
  const profileImage = spotifyUser.images?.[0]?.url || '';

  // setDoc vs. updateDoc
  // setDoc - if doc trying to update doesn't exist, create it
  // updateDoc - if doc trying to update doesn't exist, error
  await setDoc(
    userRef,
    {
      // username: spotifyUser.id,   // no username in schema!! bruh
      spotifyId: spotifyUser.account_id,
      displayName: spotifyUser.display_name || spotifyUser.id,
      email: spotifyUser.email || '',
      // bio: '',                   // don't override user's account personal preferences
      // isPrivate: false,             when updating spotify information...
      // likes_isPrivate: false,
      // top_songs_isPrivate: false,
      // top_artists_isPrivate: false,
      profile_img: spotifyUser.profileImage || '',
      country: spotifyUser.country || '',
      spotifyLink: spotifyUser.external_urls.spotify || '',
      updated_time: serverTimestamp(),
    },
    { merge: true }
  );

  const normalizedProfile = normalizeUserProfile(spotifyUser.id, {
    username: spotifyUser.id,
    displayName: spotifyUser.display_name,
    email: spotifyUser.email,
    profile_img: profileImage,
  });
  // console.log('normalized user profile', normalizedProfile);
  return normalizedProfile;
};





export const getUserProfile = async (userId) => {
  if (!userId) {
    return normalizeUserProfile('unknown', {});
  }

  const userSnap = await getDoc(doc(db, 'users', userId));

  if (!userSnap.exists()) {
    return normalizeUserProfile(userId, { username: userId });
  }

  return normalizeUserProfile(userSnap.id, userSnap.data());
};

export const getPublicUsers = async (excludeUserId) => {
  const usersSnap = await getDocs(collection(db, 'users'));

  return usersSnap.docs
    .map((userDoc) => normalizeUserProfile(userDoc.id, userDoc.data()))
    .filter((user) => user.id !== excludeUserId && !user.isPrivate);
};
