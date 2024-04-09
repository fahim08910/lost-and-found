import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import getStorage


const firebaseConfig = {
    apiKey: "AIzaSyAn1D5aChBekzUxmOnWNmZbSeYigkfbibQ",
    authDomain: "hittastic-9d4a7.firebaseapp.com",
    projectId: "hittastic-9d4a7",
    storageBucket: "hittastic-9d4a7.appspot.com",
    messagingSenderId: "439183206483",
    appId: "1:439183206483:web:7181864d5ad6ef56b6fea6",
    measurementId: "G-2DSW753FK0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize storage

export { auth, db, storage }; // Export storage