import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { getAdminSiteConfig } from "@/lib/cms/repository";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const site = await getAdminSiteConfig();
  return <SiteSettingsManager initialSite={site} />;
}
