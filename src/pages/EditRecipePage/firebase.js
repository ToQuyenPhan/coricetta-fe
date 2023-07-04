import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYCNp-UUKyeQ5EYjk3B34AQJSdvofRqoM",
  authDomain: "recipeorganizer-98c9b.firebaseapp.com",
  projectId: "recipeorganizer-98c9b",
  storageBucket: "recipeorganizer-98c9b.appspot.com",
  messagingSenderId: "464137363802",
  appId: "1:464137363802:web:3c72f6b5ad0158a74a9363"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);