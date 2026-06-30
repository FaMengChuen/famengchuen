/**
 * Seed de Firestore con el contenido por defecto del sitio.
 *
 * Uso (Node 22.6+ / 26 ejecuta TypeScript de forma nativa):
 *   node --env-file=.env.local scripts/seed.ts
 *
 * Es idempotente: solo crea lo que falta, nunca sobreescribe contenido ya
 * editado desde el panel. Equivale al endpoint /api/admin/seed pero por CLI.
 */
import { initializeApp, cert, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import {
  DEFAULT_HOME_PAGE,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_PRODUCTS,
  DEFAULT_SITE_CONFIG,
} from "../lib/cms/default-content.ts";

function readServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw) {
    const json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(json);
    return {
      projectId: parsed.project_id ?? parsed.projectId,
      clientEmail: parsed.client_email ?? parsed.clientEmail,
      privateKey: (parsed.private_key ?? parsed.privateKey)?.replace(/\\n/g, "\n"),
    };
  }
  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }
  return null;
}

if (!getApps().length) {
  const sa = readServiceAccount();
  initializeApp(sa ? { credential: cert(sa) } : { credential: applicationDefault() });
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
const now = () => Timestamp.now();

async function main() {
  const created: string[] = [];

  const configRef = db.collection("site").doc("config");
  if (!(await configRef.get()).exists) {
    await configRef.set({ ...DEFAULT_SITE_CONFIG, updatedAt: now() });
    created.push("site/config");
  }

  const homeRef = db.collection("pages").doc("home");
  if (!(await homeRef.get()).exists) {
    await homeRef.set({ ...DEFAULT_HOME_PAGE, id: undefined, updatedAt: now() });
    const batch = db.batch();
    for (const section of DEFAULT_HOME_SECTIONS) {
      batch.set(homeRef.collection("sections").doc(section.id), {
        type: section.type,
        order: section.order,
        enabled: section.enabled,
        data: section.data,
        updatedAt: now(),
      });
    }
    await batch.commit();
    created.push(`pages/home (+${DEFAULT_HOME_SECTIONS.length} secciones)`);
  }

  const productsSnap = await db.collection("products").limit(1).get();
  if (productsSnap.empty) {
    const batch = db.batch();
    for (const product of DEFAULT_PRODUCTS) {
      const { id, ...rest } = product;
      batch.set(db.collection("products").doc(id), { ...rest, updatedAt: now() });
    }
    await batch.commit();
    created.push(`${DEFAULT_PRODUCTS.length} productos`);
  }

  console.log(created.length ? `✓ Creado: ${created.join(", ")}` : "✓ Todo el contenido ya existía.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error al sembrar contenido:", err);
    process.exit(1);
  });
