// ===========================
// PHOTO UPLOAD HANDLER
// ===========================

// Upload photo to Firebase Storage
async function uploadPhoto(file, eventName, userId) {
    try {
        // Create unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const filePath = `photos/${userId}/${fileName}`;
        
        console.log('📤 Uploading:', fileName);
        
        // Create storage reference
        const storageRef = firebaseStorage.ref(filePath);
        
        // Upload file
        const uploadTask = storageRef.put(file);
        
        // Monitor upload progress
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload progress:', progress.toFixed(2) + '%');
                    
                    // Update UI progress bar
                    updateProgressBar(progress);
                },
                (error) => {
                    // Error
                    console.error('❌ Upload error:', error);
                    reject(error);
                },
                async () => {
                    // Success - get download URL
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    console.log('✅ Upload complete:', downloadURL);
                    
                    // Save metadata to Firestore
                    const photoData = {
                        userId: userId,
                        fileName: file.name,
                        storagePath: filePath,
                        downloadURL: downloadURL,
                        eventName: eventName || 'Uncategorized',
                        fileSize: file.size,
                        fileType: file.type,
                        uploadDate: new Date().toISOString().split('T')[0],
                        uploadedAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    const photoDoc = await savePhotoMetadata(photoData);
                    resolve({ ...photoData, id: photoDoc.id });
                }
            );
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        throw error;
    }
}

// Save photo metadata to Firestore
async function savePhotoMetadata(photoData) {
    try {
        const docRef = await firebaseDB.collection('photos').add(photoData);
        console.log('✅ Photo metadata saved:', docRef.id);
        return docRef;
    } catch (error) {
        console.error('❌ Error saving metadata:', error);
        throw error;
    }
}

// Upload multiple photos
async function uploadMultiplePhotos(files, eventName, userId) {
    const uploadPromises = [];
    
    for (let file of files) {
        // Validate file
        if (!validatePhotoFile(file)) {
            console.warn('⚠️ Skipping invalid file:', file.name);
            continue;
        }
        
        uploadPromises.push(uploadPhoto(file, eventName, userId));
    }
    
    try {
        const results = await Promise.all(uploadPromises);
        console.log('✅ All uploads complete:', results.length);
        return results;
    } catch (error) {
        console.error('❌ Error uploading multiple photos:', error);
        throw error;
    }
}

// Validate photo file
function validatePhotoFile(file) {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        alert(`❌ Invalid file type: ${file.name}\nOnly JPG, PNG, GIF, WEBP allowed`);
        return false;
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        alert(`❌ File too large: ${file.name}\nMax size: 5MB`);
        return false;
    }
    
    return true;
}

// Update progress bar in UI
function updateProgressBar(progress) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (progressText) {
        progressText.textContent = `Uploading... ${Math.round(progress)}%`;
    }
}

// Handle file selection
function handleFileSelect(event) {
    const files = event.target.files;
    console.log('Files selected:', files.length);
    
    // Preview selected files (optional)
    if (files.length > 0) {
        console.log('Selected files:');
        Array.from(files).forEach(file => {
            console.log(`- ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
        });
    }
}

console.log('✅ Upload script loaded');
