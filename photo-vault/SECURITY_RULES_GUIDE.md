# 🔐 Firebase Security Rules Guide

## 📋 PROMPT 13: Security Rules Implementation

### ✅ What are Security Rules?

Firebase Security Rules হলো server-side rules যা নিয়ন্ত্রণ করে:
- কে আপনার data read করতে পারবে
- কে আপনার data write করতে পারবে
- কোন conditions এ access দেওয়া হবে

---

## 🔥 Firestore Security Rules

### 📝 Rule Explanation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ✅ Users Collection
    match /users/{userId} {
      // শুধুমাত্র নিজের profile read/write করতে পারবে
      allow read, write: if request.auth.uid == userId;
    }
    
    // ✅ Photos Collection
    match /photos/{photoId} {
      // শুধুমাত্র নিজের photos access করতে পারবে
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

### 🔒 Key Security Features:
1. **Authentication Required**: সব operations এর জন্য login করতে হবে
2. **User Isolation**: প্রতিটি user শুধু নিজের data দেখতে পারবে
3. **Data Validation**: Upload করার সময় userId verify করা হয়
4. **No Anonymous Access**: কোনো anonymous user data access করতে পারবে না

---

## 📦 Storage Security Rules

### 📝 Rule Explanation:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    match /photos/{userId}/{fileName} {
      // File size limit: 5MB
      // Only images allowed
      // User can only access own folder
      
      allow read: if request.auth.uid == userId;
      
      allow write: if request.auth.uid == userId &&
                      request.resource.contentType.matches('image/.*') &&
                      request.resource.size < 5 * 1024 * 1024;
      
      allow delete: if request.auth.uid == userId;
    }
  }
}
```

### 🔒 Key Security Features:
1. **File Type Validation**: শুধু image files upload হবে
2. **Size Limit**: Maximum 5MB per file
3. **User Folder Isolation**: প্রতিটি user এর আলাদা folder
4. **No Cross-Access**: অন্য user এর photos access করা যাবে না

---

## 🚀 How to Deploy Security Rules

### Method 1: Firebase Console (Easy)

#### Firestore Rules:
1. Go to **Firebase Console**
2. Click **Firestore Database**
3. Go to **Rules** tab
4. Copy content from `firestore.rules` file
5. Paste and click **Publish**

#### Storage Rules:
1. Go to **Firebase Console**
2. Click **Storage**
3. Go to **Rules** tab
4. Copy content from `storage.rules` file
5. Paste and click **Publish**

### Method 2: Firebase CLI (Advanced)

```bash
# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## ⚠️ Common Security Mistakes to Avoid

### ❌ DON'T DO THIS:
```javascript
// BAD - Anyone can read/write
allow read, write: if true;

// BAD - No authentication check
allow read, write: if request.auth != null;

// BAD - Test mode in production
allow read, write: if request.time < timestamp.date(2024, 3, 1);
```

### ✅ DO THIS:
```javascript
// GOOD - Check ownership
allow read, write: if request.auth.uid == resource.data.userId;

// GOOD - Validate data
allow create: if request.resource.data.userId == request.auth.uid;

// GOOD - Strict rules
allow read, write: if false; // Default deny
```

---

## 🧪 Testing Security Rules

### Test Firestore Rules:
1. Go to **Firestore → Rules** tab
2. Click **Rules Playground**
3. Set:
   - Auth type: `Authenticated`
   - User UID: `test-user-123`
   - Location: `/photos/photo-abc`
4. Click **Run** to test

### Expected Results:
- ✅ User can read their own photos
- ❌ User cannot read others' photos
- ✅ User can delete their own photos
- ❌ User cannot delete others' photos

---

## 📋 Security Checklist

- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Authentication required for all operations
- [ ] User isolation working
- [ ] File size limits enforced
- [ ] File type validation working
- [ ] Tested with Firebase Rules Playground

---

## 🚨 Production Deployment Notes

1. **Remove Test Mode**: আপনার rules যদি test mode এ থাকে, change করুন
2. **Review Access**: সব rules review করে production এ deploy করুন
3. **Monitor Usage**: Firebase Console এ regularly check করুন
4. **Update Regularly**: App এর features বাড়লে rules update করুন

---

## ✅ Next Steps

After deploying security rules:
1. Test signup/login with real Firebase account
2. Test photo upload
3. Try accessing another user's data (should fail)
4. Move to Phase 6: Hosting deployment
