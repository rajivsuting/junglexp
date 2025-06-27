import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCoqJ4kaGjpYPtn0QtGPWWZktYX4WiZDiI",
  authDomain: "ereoupers.firebaseapp.com",
  projectId: "ereoupers",
  storageBucket: "ereoupers.firebasestorage.app",
  messagingSenderId: "279566001415",
  appId: "1:279566001415:web:3f87abe71d9ed2397a51a2",
  measurementId: "G-XSXVF5BYCE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

export { storage };
