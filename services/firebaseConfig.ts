// Import the functions you need from the SDKs you need
import 'dotenv/config';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "rescue-app-6f6e4.firebaseapp.com",
    projectId: "rescue-app-6f6e4",
    storageBucket: "rescue-app-6f6e4.appspot.com", //firebasestorage.app
    messagingSenderId: "992924613336",
    appId: "1:992924613336:web:a20041d90680e7d1f575ad"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});