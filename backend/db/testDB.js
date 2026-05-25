import db from '../firebase.js';
import { doc, collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// test - starting point (feel free to delete/replace)
export const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, "test"));
  return querySnapshot.docs.map(doc => ({'id': doc.id, ...doc.data()}));
}