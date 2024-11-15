import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAZk7jN1eCAH97mNCAkyxTBgDPsa7l3gtc",
    authDomain: "museo-app-48abe.firebaseapp.com",
    projectId: "museo-app-48abe",
    storageBucket: "museo-app-48abe.firebasestorage.app",
    messagingSenderId: "636316145477",
    appId: "1:636316145477:web:f183d1a0d44e765d9b102c",
    measurementId: "G-G06M6TZYCN"
  };

  //Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore (app);
const auth = getAuth (app);

export { db, auth, analytics};