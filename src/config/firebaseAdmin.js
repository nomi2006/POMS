import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Same Firebase config as main app
const firebaseConfig = {
  apiKey: "AIzaSyA6XMVozaXeCtUcbwmA4nM4fCWgzmBiE38",
  authDomain: "purchase-order-admin-e2096.firebaseapp.com",
  projectId: "purchase-order-admin-e2096",
  storageBucket: "purchase-order-admin-e2096.firebasestorage.app",
  messagingSenderId: "563311684602",
  appId: "1:563311684602:web:3eedca0656a183017a1243"
};

// ✅ Secondary app with unique name "adminApp"
const adminApp = initializeApp(firebaseConfig, "adminApp");

// ✅ Export auth from secondary app
export const adminAuth = getAuth(adminApp);