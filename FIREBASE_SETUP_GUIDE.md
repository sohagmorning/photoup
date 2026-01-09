# 🔥 Firebase Setup Guide - Step by Step

## 📋 PROMPT 7: Firebase Project Setup

### ✅ Step 1: Create Firebase Account
1. Go to: https://firebase.google.com/
2. Click **"Get Started"** or **"Go to Console"**
3. Sign in with your Google account

### ✅ Step 2: Create New Project
1. Click **"Add Project"** or **"Create a project"**
2. Enter Project Name: **`photo-vault`** (or your choice)
3. Click **Continue**
4. **Google Analytics**: Enable or disable (optional)
5. Click **Create Project**
6. Wait for setup to complete (30-60 seconds)
7. Click **Continue** when done

### ✅ Step 3: Register Web App
1. In Firebase Console, click **Web icon** (</>) to add web app
2. App nickname: **`Photo Vault Web`**
3. ✅ Check **"Also set up Firebase Hosting"** 
4. Click **Register app**
5. **IMPORTANT:** Copy the Firebase configuration object

### 📝 Firebase Config (Sample)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "photo-vault-xxxxx.firebaseapp.com",
  projectId: "photo-vault-xxxxx",
  storageBucket: "photo-vault-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

### ✅ Step 4: Enable Authentication
1. In left sidebar, click **Build → Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Click **Email/Password**
5. Toggle **Enable** switch ON
6. Click **Save**

### ✅ Step 5: Enable Firestore Database
1. In left sidebar, click **Build → Firestore Database**
2. Click **Create database**
3. Choose location: **Select nearest region** (e.g., asia-south1 for India/Bangladesh)
4. Choose security rules:
   - Select **Start in test mode** (for development)
   - **Production mode** করতে চাইলে custom rules লিখতে হবে
5. Click **Enable**
6. Wait for database creation (30 seconds)

### ✅ Step 6: Enable Firebase Storage
1. In left sidebar, click **Build → Storage**
2. Click **Get Started**
3. Security rules:
   - Select **Start in test mode** (for development)
4. Choose storage location: **Same as Firestore** (recommended)
5. Click **Done**

### ✅ Step 7: Install Firebase CLI (Optional - for hosting)
Open terminal and run:
```bash
npm install -g firebase-tools
```

Or download from: https://firebase.google.com/docs/cli

### ✅ Step 8: Update Your Project
1. Open `js/firebase-config.js`
2. Replace `YOUR_API_KEY` etc. with your actual Firebase config
3. Uncomment the initialization code

---

## 🔐 Security Note
⚠️ **Test mode** allows anyone to read/write data for 30 days
✅ After development, update security rules (see Phase 5)

---

## ✅ Checklist
- [ ] Firebase project created
- [ ] Web app registered
- [ ] Firebase config copied
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Firebase Storage enabled
- [ ] Config updated in firebase-config.js

---

## 🚀 Next Steps
After completing setup:
1. Update `firebase-config.js` with your credentials
2. Add Firebase SDK scripts to HTML files
3. Implement authentication (Prompt 8)
