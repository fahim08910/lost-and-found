import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const searchItems = async ({ type, manufacturer }) => {
  try {
    const itemsRef = collection(db, "products");
    let conditions = [];
    
    if (type) conditions.push(where("type", "==", type));
    if (manufacturer) conditions.push(where("manufacturer", "==", manufacturer));

    const q = query(itemsRef, ...conditions);
    const querySnapshot = await getDocs(q);
    let items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return { 
      success: items.length > 0,
      error: items.length === 0 ? `No products found${type ? ` of type '${type}'` : ''}${manufacturer ? ` from manufacturer '${manufacturer}'` : ''}` : null,
      items 
    };
  } catch (error) {
    console.error("Error searching items: ", error);
    return { success: false, error: error.message, items: [] };
  }
};
