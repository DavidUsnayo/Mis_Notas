import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC26DoviaqidB3IZNbPCfInPH-S7IC9f2E",
    authDomain: "misnotas-1d2e2.firebaseapp.com",
    projectId: "misnotas-1d2e2",
    storageBucket: "misnotas-1d2e2.appspot.com",
    messagingSenderId: "1077337067797",
    appId: "1:1077337067797:web:3adf0b56477d28003ed91c",
    measurementId: "G-DFXWBEF33J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)