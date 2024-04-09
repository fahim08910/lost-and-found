import { doc, updateDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getUserDetails = async (cardNumber, name, cvv) => {
  try {
    const q = query(collection(db, 'card-details'), where('Card Number', '==', cardNumber), where('Name', '==', name), where('CVV', '==', cvv));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userDetails = userDoc.data();
      return { id: userDoc.id, ...userDetails };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user details:', error);
    throw error;
  }
};

// update user balance
export const updateUserBalance = async (userId, newBalance) => {
  try {
    const userRef = doc(db, 'card-details', userId);
    await updateDoc(userRef, { Balance: newBalance });
  } catch (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
};

//get product details by name
export const getProductDetails = async (productName) => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('name', '==', productName));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting product details:', error);
    throw error;
  }
};