import type {
  CmsPage,
  CmsSection,
  CommunityBannerSectionData,
  ContactBlockSectionData,
  HeroSectionData,
  ImageFeatureSectionData,
  ModalitiesGridSectionData,
  PricingGridSectionData,
  Product,
  ProductGridSectionData,
  ProgramCardsSectionData,
  PublicPageContent,
  SiteConfig,
  TeacherProfileSectionData,
  TrustStripSectionData,
} from "./types";

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brandName: "Fa Meng Chuen",
  brandEyebrow: "Kung Fu · Wushu",
  logo: {
    src: "/assets/logo.png",
    alt: "Fa Meng Chuen",
    width: 290,
    height: 290,
  },
  phone: "51963341350",
  phoneDisplay: "+51 963 341 350",
  links: {
    maps: "https://maps.app.goo.gl/dKDSse7PQSdPWRUA6",
    instagram: "https://www.instagram.com/famengchuen/",
    facebook: "https://www.facebook.com/FaMengChuen",
  },
  whatsappMessages: {
    reservar: "Hola, quiero reservar una clase de prueba en Fa Meng Chuen.",
    sanda: "Hola, quiero información sobre la mensualidad de Sanda (S/240).",
    taichi: "Hola, quiero información sobre la mensualidad de Tai Chi (S/220).",
    claseLibre: "Hola, quiero reservar una clase libre (S/40).",
    polo:
      "Hola, quiero comprar un polo oficial de Fa Meng Chuen (preventa S/28). Mi talla es:",
    casaca:
      "Hola, quiero comprar una casaca oficial de Fa Meng Chuen (S/90). Mi talla es:",
  },
  footerText:
    "Arte marcial tradicional chino · Deportes de contacto · Cultura oriental. Cuerpo, mente y espíritu en armonía.",
  footerSignature: "武術之道 · El camino del arte marcial",
  navigation: [
    { label: "Modalidades", href: "#modalidades", sectionId: "modalidades", visible: true, order: 10 },
    { label: "Programas", href: "#programas", sectionId: "programas", visible: true, order: 20 },
    { label: "Maestro", href: "#maestro", sectionId: "maestro", visible: true, order: 30 },
    { label: "Escuela", href: "#comunidad", sectionId: "comunidad", visible: true, order: 40 },
    { label: "Precios", href: "#precios", sectionId: "precios", visible: true, order: 50 },
    { label: "Tienda", href: "#tienda", sectionId: "tienda", visible: true, order: 60 },
  ],
};

export const DEFAULT_HOME_PAGE: CmsPage = {
  id: "home",
  slug: "home",
  title: "Inicio",
  navLabel: "Inicio",
  seoTitle: "Asociación Fa Meng Chuen — Kung Fu · Wushu · Miraflores",
  seoDescription:
    "Escuela de artes marciales chinas en Miraflores, Lima. Tai Chi, Sanda y Taolu, más los programas PAMVA y El Arte de Luchar, de la mano del Maestro Alessandro Paredes. Reserva tu primera clase por WhatsApp.",
  visible: true,
  showInNav: false,
  order: 0,
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "polos-oficiales",
    title: "Polos oficiales",
    detail: "Algodón · Blanco y negro · Tallas S·M·L",
    price: "28",
    currency: "S/",
    note: "Regular S/30",
    compareAtPrice: "30",
    badge: "Preventa",
    sizes: ["S", "M", "L"],
    image: {
      src: "/assets/merch-polos.jpg",
      alt: "Polos oficiales Fa Meng Chuen",
      position: "object-top",
    },
    whatsappMessage:
      "Hola, quiero comprar un polo oficial de Fa Meng Chuen (preventa S/28). Mi talla es:",
    active: true,
    order: 10,
  },
  {
    id: "casacas-oficiales",
    title: "Casacas oficiales",
    detail: "Impermeable · Malla interior · Tallas S·M·L",
    price: "90",
    currency: "S/",
    note: "Preventa",
    badge: "Preventa",
    sizes: ["S", "M", "L"],
    image: {
      src: "/assets/merch-casacas.jpg",
      alt: "Casacas oficiales Fa Meng Chuen",
      position: "object-top",
    },
    whatsappMessage:
      "Hola, quiero comprar una casaca oficial de Fa Meng Chuen (S/90). Mi talla es:",
    active: true,
    order: 20,
  },
];

export const DEFAULT_HOME_SECTIONS: CmsSection[] = [
  {
    id: "hero",
    type: "hero",
    order: 10,
    enabled: true,
    data: {
      background: {
        src: "/assets/comunidad.jpg",
        alt: "Entrenamiento de la comunidad Fa Meng Chuen",
        position: "center 40%",
      },
      watermarkLogo: DEFAULT_SITE_CONFIG.logo,
      kicker: "Asociación · Miraflores, Lima",
      title: "Vive el arte\nmarcial chino",
      accent: "chino",
      description:
        "Arte marcial tradicional y deporte de contacto en un mismo lugar. Únete a nuestra asociación y empieza a vivir el Kung Fu de la mano de nuestro Maestro Alessandro Paredes.",
      primaryCta: {
        label: "Reservar por WhatsApp",
        messageKey: "reservar",
        variant: "red",
        external: true,
      },
      secondaryCta: {
        label: "Conoce las modalidades",
        href: "#modalidades",
        variant: "outline",
      },
      scrollLabel: "Desliza",
      stats: [
        { value: "10", countTo: 10, suffix: "+", label: "Años formando" },
        { value: "3", label: "Modalidades + 2 programas" },
        { value: "★", label: "Reconocidos por el Congreso del Perú" },
      ],
    } satisfies HeroSectionData,
  },
  {
    id: "trust-strip",
    type: "trustStrip",
    order: 20,
    enabled: true,
    data: {
      items: [
        "Congreso de la República del Perú",
        "Deportes UPC",
        "Wushu Tradicional & Moderno",
        "Federación Peruana de Wushu",
      ],
    } satisfies TrustStripSectionData,
  },
  {
    id: "equipo",
    type: "imageFeature",
    order: 30,
    enabled: true,
    data: {
      image: {
        src: "/assets/team.jpg",
        alt: "Equipo de la Asociación Fa Meng Chuen junto al Maestro Alessandro Paredes",
        width: 2000,
        height: 1333,
      },
      captionParts: ["Nuestra familia marcial", "Asociación Fa Meng Chuen · Miraflores"],
    } satisfies ImageFeatureSectionData,
  },
  {
    id: "modalidades",
    type: "modalitiesGrid",
    order: 40,
    enabled: true,
    data: {
      kicker: "Lo que entrenamos",
      title: "Tres caminos,\nuna misma raíz",
      description:
        "Del movimiento sereno del Tai Chi al combate del Sanda. Elige tu disciplina o practícalas todas: cuerpo, mente y espíritu en armonía.",
      items: [
        {
          image: { src: "/assets/taichi.jpg", alt: "Tai Chi Chuan", position: "center 30%" },
          kicker: "Equilibrio · Energía · Bienestar",
          title: "Tai Chi Chuan",
          text: "Movimiento lento y consciente que cultiva salud, respiración y calma. Para todas las edades y niveles.",
          gradient:
            "linear-gradient(to top,#08080a 12%,rgba(8,8,10,.35) 55%,rgba(8,8,10,.55))",
        },
        {
          image: { src: "/assets/sanda.jpg", alt: "Sanda", position: "center 25%" },
          kicker: "Combate · Disciplina · Control",
          title: "Sanda",
          text: "El boxeo del Kung Fu: golpes, patadas y derribos. Deporte de contacto que forja reflejos, carácter y confianza.",
          gradient:
            "linear-gradient(to top,#08080a 12%,rgba(8,8,10,.3) 55%,rgba(8,8,10,.5))",
        },
        {
          image: { src: "/assets/taolu.jpg", alt: "Taolu", position: "center 28%" },
          kicker: "Formas · Técnica · Tradición",
          title: "Taolu",
          text: "Rutinas tradicionales y modernas, a mano vacía y con armas. La esencia técnica y estética del Wushu.",
          gradient:
            "linear-gradient(to top,#08080a 12%,rgba(8,8,10,.4) 55%,rgba(8,8,10,.55))",
        },
      ],
    } satisfies ModalitiesGridSectionData,
  },
  {
    id: "programas",
    type: "programCards",
    order: 50,
    enabled: true,
    data: {
      kicker: "Programas especiales",
      title: "Más que un deporte",
      items: [
        {
          image: {
            src: "/assets/pamva-women.jpg",
            alt: "PAMVA — programa para mujeres",
            position: "center 38%",
          },
          logo: { src: "/assets/pamva.png", alt: "Logo PAMVA", width: 118, height: 118 },
          kicker: "Defensa Personal Femenina",
          title: "PAMVA",
          subtitle: "Programa de Ayuda a Mujeres Víctimas de Agresión",
          text:
            "Defensa personal, prevención, asesoría y soporte. Un espacio seguro donde toda mujer aprende a protegerse con técnica y confianza.",
          chips: ["Defensa personal", "Prevención", "Asesoría", "Soporte"],
          imageMode: "cover",
        },
        {
          image: { src: "/assets/arte-de-luchar.png", alt: "El Arte de Luchar", width: 360, height: 360 },
          kicker: "Artes Marciales Integrales",
          title: "El Arte de Luchar",
          subtitle: "con el Maestro Alessandro Paredes",
          text:
            "Técnica, acondicionamiento y mentalidad de combate. Un programa para llevar tu práctica marcial al siguiente nivel, desde el primer día.",
          chips: ["Técnica", "Acondicionamiento", "Mentalidad"],
          imageMode: "contain",
        },
      ],
    } satisfies ProgramCardsSectionData,
  },
  {
    id: "maestro",
    type: "teacherProfile",
    order: 60,
    enabled: true,
    data: {
      logo: DEFAULT_SITE_CONFIG.logo,
      portrait: {
        src: "/assets/coach2.jpg",
        alt: "Maestro Alessandro Paredes",
        width: 900,
        height: 1200,
        position: "center 20%",
      },
      recognitionImage: {
        src: "/assets/congreso.jpg",
        alt: "Reconocimiento del Congreso",
        width: 58,
        height: 58,
      },
      recognitionKicker: "Reconocimiento oficial",
      recognitionText: "Congreso de la República del Perú — 02/06/2021",
      kicker: "El Maestro",
      title: "Alessandro\nParedes",
      subtitle: "Director de Fa Meng Chuen · Maestro Faja Negra 3.er Tuan",
      text:
        "Maestro de Kung Fu, Wushu y Tai Chi, multicampeón en Kung Fu, Sanda y Tai Chi. Ha dedicado su vida a formar atletas, instructores y practicantes, impulsando el desarrollo del Wushu en el Perú con excelencia técnica, disciplina y respeto.",
      credentials: [
        {
          title: "Actual entrenador de la Selección de Wushu Sanda",
          sub: "Universidad Peruana de Ciencias Aplicadas (UPC)",
        },
        {
          title: "Multicampeón en Kung Fu, Sanda y Tai Chi",
          sub: "Trayectoria competitiva nacional e internacional",
        },
        { title: "Fundador del programa PAMVA", sub: "Defensa personal para mujeres" },
        {
          title: "Ex instructor de la Escuela de Suboficiales de la PNP",
          sub: "y programas de capacitación con el MINSA",
        },
      ],
      closingText:
        "Hoy lidera la formación de niños, jóvenes y adultos bajo la filosofía de Fa Meng Chuen: una enseñanza moderna e inclusiva que forma no solo competidores, sino personas con valores y liderazgo.",
    } satisfies TeacherProfileSectionData,
  },
  {
    id: "comunidad",
    type: "communityBanner",
    order: 70,
    enabled: true,
    data: {
      image: {
        src: "/assets/team.jpg",
        alt: "Comunidad Fa Meng Chuen",
        position: "center 30%",
      },
      kicker: "Nuestra escuela",
      title: "Una familia que entrena, crece y compite junta",
      text:
        "La Asociación Fa Meng Chuen practica, orienta, fomenta y difunde las artes marciales chinas en todas sus modalidades —Wushu Moderno y Tradicional, Kung Fu— como deporte base para el desarrollo integral del ser humano. Aquí no solo aprendes a luchar: aprendes a vivir con disciplina, respeto y propósito.",
      values: [
        { title: "Disciplina", sub: "Cuerpo y mente" },
        { title: "Respeto", sub: "Al maestro y al rival" },
        { title: "Constancia", sub: "Día a día" },
        { title: "Comunidad", sub: "Entrenamos juntos" },
      ],
    } satisfies CommunityBannerSectionData,
  },
  {
    id: "precios",
    type: "pricingGrid",
    order: 80,
    enabled: true,
    data: {
      kicker: "Planes y precios",
      title: "Empieza a entrenar",
      description:
        "Elige tu modalidad o prueba con una clase libre. Sin matrícula sorpresa: escríbenos y coordinamos tu horario.",
      footnote: "¿Consultas sobre Taolu, PAMVA o El Arte de Luchar? Escríbenos por WhatsApp y te asesoramos.",
      plans: [
        {
          kicker: "Mensualidad",
          title: "Sanda",
          price: "240",
          unit: "/ mes",
          text:
            "Boxeo chino de combate: golpes, patadas y derribos. Entrenamiento físico y técnico completo.",
          ctaLabel: "Inscribirme",
          messageKey: "sanda",
          variant: "outline",
        },
        {
          kicker: "Mensualidad",
          title: "Tai Chi",
          price: "220",
          unit: "/ mes",
          text:
            "Movimiento consciente para salud, equilibrio y calma. Ideal para todas las edades y niveles.",
          ctaLabel: "Inscribirme",
          messageKey: "taichi",
          variant: "red",
          featured: true,
        },
        {
          kicker: "Por sesión",
          title: "Clase libre",
          price: "40",
          unit: "/ clase",
          text: "¿Quieres probar sin compromiso? Toma una clase suelta y vive el entrenamiento por un día.",
          ctaLabel: "Reservar",
          messageKey: "claseLibre",
          variant: "outline",
        },
      ],
    } satisfies PricingGridSectionData,
  },
  {
    id: "tienda",
    type: "productGrid",
    order: 90,
    enabled: true,
    data: {
      kicker: "Tienda oficial",
      title: "Lleva la marca\ncontigo",
      description:
        "Indumentaria oficial de la Asociación Fa Meng Chuen. Disciplina que se viste — escríbenos por WhatsApp para reservar tu talla.",
    } satisfies ProductGridSectionData,
  },
  {
    id: "contacto",
    type: "contactBlock",
    order: 100,
    enabled: true,
    data: {
      logo: DEFAULT_SITE_CONFIG.logo,
      kicker: "Empieza hoy",
      title: "Reserva tu\nprimera clase",
      description:
        "Escríbenos por WhatsApp y coordina tu horario. Sin experiencia previa: te recibimos desde el primer día.",
      addressTitle: "Dónde estamos",
      addressLine1: "Calle Alcanfores 267",
      addressLine2: "Miraflores, Lima 18 · Perú",
      mapsLabel: "Ver en Google Maps",
      phoneTitle: "Reservas y consultas",
      phoneMeta: "WhatsApp · Lun a Sáb",
      socialTitle: "Síguenos",
    } satisfies ContactBlockSectionData,
  },
];

export const DEFAULT_PUBLIC_HOME: PublicPageContent = {
  site: DEFAULT_SITE_CONFIG,
  page: DEFAULT_HOME_PAGE,
  sections: DEFAULT_HOME_SECTIONS,
  products: DEFAULT_PRODUCTS,
};

export function getDefaultPublicPage(slug: string): PublicPageContent | null {
  return slug === "home" ? DEFAULT_PUBLIC_HOME : null;
}
