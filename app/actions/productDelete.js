import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const deleteProduct = async (productId) => {
  const docRef = doc(db, "products", productId);
  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Product not found with ID: ", productId);
      return { success: false, error: "Product not found" };
    }

    await deleteDoc(docRef);
    console.log("Product deleted with ID: ", productId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting product: ", error);
    return { success: false, error: error.message };
  }
};

