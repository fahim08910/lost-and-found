import { doc, updateDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

export const updateProductQuantity = async (productName, quantityToSubtract) => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('name', '==', productName));
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const productDoc = querySnapshot.docs[0];
      const productData = productDoc.data();
      const newQuantity = productData.quantity - quantityToSubtract;
      if (newQuantity >= 0) {
        await updateDoc(productDoc.ref, { quantity: newQuantity });
        return true;
      } else {
        console.error(`Not enough stock for ${productName}. Only ${productData.quantity} left.`);
        return false;
      }
    } else {
      console.error(`Product with name ${productName} does not exist.`);
      return false;
    }
  } catch (error) {
    console.error('Error updating product quantity:', error);
    throw error;
  }
};
