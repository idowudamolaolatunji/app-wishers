// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// AUTH
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

// DB
export const firestore = getFirestore(app);

// error handling

export const handleFirebaseError = (error: any) => {
  const { code, message } = error;
  let errorMessage = 'An unknown error occurred';

  if (code === 'auth/network-request-failed') {
    errorMessage = 'Network error. Please check your internet connection';
  } else if (code === 'firestore/firestore-not-initialized') {
    errorMessage = 'Firebase not connected. Please try again later';
  } else if (message.includes('Network error')) {
    errorMessage = 'Network error. Please check your internet connection';
  }

  // Alert.alert('Error', errorMessage);
  return errorMessage;
};
