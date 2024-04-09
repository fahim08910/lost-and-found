/*import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

const fetchLostPosts = async (userName) => {
  const q = query(collection(db, "lost-post"), where("userName", "==", userName));
  const querySnapshot = await getDocs(q);
  const postsData = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    postTime: doc.data().postTime?.toDate?.() || new Date(doc.data().postTime),
  }));
  return postsData;
};

export default fetchLostPosts;
*/
import { db, storage } from '../firebase/config';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';




const fetchLostPosts = async (userName) => {
  const q = query(collection(db, "lost-post"), where("userName", "==", userName));
  const querySnapshot = await getDocs(q);
  const postsData = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    postTime: doc.data().postTime?.toDate?.() || new Date(doc.data().postTime),
  }));
  return postsData;
};
export const deletePost = async (postId) => {
    await deleteDoc(doc(db, "lost-post", postId));
  };
  // Add this function to your Firebase actions file

  export const updatePost = async (postId, updatedData, file) => {
    const postRef = doc(db, "lost-post", postId);
    if (file) {
      const storageRef = ref(storage, `lost-items/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      updatedData = { ...updatedData, pictures: [photoURL] }; // Assuming you want to store the image URL in the `pictures` field
    }
    await updateDoc(postRef, updatedData);
  };

export default fetchLostPosts;

