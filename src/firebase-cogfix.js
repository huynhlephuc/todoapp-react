// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHj5ek6Ztdvscknv-Ejlf0irdsNcCj3fY",
  authDomain: "todoapp-39795.firebaseapp.com",
  projectId: "todoapp-39795",
  storageBucket: "todoapp-39795.appspot.com",
  messagingSenderId: "106297840352",
  appId: "1:106297840352:web:dd4e3c7cd7b1d1af843685",
  measurementId: "G-QYV9KQKY7V"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
