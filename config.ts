
// =================================================================================
// ACTION REQUIRED: CONFIGURE YOUR API KEYS
// =================================================================================
// This file centralizes all the external API keys and configurations needed for the
// application to run. Please update the placeholder values below.

// ---------------------------------------------------------------------------------
// 1. FIREBASE CONFIGURATION
// To find these values, go to your Firebase project console:
//    - Click the gear icon ⚙️ > Project settings.
//    - In the "General" tab, scroll down to "Your apps".
//    - Select your web app.
//    - Under "Firebase SDK snippet", choose "Config" to see these values.
// ---------------------------------------------------------------------------------
export const firebaseConfig = {
  apiKey: "AIzaSyBN1feB1w0F-v9d9ftO0J7EGykYqsyHuec",
  authDomain: "ai-voice-detector-app.firebaseapp.com",
  projectId: "ai-voice-detector-app",
  storageBucket: "ai-voice-detector-app.firebasestorage.app",
  messagingSenderId: "707471962745",
  appId: "1:707471962745:web:a8b9e9f381f8515ce75aa8"
};


// ---------------------------------------------------------------------------------
// 2. GEMINI API KEY
// Handled exclusively via process.env.API_KEY in the execution context.
// ---------------------------------------------------------------------------------


// --- Configuration Checks ---
// Do not edit below this line. This helps the app show you a helpful message if 
// the keys above are not configured.
export const isFirebaseConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("YOUR_");
/* Gemini is assumed pre-configured via system environment variable */
export const isGeminiConfigured = true;
