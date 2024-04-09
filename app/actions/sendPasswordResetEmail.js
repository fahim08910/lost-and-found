import { auth } from '../firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const sendPasswordReset = async (email) => {
  try {
    // Query the Firestore database to check if the email exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No user found with the provided email
      return { message: "We could not find any account with this email. Please sign up." };
    } else {
      // User found, send password reset email
      await sendPasswordResetEmail(auth, email);
      return { message: "Password reset email sent. Please check your inbox." };
    }
  } catch (error) {
    return { message: error.message };
  }
};

export default sendPasswordReset;
