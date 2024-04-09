import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const addCard = async (cardData) => {
  try {
    const q = query(collection(db, "card-details"), where("Card Number", "==", cardData['Card Number']));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { success: false, id: null, message: 'A card with the same number already exists.' };
    }

    const docRef = await addDoc(collection(db, "card-details"), {
      Balance: cardData.Balance, 
      CVV: cardData.CVV,
      'Card Number': cardData['Card Number'], 
      Name: cardData.Name
    });
    console.log("Card added with ID: ", docRef.id);
    return { success: true, id: docRef.id, message: `Card added successfully with ID: ${docRef.id}` };
  } catch (error) {
    console.error("Error adding card: ", error);
    return { success: false, id: null, message: `Error adding card: ${error.message}` };
  }
};

