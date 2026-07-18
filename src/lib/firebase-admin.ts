import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const projectId = process.env.FIREBASE_PROJECT_ID || firebaseConfig?.projectId;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

export const isFirebaseAdminAvailable = !!(projectId && clientEmail && privateKey);

let adminApp: any = null;
let adminAuthInstance: any = null;

if (isFirebaseAdminAvailable) {
  try {
    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId: projectId!,
          clientEmail: clientEmail!,
          privateKey: privateKey!.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      adminApp = getApp();
    }
    adminAuthInstance = getAuth(adminApp);
  } catch (err) {
    console.error("Error initializing Firebase Admin SDK:", err);
  }
}

export const adminAuth = adminAuthInstance;
