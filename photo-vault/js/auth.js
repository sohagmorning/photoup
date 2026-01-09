// ===========================
// AUTHENTICATION HANDLER
// ===========================

// Sign Up Function with Firebase
function signUp(name, email, password) {
    return firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Update profile with display name
            return user.updateProfile({
                displayName: name
            }).then(() => {
                // Save user data to Firestore
                return firebaseDB.collection('users').doc(user.uid).set({
                    name: name,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }).then(() => {
                console.log('✅ User registered successfully');
                return user;
            });
        })
        .catch((error) => {
            console.error('❌ Signup error:', error);
            throw error;
        });
}

// Login Function with Firebase
function login(email, password) {
    return firebaseAuth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('✅ Login successful');
            return userCredential.user;
        })
        .catch((error) => {
            console.error('❌ Login error:', error);
            throw error;
        });
}

// Logout Function with Firebase
function logout() {
    return firebaseAuth.signOut()
        .then(() => {
            console.log('✅ Logout successful');
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.error('❌ Logout error:', error);
            throw error;
        });
}

// Password Reset Function with Firebase
function resetPassword(email) {
    return firebaseAuth.sendPasswordResetEmail(email)
        .then(() => {
            console.log('✅ Password reset email sent');
        })
        .catch((error) => {
            console.error('❌ Password reset error:', error);
            throw error;
        });
}

// Check authentication state
function onAuthStateChanged(callback) {
    return firebaseAuth.onAuthStateChanged(callback);
}

// Get error message in user-friendly format
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'এই email টি ইতিমধ্যে ব্যবহার হচ্ছে',
        'auth/invalid-email': 'Email ঠিক নেই',
        'auth/operation-not-allowed': 'এই operation এর অনুমতি নেই',
        'auth/weak-password': 'Password খুব দুর্বল (minimum 6 characters)',
        'auth/user-disabled': 'এই user account disable করা আছে',
        'auth/user-not-found': 'User পাওয়া যায়নি',
        'auth/wrong-password': 'Password ভুল হয়েছে',
        'auth/too-many-requests': 'অনেক বার চেষ্টা করেছেন, একটু পরে আবার try করুন',
        'auth/network-request-failed': 'Internet connection এ সমস্যা হচ্ছে'
    };
    
    return errorMessages[errorCode] || 'একটি সমস্যা হয়েছে, আবার চেষ্টা করুন';
}

console.log('✅ Auth script loaded');
