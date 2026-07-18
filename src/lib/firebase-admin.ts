import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const projectId = process.env.FIREBASE_PROJECT_ID || firebaseConfig?.projectId;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

let isAvailable = !!(projectId && clientEmail && privateKey);
let sanitizedPrivateKey = '';

if (isAvailable && privateKey) {
  let key = privateKey.trim();
  
  // Remove aspas adicionadas no Vercel (se existirem)
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.substring(1, key.length - 1);
  }
  if (key.startsWith("'") && key.endsWith("'")) {
    key = key.substring(1, key.length - 1);
  }
  
  // Substitui quebras de linha literais por quebras reais
  key = key.replace(/\\n/g, '\n');
  
  // Verifica se a estrutura mínima de certificado da chave privada está presente
  if (key.includes('-----BEGIN PRIVATE KEY-----') && key.includes('-----END PRIVATE KEY-----')) {
    sanitizedPrivateKey = key;
  } else {
    console.warn("[FirebaseAdmin] Chave privada inválida ou incompleta. Desabilitando Firebase Admin.");
    isAvailable = false;
  }
}

let adminApp: any = null;
let adminAuthInstance: any = null;
let adminDbInstance: any = null;

if (isAvailable) {
  try {
    if (getApps().length === 0) {
      adminApp = initializeApp({
        credential: cert({
          projectId: projectId!,
          clientEmail: clientEmail!,
          privateKey: sanitizedPrivateKey,
        }),
      });
    } else {
      adminApp = getApp();
    }
    adminAuthInstance = getAuth(adminApp);
    adminDbInstance = getFirestore(adminApp, firebaseConfig?.firestoreDatabaseId || undefined);
    console.log("[FirebaseAdmin] Firebase Admin SDK e Firestore inicializados com sucesso.");
  } catch (err) {
    console.error("Erro síncrono ao instanciar Firebase Admin SDK:", err);
    isAvailable = false;
  }
}

export const isFirebaseAdminAvailable = isAvailable;
export const adminAuth = adminAuthInstance;
export const adminDb = adminDbInstance;
