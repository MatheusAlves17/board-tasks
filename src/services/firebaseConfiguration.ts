import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD9EI4FAQ9msxH_MB9qHM0rvelIzoYNIuU",
    authDomain: "board-tasks.firebaseapp.com",
    projectId: "board-tasks",
    storageBucket: "board-tasks.appspot.com",
    messagingSenderId: "425914603283",
    appId: "1:425914603283:web:98e792c8c72c554db62ce6"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };