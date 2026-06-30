import { z } from "zod";

export const sectionTypes = [
  "hero",
  "trustStrip",
  "imageFeature",
  "modalitiesGrid",
  "programCards",
  "teacherProfile",
  "communityBanner",
  "pricingGrid",
  "productGrid",
  "contactBlock",
  "richText",
  "gallery",
] as const;

export const imageRefSchema = z.object({
  src: z.string().min(1),
  alt: z.string().default(""),
  storagePath: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  position: z.string().optional(),
});

export const pageInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .transform((value) => slugify(value)),
  title: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  navLabel: z.string().optional(),
  visible: z.boolean().default(true),
  showInNav: z.boolean().default(false),
  order: z.number().default(100),
});

export const pageUpdateSchema = pageInputSchema.extend({
  id: z.string().optional(),
});

export const sectionInputSchema = z.object({
  id: z.string().min(1),
  type: z.enum(sectionTypes),
  order: z.number(),
  enabled: z.boolean(),
  data: z.record(z.string(), z.unknown()),
});

export const pageWithSectionsUpdateSchema = z.object({
  page: pageUpdateSchema,
  sections: z.array(sectionInputSchema),
});

export const productInputSchema = z.object({
  title: z.string().min(1),
  detail: z.string().default(""),
  description: z.string().optional(),
  price: z.string().min(1),
  currency: z.string().default("S/"),
  note: z.string().default(""),
  compareAtPrice: z.string().optional(),
  badge: z.string().default(""),
  sizes: z.array(z.string()).default([]),
  image: imageRefSchema,
  whatsappMessage: z.string().min(1),
  active: z.boolean().default(true),
  order: z.number().default(100),
});

export const mediaInputSchema = z.object({
  name: z.string().min(1),
  storagePath: z.string().min(1),
  downloadURL: z.string().url(),
  alt: z.string().default(""),
  width: z.number().optional(),
  height: z.number().optional(),
  contentType: z.string().default("application/octet-stream"),
  size: z.number().default(0),
});

export const mediaUpdateSchema = z.object({
  alt: z.string().default(""),
});

export const inviteInputSchema = z.object({
  email: z.string().email().transform((value) => value.trim().toLowerCase()),
});

export const userPatchSchema = z.object({
  uid: z.string().optional(),
  email: z.string().email().optional().transform((value) => value?.trim().toLowerCase()),
  status: z.enum(["active", "revoked"]),
});

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeId(value: string): string {
  const id = slugify(value);
  return id || `item-${Date.now()}`;
}
