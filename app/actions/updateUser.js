import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const updateUser = async (userId, updateData) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      return { success: false, message: 'Cannot find user with this ID.' };
    }

    await updateDoc(userRef, updateData);
    console.log("User updated with ID: ", userId);
    return { success: true, message: 'User updated successfully.' };
  } catch (error) {
    console.error("Error updating user: ", error);
    return { success: false, message: error.message };
  }
};
