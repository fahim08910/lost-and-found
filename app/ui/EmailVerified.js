"use client" 
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, db } from '../firebase/config';

const EmailVerified = () => {
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    // This function must be called in a useEffect or another client-side only context
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, { verified: true });
          setStatus('Your email has been verified successfully!');
        } else {
          setStatus('Failed to verify email. Please try verifying again.');
        }
      } else {
        setStatus('You must be logged in to verify your email.');
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return (
    <div>
      <h2>Email Verification Status</h2>
      <p>{status}</p>
    </div>
  );
};

export default EmailVerified;
