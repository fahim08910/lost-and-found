import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const searchItems = async ({ name, type, manufacturer }) => {
  try {
    const itemsRef = collection(db, "products");
    let conditions = [];
    
    if (name) conditions.push(where("name", "==", name)); 
    if (type) conditions.push(where("type", "==", type));
    if (manufacturer) conditions.push(where("manufacturer", "==", manufacturer));

    if (!name && !type && !manufacturer) {
      return { success: false, error: "Please select at least one search criterion." };
    }

    const q = query(itemsRef, ...conditions);
    
    const querySnapshot = await getDocs(q);
    let items = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });

    if (items.length === 0) {
      let errorMessage = "Does not find any product";
      if (name) errorMessage += ` with name '${name}'`;
      if (type) errorMessage += (name ? " and" : "") + ` type '${type}'`;
      if (manufacturer) errorMessage += (name || type ? " and" : "") + ` manufacturer '${manufacturer}'`;

      return { success: false, error: errorMessage, items: [] }; 
    }

    return { success: true, items };
  } catch (error) {
    console.error("Error searching items: ", error);
    return { success: false, error: error.message, items: [] }; 
  }
};
