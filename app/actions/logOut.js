import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const logOut = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);

      await updateDoc(userDocRef, {
        login: false
      });

      await signOut(auth);
      console.log("Logged out successfully");
    } else {
      console.error("No user to log out");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export default logOut;
