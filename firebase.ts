import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = {
	apiKey: "AIzaSyBhN-yQz6Z9qJVtRXMaq_eQbjwoTSQI-bQ",
	authDomain: "firbaseauth-prisma.firebaseapp.com",
	projectId: "firbaseauth-prisma",
	storageBucket: "firbaseauth-prisma.firebasestorage.app",
	messagingSenderId: "909187593366",
	appId: "1:909187593366:web:439198a226d5b7e28b3eb7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
