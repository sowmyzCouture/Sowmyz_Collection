// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBm9HVz5g3bdPt3jpTJ8zUFqJ5m0LmB8AA",
  authDomain: "sowmyz-products.firebaseapp.com",
  projectId: "sowmyz-products",
  storageBucket: "sowmyz-products.appspot.com",
  messagingSenderId: "305434133405",
  appId: "1:305434133405:web:829d6220fa0534f4542574"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);