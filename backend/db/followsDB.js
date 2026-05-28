import { doc, collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import db from '../firebase.js';

// Get all users followed by a user
const fetchUserFollowings = async (userID) => {
  // get list of following IDs
  const querySnapshot = await getDocs(query(collection(db, 'follows')), where("followerID", "==", userID));
  const parsedSnapshot = querySnapshot.docs.map(doc => (doc.id));

  // get list of profile data
  const followingsDataList = parsedSnapshot.reduce((dataList, followingID) => {
    const docSnapshot = await getDoc(doc(db, 'users', followingID));
    return [...dataList, {'id': docSnapshot.id, ...docSnapshot.data()}];
  });

  return followingsDataList;
}


// Get all users following a user
const fetchUserFollowers = async (userID) => {
  // get list of follower IDs
  const querySnapshot = await getDocs(query(collection(db, 'follows')), where("followedID", "==", userID));
  const parsedSnapshot = querySnapshot.docs.map(doc => (doc.id))

  // get list of profile data
  const followersDataList = parsedSnapshot.reduce((dataList, followerID) => {
    const docSnapshot = await getDoc(doc(db, 'users', followerID));
    return [...dataList, {'id': docSnapshot.id, ...docSnapshot.data()}]
  });

  return followersDataList;
}


// Create a follow document
const createFollow = async (followerID, followedID) => {
  const findFollow = fetchUser

  // prevent self-follows
  if (followerID === followedID) return;

  // check valid userIDs
  const querySnapshot = await getDocs(collection(db, 'users'));
  const followerIDExists = querySnapshot.some(doc => (doc.id === followerID));
  const followedIDExists = querySnapshot.some(doc => (doc.id === followedID));
  if (!followerIDExists || !followedIDExists) return;

  // prevent duplicates
  const docSnapshot = await getDoc(doc(db, 'follows'), where("followerID", "===", followerID),
    where("followedID", "===", followedID));
  if (docSnapshot.exists()) return;

  await addDoc(collection(db, 'follows'), {'followerID': followerID, 'followedID': followedID});
  // if time: auth check -> follow must come from current user
}



// Delete a follow document where the user is the follower
const deleteFollow = async (followerID, followedID) => {
  const docSnapshot = await getDoc(doc(db, 'follows', userID));
  if (!docSnapshot.exists()) return;

  // Find (the) document that corresponds
  const querySnapshot = await getDocs(query(collection(db, 'follows')), 
    where("followerID", "==", followerID), where("followedID", "==", followedID));
  querySnapshot.forEach(doc => {await deleteDoc(doc.ref)});
}

export { fetchUserFollowings, fetchUserFollowers, createFollow, deleteFollow };