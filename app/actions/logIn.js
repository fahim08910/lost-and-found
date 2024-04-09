import { auth, db } from '../firebase/config'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const logIn = async (formData) => {
  const { email, password } = formData;
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        login: true
      });
      const userData = userDoc.data(); // Extract the user's data from the document
      const role = userData.role;
      let message;

      // Check role and prepare message accordingly
      if (role === 'admin') {
        message = "Logged in as an admin.";
      } else if (role === 'regular') {
        message = "Logged in as a regular user.";
      } else {
        message = "Role not recognized.";
      }

      // Extract userName from the user's data
      const userName = userData.userName; // Assuming the userName is stored in this field

      // Store user information in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUserEmail', user.email);
      localStorage.setItem('userRole', role);
      localStorage.setItem('loginMessage', message);

      // Check if userName exists and store it
      if (userName) {
        localStorage.setItem('userName', userName);
      } else {
        console.error("UserName not found in user's document");
      }

      return { status: "LoggedIn", user: user.email, role, message };
    } else {
      return { status: "NoRole", message: "User does not have a role assigned." };
    }
  } catch (error) {
    console.error("Login failed:", error);
    return { status: "Invalid Credentials", message: error.message };
  }
}

export default logIn;
