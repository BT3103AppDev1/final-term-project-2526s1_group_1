// src/firebase/config.js

// Import necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMavx28eROymEVTebeI5hJZrH2kJtcuGo",
  authDomain: "bt3103-5e62c.firebaseapp.com",
  projectId: "bt3103-5e62c",
  storageBucket: "bt3103-5e62c.appspot.com",
  messagingSenderId: "862329562806",
  appId: "1:862329562806:web:d47788b48dfde3fcec6817",
  measurementId: "G-3EHP78SN07"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
