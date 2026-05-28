import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'; 
import db from '../firebase.js';

export const fetchPostById = async (postId) => {
  // Fetches the main forum post using postID
  const mainPostRef = doc(db, 'posts', postId);
  const mainPostSnap = await getDoc(mainPostRef);
  
  if (!mainPostSnap.exists()) {
    throw new Error("Post not found");
  }
  const mainPost = { id: mainPostSnap.id, ...mainPostSnap.data() };

  // Fetch all comments and replies under the main forum post
  const q = query(collection(db, 'posts'), where('forum', '==', postId));
  const querySnapshot = await getDocs(q);
  
  const comments = querySnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  // Return both
  return { mainPost, comments };
};
