import { getApps, initializeApp, cert, applicationDefault, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

type ServiceAccountInput = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

// Flag en globalThis para que sobreviva al hot-reload de Next en dev (los
// módulos se recargan pero la instancia de Firestore persiste cacheada en la
// app de firebase-admin, así que settings() solo puede llamarse una vez).
const FIRESTORE_FLAG = Symbol.for("fmc.firestoreSettingsApplied");
const globalFlags = globalThis as unknown as Record<symbol, boolean>;

function readServiceAccount(): ServiceAccountInput | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (raw) {
    try {
      const json = raw.trim().startsWith("{")
        ? raw
        : Buffer.from(raw, "base64").toString("utf8");
      const parsed = JSON.parse(json) as {
        project_id?: string;
        projectId?: string;
        client_email?: string;
        clientEmail?: string;
        private_key?: string;
        privateKey?: string;
      };

      const projectId = parsed.project_id ?? parsed.projectId;
      const clientEmail = parsed.client_email ?? parsed.clientEmail;
      const privateKey = parsed.private_key ?? parsed.privateKey;

      if (projectId && clientEmail && privateKey) {
        return {
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        };
      }
    } catch (error) {
      console.error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY", error);
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

export function getFirebaseAdminApp(): App | null {
  const existing = getApps()[0];
  if (existing) {
    return existing;
  }

  const storageBucket =
    process.env.FIREBASE_STORAGE_BUCKET ?? process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const serviceAccount = readServiceAccount();

  try {
    if (serviceAccount) {
      return initializeApp({
        credential: cert(serviceAccount),
        storageBucket,
      });
    }

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return initializeApp({
        credential: applicationDefault(),
        storageBucket,
      });
    }
  } catch (error) {
    console.error("Firebase Admin initialization failed", error);
  }

  return null;
}

export function getAdminAuth() {
  const app = getFirebaseAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminDb() {
  const app = getFirebaseAdminApp();
  if (!app) {
    return null;
  }

  const db = getFirestore(app);
  if (!globalFlags[FIRESTORE_FLAG]) {
    try {
      db.settings({ ignoreUndefinedProperties: true });
    } catch {
      // Ya estaba configurada (instancia reutilizada tras un hot-reload).
    }
    globalFlags[FIRESTORE_FLAG] = true;
  }
  return db;
}

export function getAdminStorageBucket() {
  const app = getFirebaseAdminApp();
  if (!app) {
    return null;
  }

  return getStorage(app).bucket();
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    readServiceAccount() ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
  );
}

export function serverTimestamp() {
  return Timestamp.now();
}
