export type AdminRole = "owner" | "admin";
export type UserStatus = "active" | "revoked";

export type ImageRef = {
  src: string;
  alt: string;
  storagePath?: string;
  width?: number;
  height?: number;
  position?: string;
};

export type SocialLinks = {
  maps: string;
  instagram: string;
  facebook: string;
};

export type SiteConfig = {
  brandName: string;
  brandEyebrow: string;
  logo: ImageRef;
  phone: string;
  phoneDisplay: string;
  links: SocialLinks;
  whatsappMessages: Record<string, string>;
  footerText: string;
  footerSignature: string;
  navigation: Array<{
    label: string;
    href: string;
    pageId?: string;
    sectionId?: string;
    visible: boolean;
    order: number;
  }>;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  navLabel: string;
  visible: boolean;
  showInNav: boolean;
  order: number;
  updatedAt?: string;
};

export type SectionType =
  | "hero"
  | "trustStrip"
  | "imageFeature"
  | "modalitiesGrid"
  | "programCards"
  | "teacherProfile"
  | "communityBanner"
  | "pricingGrid"
  | "productGrid"
  | "contactBlock"
  | "richText"
  | "gallery";

export type CmsSection<TData = Record<string, unknown>> = {
  id: string;
  type: SectionType;
  order: number;
  enabled: boolean;
  data: TData;
  updatedAt?: string;
};

export type CtaConfig = {
  label: string;
  href?: string;
  messageKey?: string;
  external?: boolean;
  variant?: "red" | "outline" | "whatsapp";
};

export type HeroSectionData = {
  background: ImageRef;
  watermarkLogo?: ImageRef;
  kicker: string;
  title: string;
  accent: string;
  description: string;
  primaryCta: CtaConfig;
  secondaryCta: CtaConfig;
  scrollLabel: string;
  stats: Array<{
    value: string;
    label: string;
    countTo?: number;
    suffix?: string;
  }>;
};

export type TrustStripSectionData = {
  items: string[];
};

export type ImageFeatureSectionData = {
  image: ImageRef;
  captionParts: string[];
};

export type ModalitiesGridSectionData = {
  kicker: string;
  title: string;
  description: string;
  items: Array<{
    image: ImageRef;
    kicker: string;
    title: string;
    text: string;
    gradient?: string;
  }>;
};

export type ProgramCardsSectionData = {
  kicker: string;
  title: string;
  items: Array<{
    image: ImageRef;
    logo?: ImageRef;
    kicker: string;
    title: string;
    subtitle: string;
    text: string;
    chips: string[];
    imageMode?: "cover" | "contain";
  }>;
};

export type TeacherProfileSectionData = {
  logo: ImageRef;
  portrait: ImageRef;
  recognitionImage: ImageRef;
  recognitionKicker: string;
  recognitionText: string;
  kicker: string;
  title: string;
  subtitle: string;
  text: string;
  credentials: Array<{ title: string; sub: string }>;
  closingText: string;
};

export type CommunityBannerSectionData = {
  image: ImageRef;
  kicker: string;
  title: string;
  text: string;
  values: Array<{ title: string; sub: string }>;
};

export type PricingGridSectionData = {
  kicker: string;
  title: string;
  description: string;
  footnote: string;
  plans: Array<{
    kicker: string;
    title: string;
    price: string;
    unit: string;
    text: string;
    ctaLabel: string;
    messageKey: string;
    variant: "outline" | "red";
    featured?: boolean;
  }>;
};

export type ProductGridSectionData = {
  kicker: string;
  title: string;
  description: string;
};

export type ContactBlockSectionData = {
  logo: ImageRef;
  kicker: string;
  title: string;
  description: string;
  addressTitle: string;
  addressLine1: string;
  addressLine2: string;
  mapsLabel: string;
  phoneTitle: string;
  phoneMeta: string;
  socialTitle: string;
};

export type RichTextSectionData = {
  kicker?: string;
  title: string;
  body: string;
};

export type GallerySectionData = {
  kicker?: string;
  title: string;
  images: ImageRef[];
};

export type Product = {
  id: string;
  title: string;
  detail: string;
  description?: string;
  price: string;
  currency: string;
  note: string;
  compareAtPrice?: string;
  badge: string;
  sizes: string[];
  image: ImageRef;
  whatsappMessage: string;
  active: boolean;
  order: number;
  updatedAt?: string;
};

export type MediaAsset = {
  id: string;
  name: string;
  storagePath: string;
  downloadURL: string;
  alt: string;
  width?: number;
  height?: number;
  contentType: string;
  size: number;
  uploadedBy: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUser = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: AdminRole;
  status: UserStatus;
  createdAt?: string;
  lastLoginAt?: string;
};

export type AdminInvite = {
  email: string;
  role: AdminRole;
  invitedBy: string;
  status: "pending" | "accepted" | "revoked";
  createdAt?: string;
  acceptedAt?: string;
};

export type PublicPageContent = {
  site: SiteConfig;
  page: CmsPage;
  sections: CmsSection[];
  products: Product[];
};
