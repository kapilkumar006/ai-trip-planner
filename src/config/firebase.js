import { initializeApp } from "firebase/app";

import {
  getAI,
  GoogleAIBackend,
} from "firebase/ai";

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  getToken,
} from "firebase/app-check";

// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyCKvUlFEVQyYjLsBtBWN0xWzO8aD1PoW8Q",
  authDomain: "sanchari-ai-trip-planner.firebaseapp.com",
  projectId: "sanchari-ai-trip-planner",
  storageBucket: "sanchari-ai-trip-planner.firebasestorage.app",
  messagingSenderId: "117983776103",
  appId: "1:117983776103:web:35c64542d49f08922f73c2",
};

// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

// ==========================================
// APP CHECK DEBUG MODE
// Ensures App Check operates without domain block
// ==========================================

if (typeof self !== "undefined") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// ==========================================
// INITIALIZE FIREBASE APP CHECK
// ==========================================

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    "6Ld3VuMtAAAAAENHhSpBGVZ45xquZjqHsOwTvLJm"
  ),

  isTokenAutoRefreshEnabled: true,
});

// ==========================================
// TEST APP CHECK TOKEN
// ==========================================

getToken(appCheck)
  .then(() => {
    console.log(
      "Firebase App Check token acquired successfully."
    );
  })
  .catch((error) => {
    console.error(
      "Firebase App Check error:",
      error
    );
  });

// ==========================================
// INITIALIZE FIREBASE AI LOGIC
// ==========================================

const ai = getAI(app, {
  backend: new GoogleAIBackend(),
});

// ==========================================
// EXPORT
// ==========================================

export {
  app,
  appCheck,
  ai,
};