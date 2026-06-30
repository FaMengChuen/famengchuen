"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { WhatsAppIcon } from "./icons";
import { EXTERNAL, whatsappUrl } from "@/lib/site";
import { DEFAULT_SITE_CONFIG } from "@/lib/cms/default-content";
import type { SiteConfig } from "@/lib/cms/types";

function Wordmark({ site }: { site: SiteConfig }) {
  return (
    <a href="#top" className="flex shrink-0 items-center gap-[13px]">
      <Image
        src={site.logo.src}
        alt={site.logo.alt}
        width={site.logo.width ?? 48}
        height={site.logo.height ?? 48}
        priority
        className="h-12 w-12 object-contain"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] tracking-[0.06em] text-cream">
          {site.brandName.toUpperCase()}
        </span>
        <span className="mt-[3px] font-label text-[9.5px] tracking-[0.42em] text-dim">
          {site.brandEyebrow.toUpperCase()}
        </span>
      </span>
    </a>
  );
}

export function Header({ site = DEFAULT_SITE_CONFIG }: { site?: SiteConfig }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = site.navigation.filter((item) => item.visible).sort((a, b) => a.order - b.order);
  const reserveUrl = whatsappUrl(site.phone, site.whatsappMessages.reservar);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-[18px] border-b px-[clamp(18px,5vw,56px)] transition-[padding,background-color,border-color,backdrop-filter] duration-300"
        style={{
          paddingTop: scrolled ? 11 : 18,
          paddingBottom: scrolled ? 11 : 18,
          backgroundColor: scrolled ? "rgba(8,8,9,.86)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
          borderColor: scrolled ? "rgba(244,241,234,.1)" : "transparent",
        }}
      >
        <Wordmark site={site} />

        <nav className="flex items-center justify-end gap-[clamp(14px,2vw,30px)]">
          <div className="hidden items-center justify-end gap-[clamp(14px,2vw,30px)] min-[901px]:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-label text-[13px] uppercase tracking-[0.12em] text-sand transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href={reserveUrl}
              {...EXTERNAL}
              className="inline-flex items-center gap-2 rounded-[2px] bg-red px-5 py-[11px] font-label text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:-translate-y-px hover:bg-red-hi"
            >
              Reservar clase
            </a>
          </div>

          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-[46px] w-[46px] flex-col items-center justify-center gap-[5px] rounded-[3px] border-[1.5px] border-[rgba(244,241,234,.25)] text-cream min-[901px]:hidden"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[49] flex flex-col items-center justify-center gap-2 bg-[rgba(8,8,9,.97)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
              className="absolute right-[22px] top-5 grid h-[46px] w-[46px] place-items-center rounded-[3px] border-[1.5px] border-[rgba(244,241,234,.25)] text-[22px] leading-none text-cream"
            >
              ×
            </button>

            {nav.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-0 py-[9px] font-display text-3xl uppercase tracking-[0.02em] text-cream"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 + i * 0.05 }}
              >
                {item.label}
              </motion.a>
            ))}

            <motion.a
              href={reserveUrl}
              {...EXTERNAL}
              onClick={() => setMenuOpen(false)}
              className="mt-[18px] inline-flex items-center gap-[9px] rounded-[2px] bg-red px-7 py-[15px] font-label text-[15px] font-semibold uppercase tracking-[0.08em] text-white"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.06 + nav.length * 0.05 }}
            >
              <WhatsAppIcon size={18} />
              Reservar por WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
