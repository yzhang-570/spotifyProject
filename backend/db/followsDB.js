import { doc, collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import db from '../firebase.js';

// Get all users followed by a user
const fetchUserFollowings = async (userID) => {
  // get list of following IDs
  const querySnapshot = await getDocs(query(collection(db, 'follows'), where("followerID", "==", userID)));
  const parsedSnapshot = querySnapshot.docs.map(doc => (doc.data().followedID));

  // todo: fix, get array of promises then; promise.all()
  // get list of profile data
  const followingsDataList = parsedSnapshot.reduce(async (dataList, followingID) => {
    const docSnapshot = await getDoc(doc(db, 'users', followingID));
    return [...dataList, {'id': docSnapshot.id, ...docSnapshot.data()}];
  }, []);

  return followingsDataList;
}


// Get all users following a user, get array of promises then; promise.all()
const fetchUserFollowers = async (userID) => {
  // get list of follower IDs
  const querySnapshot = await getDocs(query(collection(db, 'follows'), where("followedID", "==", userID)));
  const parsedSnapshot = querySnapshot.docs.map(doc => (doc.data().followerID));

  // get list of profile data
  const followersDataList = parsedSnapshot.reduce(async (dataList, followerID) => {
    const docSnapshot = await getDoc(doc(db, 'users', followerID));
    return [...dataList, {'id': docSnapshot.id, ...docSnapshot.data()}]
  }, []);

  return followersDataList;
}

// Get a follow document(s) given followerID and followedID
// Should return true/false
const fetchUserIsFollowing = async (followerID, followedID) => {
  const querySnapshot = await getDocs(query(collection(db, 'follows'), where("followerID", "==", followerID),
      where("followedID", "==", followedID)));
  const parsedSnapshot = querySnapshot.docs.map((doc) => ({'id': doc.id, ...doc.data()}))
  return parsedSnapshot.length > 0;
}

// Create a follow document
const createFollow = async (followerID, followedID) => {

  console.log('attempting to create following');

  console.log('prevent self follow');
  try {
    // prevent self-follows
    if (followerID === followedID) return;

    console.log('checking valid userID');
    // check valid userIDs
    const userQuerySnapshot = await getDocs(collection(db, 'users'));
    const followerIDExists = userQuerySnapshot.docs.some(doc => (doc.id === followerID));
    const followedIDExists = userQuerySnapshot.docs.some(doc => (doc.id === followedID));
    if (!followerIDExists || !followedIDExists) return;

    console.log('prevent duplicates');
    // prevent duplicates
    const followExists = await fetchUserIsFollowing(followerID, followedID);

    console.log('checking duplicate match list length');
    if (followExists) return;

    console.log('attempt post');
    await addDoc(collection(db, 'follows'), {'followerID': followerID, 'followedID': followedID});
    console.log('success');
    return;
  }
  catch (error) {
    console.log(`Error: ${error}`);
  }
  // if time: auth check -> follow must come from current user
}



// Delete a follow document where the user is the follower
const deleteFollow = async (followerID, followedID) => {
  console.log('attempting to delete')
  const followExists = await fetchUserIsFollowing(followerID, followedID);

  console.log('checking delete exists')
  if (!followExists) return;

  console.log('deleting')
  // Find (the) document that corresponds
  const querySnapshot = await getDocs(query(collection(db, 'follows'), 
    where("followerID", "==", followerID), where("followedID", "==", followedID)));
  await Promises.all(querySnapshot.docs.map(doc => deleteDoc(doc.ref)));
    // querySnapshot.forEach(async (doc) => {await deleteDoc(doc.ref)});
    // await doesn't work with async

  console.log('delete success');
}

export { fetchUserFollowings, fetchUserFollowers, createFollow, deleteFollow, fetchUserIsFollowing };