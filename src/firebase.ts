import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, EmailAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAx0NGzjtOGpVFZZTRLmgxYShF44HEX52Q",
  authDomain: "tendenciard-1.firebaseapp.com",
  projectId: "tendenciard-1",
  storageBucket: "tendenciard-1.firebasestorage.app",
  messagingSenderId: "321115519680",
  appId: "1:321115519680:web:89217a631268a842140b25",
  measurementId: "G-XS8S1P2KRQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Set persistence to local
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});
