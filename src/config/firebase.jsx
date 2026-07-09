import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6XMVozaXeCtUcbwmA4nM4fCWgzmBiE38",
  authDomain: "purchase-order-admin-e2096.firebaseapp.com",
  projectId: "purchase-order-admin-e2096",
  storageBucket: "purchase-order-admin-e2096.firebasestorage.app",
  messagingSenderId: "563311684602",
  appId: "1:563311684602:web:3eedca0656a183017a1243",
  measurementId: "G-EG3VW805ZX"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
