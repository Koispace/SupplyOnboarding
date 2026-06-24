import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig, isFirebaseConfigured } from "./config";

let app = null;
let auth = null;

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }

  return app;
}

export function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (!auth) {
    const firebaseApp = getFirebaseApp();
    auth = getAuth(firebaseApp);
  }

  return auth;
}
