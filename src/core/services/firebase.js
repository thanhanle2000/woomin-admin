import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLKAaOjlDVmZlvuX-i5YBuY3x6XF16zXo",
  authDomain: "dragon-service-2e8bf.firebaseapp.com",
  projectId: "dragon-service-2e8bf",
  storageBucket: "dragon-service-2e8bf.appspot.com",
  messagingSenderId: "71554897483",
  appId: "1:71554897483:web:fddd804461015e203f9fce",
  measurementId: "G-J1RPQ2VQ6M",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
