import { doc, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const addOrderDetails = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'order-details'), orderData);
    console.log('Order details added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding order details: ", error);
    throw new Error(error);
  }
};

