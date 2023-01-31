import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  child,
  push,
  onValue,
  serverTimestamp,
} from "firebase/database";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signOut,
} from "firebase/auth";

const app = initializeApp({
  // apiKey: "AIzaSyDIXs3VFeMXb-VnFCKb_X1daCPv3rbHPCU",
  // authDomain: "chat-6a952.firebaseapp.com",
  // databaseURL: "https://chat-6a952-default-rtdb.firebaseio.com",
  // projectId: "chat-6a952",
  // storageBucket: "chat-6a952.appspot.com",
  // messagingSenderId: "213193185620",
  // appId: "1:213193185620:web:1708dd3cb5f6edcccf10c1",

  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
});

const db = getDatabase(app);
const auth = getAuth(app);

export {
  ref,
  set,
  onValue,
  db,
  app,
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  serverTimestamp,
  child,
  push,
};
