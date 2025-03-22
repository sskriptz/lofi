// firebase-config.js - Firebase configuration and initialization

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwUAqTV07AahyfD55owmyAcxDG3TP_KnI",
    authDomain: "lofi-168cb.firebaseapp.com",
    projectId: "lofi-168cb",
    storageBucket: "lofi-168cb.firebasestorage.app",
    messagingSenderId: "331670095312",
    appId: "1:331670095312:web:7538041673a10b1b4aa5d5"
};

// Firebase instance variables
let auth;
let db;

// Initialize Firebase
function initFirebase() {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    return { auth, db };
}

// Get Firebase auth instance
function getAuth() {
    return auth;
}

// Get Firestore instance
function getFirestore() {
    return db;
}

export { initFirebase, getAuth, getFirestore };
