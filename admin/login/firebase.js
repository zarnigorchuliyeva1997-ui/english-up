
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBRwENbRtLdi8V8gLjghZgwJcp6h3KGLf4",
  authDomain: "english-up-a52ef.firebaseapp.com",
  projectId: "english-up-a52ef",
  storageBucket: "english-up-a52ef.firebasestorage.app",
  messagingSenderId: "945062834319",
  appId: "1:945062834319:web:1e39704f0239268a1680fa",
  measurementId: "G-T238SFR1SW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const authPersistence = setPersistence(
  auth,
  browserLocalPersistence
);
