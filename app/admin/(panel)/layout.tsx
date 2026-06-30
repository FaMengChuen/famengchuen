import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getOptionalAdminUser } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOptionalAdminUser();
  if (!user) {
    redirect("/admin/login");
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
