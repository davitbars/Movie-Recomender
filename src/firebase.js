import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDy4Af9vscspHnf-J5qhs1j82LX6ziAstI",
  authDomain: "moviesite-55fb2.firebaseapp.com",
  projectId: "moviesite-55fb2",
  storageBucket: "moviesite-55fb2.appspot.com",
  messagingSenderId: "846790583626",
  appId: "1:846790583626:web:3acb935949689adbe8cdb3",
  measurementId: "G-6K36DM0TMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  storage,
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
};