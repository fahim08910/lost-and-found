import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getOrderHistoryByEmail = async (email) => {
  const orderHistory = [];
  const q = query(collection(db, 'order-details'), where('email', '==', email));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    orderHistory.push({ id: doc.id, ...doc.data() });
  });

  return orderHistory;
};

