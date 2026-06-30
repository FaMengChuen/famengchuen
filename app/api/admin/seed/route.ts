import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/admin/audit";
import { adminAuthErrorResponse, requireAdminUser } from "@/lib/admin/auth";
import { COLLECTIONS } from "@/lib/cms/repository";
import {
  DEFAULT_HOME_PAGE,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_PRODUCTS,
  DEFAULT_SITE_CONFIG,
} from "@/lib/cms/default-content";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Inicializa Firestore con el contenido por defecto (config del sitio, home con
 * sus secciones y productos). Es idempotente: solo crea lo que falta, nunca
 * sobreescribe contenido ya editado.
 */
export async function POST() {
  try {
    const actor = await requireAdminUser();
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ error: "Firebase Admin no está configurado." }, { status: 503 });
    }

    const created: string[] = [];

    // site/config
    const configRef = db.collection(COLLECTIONS.site).doc("config");
    if (!(await configRef.get()).exists) {
      await configRef.set({ ...DEFAULT_SITE_CONFIG, updatedAt: serverTimestamp() });
      created.push("site/config");
    }

    // pages/home + secciones
    const homeRef = db.collection(COLLECTIONS.pages).doc("home");
    if (!(await homeRef.get()).exists) {
      // id: undefined se ignora por ignoreUndefinedProperties (no se persiste).
      await homeRef.set({ ...DEFAULT_HOME_PAGE, id: undefined, updatedAt: serverTimestamp() });
      const batch = db.batch();
      DEFAULT_HOME_SECTIONS.forEach((section) => {
        batch.set(homeRef.collection("sections").doc(section.id), {
          type: section.type,
          order: section.order,
          enabled: section.enabled,
          data: section.data,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      created.push(`pages/home (+${DEFAULT_HOME_SECTIONS.length} secciones)`);
    }

    // products
    const productsSnapshot = await db.collection(COLLECTIONS.products).limit(1).get();
    if (productsSnapshot.empty) {
      const batch = db.batch();
      DEFAULT_PRODUCTS.forEach((product) => {
        const { id, ...productData } = product;
        batch.set(db.collection(COLLECTIONS.products).doc(id), {
          ...productData,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      created.push(`${DEFAULT_PRODUCTS.length} productos`);
    }

    await writeAuditLog(actor, "content.seed", "seed", { created });

    return NextResponse.json({
      ok: true,
      created,
      message: created.length ? "Contenido inicializado." : "Todo el contenido ya existía.",
    });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
