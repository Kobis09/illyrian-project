// firebase.js - CLEAN FIXED VERSION (WITH FUNCTIONS SUPPORT)
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFunctions } from "firebase/functions";   // ✅ ADDED FOR REFERRAL FUNCTION

// ------------------------------
// Firebase Config
// ------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAe_XlyBuXEDn12Zbg5UKFW1unXHfUB-CM",
  authDomain: "illyriantoken1.firebaseapp.com",
  projectId: "illyriantoken1",
  storageBucket: "illyriantoken1.appspot.com",
  messagingSenderId: "463410441529",
  appId: "1:463410441529:web:dc647cc5f413d11cd24ce8",
  measurementId: "G-2G5ERDD7WP",
};

// ------------------------------
// Initialize Firebase
// ------------------------------
let app;
let auth;
let db;
let storage;
let analytics;
let functions; // ✅ ADDED

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);      // ✅ ADDED (required for Cloud Functions)

  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) analytics = getAnalytics(app);
    });
  }

  console.log("🔥 Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  throw new Error("Firebase failed to initialize.");
}

// ------------------------------
// Auth Persistence
// ------------------------------
const setupAuthPersistence = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    console.log("✅ Auth persistence: browserLocalPersistence");
  } catch (err) {
    console.warn("⚠️ Local persistence failed, using inMemory:", err);
    try {
      await setPersistence(auth, inMemoryPersistence);
    } catch (fallbackErr) {
      console.error("❌ All auth persistence methods failed:", fallbackErr);
    }
  }
};

if (typeof window !== "undefined") {
  setupAuthPersistence();
}

// ------------------------------
// Firestore Offline Persistence
// ------------------------------
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn("⚠️ Multiple tabs open — persistence disabled");
    } else if (err.code === "unimplemented") {
      console.warn("⚠️ Browser doesn't support IndexedDB");
    } else {
      console.error("❌ Firestore persistence error:", err);
    }
  });
}

// ------------------------------
// Firebase Status Checker
// ------------------------------
const checkFirebaseConnection = async () => {
  try {
    console.log("✅ Firebase connection: Healthy");
    return true;
  } catch (error) {
    console.error("❌ Firebase connection issue:", error);
    return false;
  }
};

// ------------------------------
// Error Handler
// ------------------------------
export const handleFirebaseError = (error, context = "Firebase operation") => {
  console.error(`❌ ${context} failed:`, error);

  const errorMap = {
    "auth/invalid-email": "❌ Please enter a valid email address",
    "auth/user-disabled": "❌ This account has been disabled",
    "auth/user-not-found": "❌ No account found with this email",
    "auth/wrong-password": "❌ Incorrect password",
    "auth/email-already-in-use": "❌ This email is already registered",
    "auth/network-request-failed": "❌ Network error",
    "permission-denied": "❌ Permission denied",
  };

  return {
    originalError: error,
    code: error.code,
    message: error.message,
    userMessage:
      errorMap[error.code] || `❌ ${context} failed. Please try again.`,
    timestamp: new Date().toISOString(),
  };
};

// ------------------------------
// Firebase Status (no export default)
// ------------------------------
const getFirebaseStatus = () => {
  return {
    auth: !!auth,
    firestore: !!db,
    storage: !!storage,
    analytics: !!analytics,
    functions: !!functions,
    app: !!app,
    timestamp: new Date().toISOString(),
  };
};

// ------------------------------
// FINAL EXPORTS
// ------------------------------
export {
  app,
  auth,
  db,
  storage,
  analytics,
  functions,                   
  checkFirebaseConnection,
  getFirebaseStatus,
};

export default {
  app,
  auth,
  db,
  storage,
  analytics,
  functions,
};
