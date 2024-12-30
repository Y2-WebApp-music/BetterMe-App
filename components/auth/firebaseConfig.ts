// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWpLmvXhaLQZh-GXhzKc_XW5gwFbHNr84",
  authDomain: "betterme-e89d6.firebaseapp.com",
  projectId: "betterme-e89d6",
  storageBucket: "betterme-e89d6.firebasestorage.app",
  messagingSenderId: "733097710375",
  appId: "1:733097710375:web:8876fff4159a65aaab8f02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// IOS : 778013634712-m9v4d2rs7m3luiudnmmj3jm1al010dis.apps.googleusercontent.com
// Android : 778013634712-4k20lcufl7v1j7foachjq6fhqk9hva1o.apps.googleusercontent.com

