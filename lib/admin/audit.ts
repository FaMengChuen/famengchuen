import { COLLECTIONS } from "@/lib/cms/repository";
import type { AdminUser } from "@/lib/cms/types";
import { getAdminDb, serverTimestamp } from "@/lib/firebase/admin";

export async function writeAuditLog(
  actor: AdminUser,
  action: string,
  target: string,
  details?: Record<string, unknown>,
) {
  const db = getAdminDb();
  if (!db) {
    return;
  }

  await db.collection(COLLECTIONS.auditLogs).add({
    action,
    target,
    details: details ?? {},
    actor: {
      uid: actor.uid,
      email: actor.email,
      role: actor.role,
    },
    createdAt: serverTimestamp(),
  });
}
