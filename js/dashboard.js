// ===========================
// DASHBOARD HANDLER
// ===========================

let currentUser = null;

// Check if user is logged in
function checkAuth() {
    firebaseAuth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log('✅ User authenticated:', user.email);
            currentUser = user;
            
            // Load user data
            await loadUserData(user);
            
            // Load photos
            await loadPhotos(user.uid);
            
            // Load statistics
            await updateStats(user.uid);
        } else {
            console.log('❌ No user authenticated, redirecting to login');
            window.location.href = '../index.html';
        }
    });
}

// Load user data from Firestore
async function loadUserData(user) {
    try {
        const userDoc = await firebaseDB.collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            const displayName = userData.name || user.displayName || user.email;
            
            // Update UI with user info
            const userNameElements = document.querySelectorAll('#displayName, #userName');
            userNameElements.forEach(el => {
                if (el) el.textContent = displayName;
            });
        }
    } catch (error) {
        console.error('❌ Error loading user data:', error);
    }
}

// Load user photos
async function loadPhotos(userId) {
    try {
        const photos = await loadUserPhotos(userId);
        displayPhotos(photos);
    } catch (error) {
        console.error('❌ Error loading photos:', error);
        showEmptyState();
    }
}

// Update dashboard statistics
async function updateStats(userId) {
    try {
        const stats = await getUserStats(userId);
        
        const totalPhotosEl = document.getElementById('totalPhotos');
        const totalEventsEl = document.getElementById('totalEvents');
        const totalStorageEl = document.getElementById('totalStorage');
        
        if (totalPhotosEl) totalPhotosEl.textContent = stats.totalPhotos;
        if (totalEventsEl) totalEventsEl.textContent = stats.totalEvents;
        if (totalStorageEl) totalStorageEl.textContent = stats.totalStorage + ' MB';
    } catch (error) {
        console.error('❌ Error updating stats:', error);
    }
}

// Initialize dashboard
window.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    console.log('✅ Dashboard initialized');
});

console.log('✅ Dashboard script loaded');
