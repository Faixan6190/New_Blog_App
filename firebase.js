import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  getFirestore,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDe9AbtMJZ4E6556Vu0Z_YHMHx3iUcaZl8",
  authDomain: "blog-app-8eac6.firebaseapp.com",
  projectId: "blog-app-8eac6",
  storageBucket: "blog-app-8eac6.appspot.com",
  messagingSenderId: "202910868835",
  appId: "1:202910868835:web:c5b67d7756dd573438df56",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

// const db = getFirestore(app);

// console.log(app);
// console.log(auth);
// console.log(db);

export {
  getAuth,
  createUserWithEmailAndPassword,
  auth,
  signInWithEmailAndPassword,
  addDoc,
  collection,
  db,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  getStorage,
  ref,
  uploadBytesResumable,
  updateDoc,
  getDownloadURL,
  storage,
};
