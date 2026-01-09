// ===========================
// FIREBASE CONFIGURATION
// ===========================

// ✅ Firebase Configuration - Updated from Firebase Console
// Project: photoup-9bbd5

const firebaseConfig = {
    apiKey: "AIzaSyDanRdYKHrR14ZyXyJDqYNmwJVKoSxcN6O",
    authDomain: "photoup-9bbd5.firebaseapp.com",
    projectId: "photoup-9bbd5",
    storageBucket: "photoup-9bbd5.firebasestorage.app",
    messagingSenderId: "1020414557258",
    appId: "1:1020414557258:web:4826f317c6f55d9c62bab3",
    measurementId: "G-GLBFNHLET7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log('✅ Firebase initialized successfully');

// Helper function to get current user
function getCurrentUser() {
    return auth.currentUser;
}

// Helper function to check if user is logged in
function isUserLoggedIn() {
    return auth.currentUser !== null;
}

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseStorage = storage;
