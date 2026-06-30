import { PagesManager } from "@/components/admin/PagesManager";
import { getAdminPages } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";

export default async function PagesPage() {
  const pages = await getAdminPages();
  return <PagesManager initialPages={pages} />;
}
