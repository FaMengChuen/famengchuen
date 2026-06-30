"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

export function missingClientFirebaseVars(): string[] {
  return Object.entries(firebaseConfig)
    .filter(([key, value]) => {
      if (key === "messagingSenderId") {
        return false;
      }

      return !value;
    })
    .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase()}`);
}

export function getFirebaseClientApp(): FirebaseApp | null {
  if (missingClientFirebaseVars().length > 0) {
    return null;
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseClientAuth() {
  const app = getFirebaseClientApp();
  return app ? getAuth(app) : null;
}

export function getGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

export function getFirebaseClientStorage() {
  const app = getFirebaseClientApp();
  return app ? getStorage(app) : null;
}
