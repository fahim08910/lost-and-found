import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc, getDocs, query, collection, where } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Function to check if a userId is unique in the Firestore database
// Function to check if a userName is unique in the Firestore database
export const checkUserNameUnique = async (userName) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('userName', '==', userName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty; // Returns true if no matching documents found, indicating userName is unique
};


// Function to sign up a new user with Firebase Authentication and Firestore
export const signUp = async (name, email, password, phoneNumber, userName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      phoneNumber,
      userName, 
      role: 'regular',
      login: false,
      verified: false
    });
/*
export const signUp = async (name, email, password, phoneNumber, userName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Configuring email verification to redirect users after they verify
    const actionCodeSettings = {
      url: 'http://localhost:3000/solent/login', // Adjust as needed for your app
      handleCodeInApp: false, // User verifies email in the same device
    };

    // Send an email verification to the new user
    await sendEmailVerification(user, actionCodeSettings);

    // Create a new document in Firestore for the user
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      phoneNumber,
      userName, // Using userName instead of userId
      role: 'regular',
      login: false,
      verified: false // Initially false, will be updated upon email verification
    });
    */
    return { user, error: null, message: "Verification email sent. Please check your email to verify your account." };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { user: null, error: error.message };
  }
};






/*

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const signUp = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: 'regular',
      login: false
    });

    return { user, error: null };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { user: null, error: error.message };
  }
};

*/