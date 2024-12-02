// firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyDor2wZktgKXhyQR7p33-w6taEBs4Fc9rM",
  authDomain: "maon-expo-rn-login.firebaseapp.com",
  projectId: "maon-expo-rn-login",
  storageBucket: "maon-expo-rn-login.firebasestorage.app",
  messagingSenderId: "1067746671857",
  appId: "1:1067746671857:web:eea7a704ca48598d59fd50"
};

// Firebase 앱 초기화 (이미 초기화된 경우 가져오기)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth 초기화 (이미 초기화된 경우 가져오기)
const auth = getAuth(app) || initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };