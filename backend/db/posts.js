import { addDoc, collection, doc, getDocs, getDoc, query, orderBy, serverTimestamp, updateDoc, increment } from 'firebase/firestore'; 
import db from '../firebase.js'; 
import { getUserProfile } from './users.js';

const serializeTimestamp = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (value.toDate) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return null;
};

//Fetch all main posts for the discover page
export const fetchAllPosts = async (currentUserId) => {
  const postsRef = collection(db, 'posts');

  const querySnapshot = await getDocs(postsRef);

  return Promise.all(
    querySnapshot.docs.map(async (document) => {
      const data = document.data();

      const authorProfile = await getUserProfile(data.author);
      const votes = data.votes || {};

      return {
        id: document.id,
        ...data,
        author: authorProfile,
        created_time: serializeTimestamp(data.created_time),
        recent_time: serializeTimestamp(data.recent_time),
        userVote: currentUserId ? (votes[currentUserId] || null) : null,
      };
    })
  );
};

// Fetch a single post and its nested replies subcollection
export const fetchPostById = async (postId) => {
  // Fetch the main forum post
  const mainPostRef = doc(db, 'posts', postId);
  const mainPostSnap = await getDoc(mainPostRef);
  
  if (!mainPostSnap.exists()) {
    throw new Error("Post not found");
  }

  const mainPostData = mainPostSnap.data();
  const authorProfile = await getUserProfile(mainPostData.author);

  const mainPost = {
    id: mainPostSnap.id,
    ...mainPostData,
    author: authorProfile,
    created_time: serializeTimestamp(mainPostData.created_time),
    recent_time: serializeTimestamp(mainPostData.recent_time),
  };
    
  // Fetch all nested documents inside the 'replies' subcollection
  const repliesRef = collection(db, 'posts', postId, 'replies');
  const querySnapshot = await getDocs(repliesRef);
  
  const replies = await Promise.all(
    querySnapshot.docs.map(async (document) => {
      const data = document.data();

      const authorProfile = await getUserProfile(data.author);

      return {
        id: document.id,
        ...data,
        author: authorProfile,
        created_time: serializeTimestamp(data.created_time),
      };
    })
  );
  
  return { mainPost, replies }; 
};

export const createMainPost = async ({ author, title, content }) => {
  const postRef = await addDoc(collection(db, 'posts'), {
    author,
    title,
    content,
    votes: {
      [author]: 1, // auto-upvote by creator
    },
    likes: 1,
    replies: 0,
    depth: 0,
    created_time: serverTimestamp(),
    recent_time: serverTimestamp(),
  });

  const postSnap = await getDoc(postRef);
  const data = postSnap.data();
  const authorProfile = await getUserProfile(author);

  return {
    id: postSnap.id,
    ...data,
    author: authorProfile,
    created_time: serializeTimestamp(data.created_time),
    recent_time: serializeTimestamp(data.recent_time),
    userVote: 1,
  };
};

export const voteOnPost = async (postId, userId, newVote) => {
  const postRef = doc(db, "posts", postId);
  const snap = await getDoc(postRef);

  if (!snap.exists()) throw new Error("Post not found");

  const post = snap.data();
  const votes = post.votes || {};

  const previousVote = votes[userId] || 0;

  // If clicking same vote → remove vote
  const finalVote = previousVote === newVote ? 0 : newVote;

  // update votes map
  const updatedVotes = { ...votes };

  if (finalVote === 0) {
    delete updatedVotes[userId];
  } else {
    updatedVotes[userId] = finalVote;
  }

  // compute final likes total
  const delta = finalVote - previousVote;

  await updateDoc(postRef, {
    votes: updatedVotes,
    likes: (post.likes || 0) + delta,
  });

  const updatedSnap = await getDoc(postRef);

  return { id: updatedSnap.id, ...updatedSnap.data() };
};