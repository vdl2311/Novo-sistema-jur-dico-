import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Safe environment variable helper to avoid ReferenceErrors on the client side
const getEnvVar = (name: string): string | undefined => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[name];
    }
  } catch (e) {
    // ignore
  }
  return undefined;
};

const apiKey = getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY') || firebaseConfig?.apiKey;
const authDomain = getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN') || firebaseConfig?.authDomain;
const projectId = getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID') || firebaseConfig?.projectId;
const storageBucket = getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET') || firebaseConfig?.storageBucket;
const messagingSenderId = getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID') || firebaseConfig?.messagingSenderId;
const appId = getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID') || firebaseConfig?.appId;
const measurementId = getEnvVar('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID') || firebaseConfig?.measurementId;

const config = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

const databaseId = getEnvVar('NEXT_PUBLIC_FIREBASE_DATABASE_ID') || firebaseConfig?.firestoreDatabaseId;

const isServer = typeof window === 'undefined';
console.log(`[Firebase Init] Environment: ${isServer ? 'Server-side (Node.js/Vercel)' : 'Client-side (Browser)'}`);
console.log(`[Firebase Init] Project ID: ${config.projectId}`);
console.log(`[Firebase Init] Database ID: ${databaseId || '(default)'}`);
console.log(`[Firebase Init] API Key configured: ${config.apiKey ? 'YES (length ' + config.apiKey.length + ')' : 'NO'}`);

let app;
try {
  app = getApps().length === 0 ? initializeApp(config) : getApp();
  console.log('[Firebase Init] App initialized successfully.');
} catch (error: any) {
  console.error('[Firebase Init] Failed to initialize App:', error);
  throw error;
}

export const auth = getAuth(app);
export const firestore = getFirestore(app, databaseId);

// Verify Connection asynchronously
async function testFirestoreConnection() {
  console.log('[Firebase Connection Test] Starting connection check to Firestore...');
  try {
    const testDocRef = doc(firestore, 'test_connection_diagnostic', 'status');
    await getDocFromServer(testDocRef);
    console.log('[Firebase Connection Test] SUCCESS: Firestore is reachable and working correctly!');
  } catch (error: any) {
    console.error('[Firebase Connection Test] FAILED: Firestore connection check error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    if (error.message && error.message.includes('the client is offline')) {
      console.error('[Firebase Connection Test] Error details: Client is offline. Please check your network and configuration.');
    }
  }
}

// Run the connection test
if (!isServer) {
  testFirestoreConnection();
}

export default app;
