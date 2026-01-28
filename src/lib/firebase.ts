import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDr_U37BAgxBEljIWxlEz5xv-sbkh8oIT8",
  authDomain: "gift-finder-3db49.firebaseapp.com",
  projectId: "gift-finder-3db49",
  storageBucket: "gift-finder-3db49.firebasestorage.app",
  messagingSenderId: "655597752905",
  appId: "1:655597752905:web:b44f16053ed44af6ac2598"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
