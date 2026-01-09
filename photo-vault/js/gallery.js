// ===========================
// GALLERY HANDLER
// ===========================

// Load all photos for current user
async function loadUserPhotos(userId) {
    try {
        const photosRef = firebaseDB.collection('photos')
            .where('userId', '==', userId)
            .orderBy('uploadedAt', 'desc');
        
        const snapshot = await photosRef.get();
        
        if (snapshot.empty) {
            console.log('📭 No photos found');
            showEmptyState();
            return [];
        }
        
        const photos = [];
        snapshot.forEach(doc => {
            photos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Loaded photos:', photos.length);
        return photos;
    } catch (error) {
        console.error('❌ Error loading photos:', error);
        throw error;
    }
}

// Display photos in gallery
function displayPhotos(photos) {
    const gallery = document.getElementById('photoGallery');
    const emptyState = document.getElementById('emptyState');
    
    if (!photos || photos.length === 0) {
        if (gallery) gallery.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    if (gallery) gallery.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    
    // Clear existing photos
    gallery.innerHTML = '';
    
    // Create photo cards
    photos.forEach(photo => {
        const card = createPhotoCard(photo);
        gallery.appendChild(card);
    });
    
    console.log('✅ Displayed', photos.length, 'photos');
}

// Create photo card element
function createPhotoCard(photo) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.dataset.photoId = photo.id;
    
    // Format date
    const date = photo.uploadDate || 'Unknown date';
    
    card.innerHTML = `
        <div class="photo-image">
            <img src="${photo.downloadURL}" alt="${photo.eventName}" loading="lazy">
        </div>
        <div class="photo-info">
            <h4>${photo.eventName || 'Untitled'}</h4>
            <p class="photo-date"><i class="fas fa-calendar"></i> ${date}</p>
            <div class="photo-actions">
                <button class="btn-icon" onclick="viewPhoto('${photo.id}')" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="editPhoto('${photo.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deletePhoto('${photo.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// View photo in full screen
function viewPhoto(photoId) {
    console.log('👁️ Viewing photo:', photoId);
    // TODO: Implement lightbox/modal for full-size view
    alert('View feature coming soon!');
}

// Delete photo
async function deletePhoto(photoId) {
    if (!confirm('Are you sure you want to delete this photo?')) {
        return;
    }
    
    try {
        console.log('🗑️ Deleting photo:', photoId);
        
        // Get photo data
        const photoDoc = await firebaseDB.collection('photos').doc(photoId).get();
        
        if (!photoDoc.exists) {
            throw new Error('Photo not found');
        }
        
        const photoData = photoDoc.data();
        
        // Delete from Storage
        const storageRef = firebaseStorage.ref(photoData.storagePath);
        await storageRef.delete();
        console.log('✅ Deleted from storage');
        
        // Delete from Firestore
        await firebaseDB.collection('photos').doc(photoId).delete();
        console.log('✅ Deleted from database');
        
        // Remove from UI
        const card = document.querySelector(`[data-photo-id="${photoId}"]`);
        if (card) {
            card.remove();
        }
        
        // Check if gallery is empty
        const gallery = document.getElementById('photoGallery');
        if (gallery && gallery.children.length === 0) {
            showEmptyState();
        }
        
        alert('✅ Photo deleted successfully');
    } catch (error) {
        console.error('❌ Delete error:', error);
        alert('Failed to delete photo: ' + error.message);
    }
}

// Edit photo metadata
async function editPhoto(photoId) {
    const newEventName = prompt('Enter new event name:');
    
    if (!newEventName || newEventName.trim() === '') {
        return;
    }
    
    try {
        console.log('✏️ Editing photo:', photoId);
        
        await firebaseDB.collection('photos').doc(photoId).update({
            eventName: newEventName.trim(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Photo updated');
        
        // Update UI
        const card = document.querySelector(`[data-photo-id="${photoId}"] h4`);
        if (card) {
            card.textContent = newEventName.trim();
        }
        
        alert('✅ Event name updated successfully');
    } catch (error) {
        console.error('❌ Update error:', error);
        alert('Failed to update photo: ' + error.message);
    }
}

// Filter photos by event
function filterPhotos(filterType, filterValue) {
    console.log('🔍 Filtering by', filterType, ':', filterValue);
    
    const user = firebaseAuth.currentUser;
    if (!user) return;
    
    let query = firebaseDB.collection('photos').where('userId', '==', user.uid);
    
    if (filterValue !== 'all') {
        query = query.where('eventName', '==', filterValue);
    }
    
    query.orderBy('uploadedAt', 'desc').get()
        .then(snapshot => {
            const photos = [];
            snapshot.forEach(doc => {
                photos.push({ id: doc.id, ...doc.data() });
            });
            displayPhotos(photos);
        })
        .catch(error => {
            console.error('❌ Filter error:', error);
        });
}

// Search photos
function searchPhotos(searchTerm) {
    console.log('🔍 Searching:', searchTerm);
    
    const cards = document.querySelectorAll('.photo-card');
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
        const eventName = card.querySelector('h4').textContent.toLowerCase();
        const date = card.querySelector('.photo-date').textContent.toLowerCase();
        
        if (eventName.includes(term) || date.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Show empty state
function showEmptyState() {
    const gallery = document.getElementById('photoGallery');
    const emptyState = document.getElementById('emptyState');
    
    if (gallery) gallery.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
}

// Get statistics
async function getUserStats(userId) {
    try {
        const snapshot = await firebaseDB.collection('photos')
            .where('userId', '==', userId)
            .get();
        
        let totalSize = 0;
        const events = new Set();
        
        snapshot.forEach(doc => {
            const data = doc.data();
            totalSize += data.fileSize || 0;
            if (data.eventName) events.add(data.eventName);
        });
        
        return {
            totalPhotos: snapshot.size,
            totalEvents: events.size,
            totalStorage: (totalSize / (1024 * 1024)).toFixed(2) // MB
        };
    } catch (error) {
        console.error('❌ Error getting stats:', error);
        return {
            totalPhotos: 0,
            totalEvents: 0,
            totalStorage: '0'
        };
    }
}

console.log('✅ Gallery script loaded');
