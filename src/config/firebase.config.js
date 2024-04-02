import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyACayIcD_2RYC3RyXGdL5QGKmiKoYi153k",
  authDomain: "resume-builder-128d2.firebaseapp.com",
  projectId: "resume-builder-128d2",
  storageBucket: "resume-builder-128d2.appspot.com",
  messagingSenderId: "540338007503",
  appId: "1:540338007503:web:9f1aa3d6c46e649498b6ba",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

export { auth, db, storage };
