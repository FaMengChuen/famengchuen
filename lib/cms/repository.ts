import type { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import {
  DEFAULT_HOME_PAGE,
  DEFAULT_HOME_SECTIONS,
  DEFAULT_PRODUCTS,
  DEFAULT_PUBLIC_HOME,
  DEFAULT_SITE_CONFIG,
  getDefaultPublicPage,
} from "./default-content";
import type { CmsPage, CmsSection, MediaAsset, Product, PublicPageContent, SiteConfig } from "./types";
import { getAdminDb } from "@/lib/firebase/admin";

export const COLLECTIONS = {
  site: "site",
  pages: "pages",
  products: "products",
  media: "media",
  users: "users",
  adminInvites: "adminInvites",
  auditLogs: "auditLogs",
} as const;

export function serializeFirestoreValue(value: unknown): unknown {
  if (!value) {
    return value;
  }

  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeFirestoreValue);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nested]) => [
        key,
        serializeFirestoreValue(nested),
      ]),
    );
  }

    return value;
}

function docWithId<T>(doc: QueryDocumentSnapshot<DocumentData>): T {
  return {
    id: doc.id,
    ...(serializeFirestoreValue(doc.data()) as Record<string, unknown>),
  } as T;
}

function mergeSiteConfig(config?: Partial<SiteConfig>): SiteConfig {
  if (!config) {
    return DEFAULT_SITE_CONFIG;
  }

  return {
    ...DEFAULT_SITE_CONFIG,
    ...config,
    logo: { ...DEFAULT_SITE_CONFIG.logo, ...config.logo },
    links: { ...DEFAULT_SITE_CONFIG.links, ...config.links },
    whatsappMessages: {
      ...DEFAULT_SITE_CONFIG.whatsappMessages,
      ...config.whatsappMessages,
    },
    navigation: config.navigation ?? DEFAULT_SITE_CONFIG.navigation,
  };
}

async function getSiteConfig(): Promise<SiteConfig> {
  const db = getAdminDb();
  if (!db) {
    return DEFAULT_SITE_CONFIG;
  }

  try {
    const doc = await db.collection(COLLECTIONS.site).doc("config").get();
    const configured = doc.exists ? (serializeFirestoreValue(doc.data()) as Partial<SiteConfig>) : undefined;
    const visiblePages = await db.collection(COLLECTIONS.pages).orderBy("order", "asc").get();
    const pageNav = visiblePages.docs
      .map((pageDoc) => docWithId<CmsPage>(pageDoc))
      .filter((page) => page.visible && page.showInNav && page.slug !== "home")
      .map((page) => ({
        label: page.navLabel || page.title,
        href: `/${page.slug}`,
        pageId: page.id,
        visible: true,
        order: page.order,
      }));

    const site = mergeSiteConfig(configured);
    return {
      ...site,
      navigation: [...site.navigation, ...pageNav].sort((a, b) => a.order - b.order),
    };
  } catch (error) {
    console.error("Unable to load site config from Firestore", error);
    return DEFAULT_SITE_CONFIG;
  }
}

async function getActiveProducts(): Promise<Product[]> {
  const db = getAdminDb();
  if (!db) {
    return DEFAULT_PRODUCTS;
  }

  try {
    const snapshot = await db.collection(COLLECTIONS.products).orderBy("order", "asc").get();
    const products = snapshot.docs.map((doc) => docWithId<Product>(doc)).filter((product) => product.active);
    return products.length ? products : DEFAULT_PRODUCTS;
  } catch (error) {
    console.error("Unable to load products from Firestore", error);
    return DEFAULT_PRODUCTS;
  }
}

export async function getPublicPageContent(slug: string): Promise<PublicPageContent | null> {
  const normalizedSlug = slug === "" || slug === "/" ? "home" : slug;
  const fallback = getDefaultPublicPage(normalizedSlug);
  const db = getAdminDb();

  if (!db) {
    return fallback;
  }

  try {
    const site = await getSiteConfig();
    const products = await getActiveProducts();
    const pageSnapshot = await db
      .collection(COLLECTIONS.pages)
      .where("slug", "==", normalizedSlug)
      .limit(1)
      .get();

    if (pageSnapshot.empty) {
      return fallback;
    }

    const pageDoc = pageSnapshot.docs[0];
    const page = docWithId<CmsPage>(pageDoc);
    if (!page.visible && normalizedSlug !== "home") {
      return null;
    }

    const sectionsSnapshot = await pageDoc.ref.collection("sections").orderBy("order", "asc").get();
    const sections = sectionsSnapshot.docs
      .map((sectionDoc) => docWithId<CmsSection>(sectionDoc))
      .filter((section) => section.enabled);

    return {
      site,
      page,
      sections: sections.length ? sections : fallback?.sections ?? [],
      products,
    };
  } catch (error) {
    console.error(`Unable to load page "${normalizedSlug}" from Firestore`, error);
    return fallback;
  }
}

export async function getAdminPages(): Promise<CmsPage[]> {
  const db = getAdminDb();
  if (!db) {
    return [DEFAULT_HOME_PAGE];
  }

  const snapshot = await db.collection(COLLECTIONS.pages).orderBy("order", "asc").get();
  const pages = snapshot.docs.map((doc) => docWithId<CmsPage>(doc));
  return pages.length ? pages : [DEFAULT_HOME_PAGE];
}

export async function getAdminPage(pageId: string): Promise<{ page: CmsPage; sections: CmsSection[] } | null> {
  const db = getAdminDb();
  if (!db) {
    if (pageId === "home") {
      return { page: DEFAULT_HOME_PAGE, sections: DEFAULT_HOME_SECTIONS };
    }

    return null;
  }

  const pageDoc = await db.collection(COLLECTIONS.pages).doc(pageId).get();
  if (!pageDoc.exists) {
    return pageId === "home" ? { page: DEFAULT_HOME_PAGE, sections: DEFAULT_HOME_SECTIONS } : null;
  }

  const sectionsSnapshot = await pageDoc.ref.collection("sections").orderBy("order", "asc").get();
  return {
    page: { id: pageDoc.id, ...(serializeFirestoreValue(pageDoc.data()) as Record<string, unknown>) } as CmsPage,
    sections: sectionsSnapshot.docs.map((sectionDoc) => docWithId<CmsSection>(sectionDoc)),
  };
}

export async function getAdminProducts(): Promise<Product[]> {
  const db = getAdminDb();
  if (!db) {
    return DEFAULT_PRODUCTS;
  }

  const snapshot = await db.collection(COLLECTIONS.products).orderBy("order", "asc").get();
  const products = snapshot.docs.map((doc) => docWithId<Product>(doc));
  return products.length ? products : DEFAULT_PRODUCTS;
}

export async function getAdminMedia(): Promise<MediaAsset[]> {
  const db = getAdminDb();
  if (!db) {
    return [];
  }

  const snapshot = await db.collection(COLLECTIONS.media).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => docWithId<MediaAsset>(doc));
}

export function getFallbackHomeContent(): PublicPageContent {
  return DEFAULT_PUBLIC_HOME;
}
