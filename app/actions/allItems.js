import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getAllItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    let items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, items };
  } catch (error) {
    console.error("Error getting documents: ", error);
    return { success: false, error: error.message };
  }
};
