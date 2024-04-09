import { doc, updateDoc, query, where, getDocs, collection, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const updateProduct = async (productId, updateData) => {
  try {
    const productRef = doc(db, "products", productId);
    const docSnap = await getDoc(productRef);

    if (!docSnap.exists()) {
      return { success: false, message: 'Cannot find product with this ID.' };
    }

    const existingProductQuery = query(
      collection(db, "products"),
      where("name", "==", updateData.name) 
    );
    const querySnapshot = await getDocs(existingProductQuery);

    let isUpdatingCurrentProduct = false;
    querySnapshot.forEach((doc) => {
      if (doc.id === productId) isUpdatingCurrentProduct = true;
    });

    if (querySnapshot.size > 1 || (querySnapshot.size === 1 && !isUpdatingCurrentProduct)) {
      return { success: false, message: 'A product with the same name already exists.' }; 
    }

    await updateDoc(productRef, updateData);
    console.log("Product updated with ID: ", productId);
    return { success: true, message: 'Product updated successfully.' };
  } catch (error) {
    console.error("Error updating product: ", error);
    return { success: false, error: error.message };
  }
};

