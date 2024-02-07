import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
console.log(import.meta.env)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_Auth_Domain,
  projectId: import.meta.env.VITE_ProjectId,
  databaseURL:import.meta.env.VITE_DatabaseURL,
  storageBucket: import.meta.env.VITE_Storage_Bucket,
  messagingSenderId:import.meta.env.VITE_Messaging_Sender_Id,
  appId: import.meta.env.VITE_App_Id
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app)
const auth = getAuth(app)
const storage = getStorage(app)
export {db,auth,storage}