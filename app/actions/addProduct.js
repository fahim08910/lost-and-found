import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const addProduct = async (productData) => {
  try {
    const q = query(collection(db, "products"), where("name", "==", productData.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { success: false, id: null, message: 'A product with the same name already exists.' };
    }

    const docRef = await addDoc(collection(db, "products"), productData);
    console.log("Product added with ID: ", docRef.id);
    return { success: true, id: docRef.id, message: `Product added successfully with ID: ${docRef.id}` };
  } catch (error) {
    console.error("Error adding product: ", error);
    return { success: false, id: null, message: `Error adding product: ${error.message}` };
  }
};

