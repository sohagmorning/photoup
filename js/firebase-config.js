// ===========================
// FIREBASE CONFIGURATION
// ===========================

// ⚠️ IMPORTANT: Replace these values with your own Firebase config
// Get your config from: Firebase Console → Project Settings → Your apps → Config

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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
