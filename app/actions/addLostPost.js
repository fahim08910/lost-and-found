import {
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  runTransaction,
  orderBy, 
  limit 
} from 'firebase/firestore';
import { storage } from '../firebase/config'; // Import storage
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase/config';

export const addLostPost = async (postData, pictures) => {
  try {
    const uploadedPictureURLs = await Promise.all(
      pictures.map(async (picture) => {
        const pictureRef = ref(storage, `lost-posts/${postData.itemName}/${picture.name}`);
        await uploadBytes(pictureRef, picture);
        return getDownloadURL(pictureRef);
      })
    );

    await runTransaction(db, async (transaction) => {
      const postsRef = collection(db, "lost-post");
      const querySnapshot = await getDocs(query(postsRef, orderBy('postNumber', 'desc'), limit(1)));
      
      let nextPostNumber = 1;
      if (!querySnapshot.empty) {
        const lastPost = querySnapshot.docs[0].data();
        nextPostNumber = lastPost.postNumber + 1;
      }

      const q = query(postsRef, where("itemName", "==", postData.itemName));
      const duplicateSnapshot = await getDocs(q);
      if (!duplicateSnapshot.empty) {
        throw new Error('A post with the same item name already exists.');
      }

      await addDoc(postsRef, {
        ...postData,
        pictures: uploadedPictureURLs, // Add pictures' URLs
        postNumber: nextPostNumber,
        postTime: serverTimestamp()
      });
    });

    return { success: true, message: 'Post added successfully.' };
  } catch (error) {
    console.error("Error adding lost post: ", error);
    return { success: false, message: `Error adding post: ${error.message}` };
  }
};

