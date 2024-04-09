// actions/savePost.js
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

// Function to fetch saved posts for the current user
export const fetchSavedPosts = async () => {
  const userName = localStorage.getItem('userName');
  if (!userName) {
    console.error('User not found. Please log in.');
    return [];
  }

  const userLikesRef = doc(db, "savePosts", userName);
  const docSnap = await getDoc(userLikesRef);

  if (docSnap.exists() && docSnap.data().likedPosts) {
    return docSnap.data().likedPosts; // Return the array of saved posts
  } else {
    return []; // Return an empty array if there are no saved posts or if the document doesn't exist
  }
};
