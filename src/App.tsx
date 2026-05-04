import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "./utils/cn";

type MenuItem = {
  name: string;
  price: string;
  note?: string;
};

type MenuCategory = {
  title: string;
  badge: string;
  description: string;
  items: MenuItem[];
};

type FeaturedItem = {
  name: string;
  detail: string;
  price: string;
  badge: string;
};

type HourRow = {
  day: string;
  hours: string;
  note?: string;
  highlight?: boolean;
};

type Sauce = {
  emoji: string;
  name: string;
  description: string;
  pairing: string;
};

type SocialItem = {
  href: string;
  label: string;
};

type UpdateItem = {
  title: string;
  date: string;
  summary: string;
};

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const revealItem = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: easeOutExpo },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const PHONE_DISPLAY = "+48 789 969 998";
const PHONE_PLAIN = "+48789969998";
const PHONE_URL = `tel:${PHONE_PLAIN}`;
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Ksi%C4%99dza+J%C3%B3zefa+Krupy+11%2C+41-949+Piekary+%C5%9Al%C4%85skie";
const ADDRESS_LABEL = "Księdza Józefa Krupy 11, 41-949 Piekary Śląskie";
const INTRO_VIDEO_URL = "/video/intro.mp4?v=3";
const INTRO_VIDEO_MOBILE_URL = "/video/mobile_v3_burn.mp4";
const HEADER_LOGO_MARK_URL = "/image/Projekt bez nazwy.png";
const INTRO_PLAYED_KEY = "lawasz-intro-burn-played";

const openingHours: HourRow[] = [
  { day: "Poniedziałek", hours: "Zamknięte" },
  { day: "Wtorek-Czwartek", hours: "12:00-20:00", highlight: true },
  { day: "Piątek-Sobota", hours: "12:00-21:00", highlight: true },
  { day: "Niedziela", hours: "12:00-21:00", note: "Weekendowe godziny warto potwierdzić w święta." },
];

const featuredMenuItems: FeaturedItem[] = [
  {
    name: "LAWASZ XL Mix",
    detail: "200 g mięsa, świeże warzywa, autorski lawasz i sos do wyboru.",
    price: "38,00 zł",
    badge: "Bestseller",
  },
  {
    name: "LAWASZ L Karkówka",
    detail: "Klasyczny rozmiar, wyraziste mięso i pełny balans dodatków.",
    price: "30,00 zł",
    badge: "Na start",
  },
  {
    name: "LAWASZ Bowl Mix",
    detail: "Porcja obiadowa z 200 g mięsa i świeżymi dodatkami.",
    price: "36,00 zł",
    badge: "Na głód",
  },
  {
    name: "Lava Fries",
    detail: "Frytki z cheddarem, czerwoną cebulą i przyprawami.",
    price: "20,00 zł",
    badge: "Do dokładki",
  },
];

const fullMenuGroups: MenuCategory[] = [
  {
    title: "Lawasz L",
    badge: "140 g mięsa",
    description: "Autorski lawasz, świeże warzywa i sosy. Klasyk w miejskim tempie.",
    items: [
      { name: "Kurczak", price: "28,00 zł" },
      { name: "Karkówka", price: "30,00 zł" },
      { name: "Mix", price: "30,00 zł" },
    ],
  },
  {
    title: "Lawasz XL",
    badge: "200 g mięsa",
    description: "Więcej mięsa, więcej ognia, dalej bez kompromisów.",
    items: [
      { name: "Kurczak", price: "35,00 zł" },
      { name: "Karkówka", price: "37,00 zł" },
      { name: "Mix", price: "38,00 zł" },
    ],
  },
  {
    title: "Lawasz Bowl",
    badge: "Porcja obiadowa",
    description: "200 g mięsa, świeże warzywa i sosy. Konkret, kiedy chcesz czegoś większego.",
    items: [
      { name: "Kurczak", price: "34,00 zł" },
      { name: "Karkówka", price: "36,00 zł" },
      { name: "Mix", price: "36,00 zł" },
    ],
  },
  {
    title: "Fryty",
    badge: "Wołowy tłuszcz",
    description: "Frytki smażone na tłuszczu wołowym. Do wyboru ketchup albo mayo.",
    items: [
      { name: "Klasyczne frytki 200 g", price: "14,00 zł" },
      { name: "Frytki 150 g", price: "6,00 zł", note: "Mała porcja" },
    ],
  },
  {
    title: "Lava Fries",
    badge: "Doładowane",
    description: "150 g frytek, gorący sos cheddar, czerwona cebula i przyprawy.",
    items: [{ name: "Frytki doładowane", price: "20,00 zł" }],
  },
  {
    title: "Napoje",
    badge: "Na zimno",
    description: "Klasyka do lawasza i coś pod ostre sosy.",
    items: [
      { name: "Fritz 330 ml", price: "10,00 zł" },
      { name: "Coca-Cola 330 ml", price: "6,00 zł" },
      { name: "Ayran 250 ml", price: "6,00 zł" },
    ],
  },
  {
    title: "Dodatki",
    badge: "Personalizacja",
    description: "Dokręć zamówienie pod siebie albo dobierz opcję na wynos.",
    items: [
      { name: "80 g mięsa", price: "8,00 zł" },
      { name: "Ogórek kiszony", price: "2,00 zł" },
      { name: "Jalapeño", price: "2,00 zł" },
      { name: "Ser feta", price: "3,00 zł" },
      { name: "Torba na wynos", price: "2,00 zł" },
      { name: "Opakowanie na wynos", price: "1,00 zł" },
    ],
  },
];

const sauces: Sauce[] = [
  {
    emoji: "🍯",
    name: "Musztardowo-Miodowy",
    description: "Balans słodyczy miodu i wyrazistej musztardy. Delikatny, ale z charakterem.",
    pairing: "Dobry do kurczaka i klasycznego lawasza.",
  },
  {
    emoji: "🌫️",
    name: "Wędzona Śliwka",
    description: "Lekko kwaśny, słodko-wędzony sos z głębokim aromatem dymu i nutą śliwki.",
    pairing: "Najlepiej siada z karkówką i bowlem.",
  },
  {
    emoji: "🌶️",
    name: "Chili Ananas",
    description: "Słodki sos z pieczonych warzyw i ananasa z subtelną, rozgrzewającą pikantnością.",
    pairing: "Świetny do mixa i Lava Fries.",
  },
  {
    emoji: "🧄",
    name: "Czosnkowy",
    description: "Klasyczny, intensywny i kremowy. Pewniak, gdy wchodzisz w markę pierwszy raz.",
    pairing: "Uniwersalny wybór do większości zamówień.",
  },
  {
    emoji: "🌋",
    name: "Piekielna Lawa",
    description: "Ekstremalnie ostry sos dla tych, którzy naprawdę lubią ogień.",
    pairing: "Bierz do XL, jeśli lubisz testować granice.",
  },
];

const trustPoints = [
  {
    title: "Własna produkcja mięsa",
    copy: "Rzemieślniczy kebab w Piekarach Śląskich. Świeże mięso i bezkompromisowy smak. Żadnych gotowców z hurtowni, sami marynujemy i nabijamy rożen.",
  },
  {
    title: "Autorski lawasz",
    copy: "Wypiekany tak, by trzymał wszystko w ryzach i chrupał dokładnie tam, gdzie powinien.",
  },
  {
    title: "Ogień bez pośredników",
    copy: "Szybkie zamówienie przez telefon i odbiór w Piekarach Śląskich. Zawsze świeżo i na czas.",
  },
];

const pickupSteps = [
  {
    number: "01",
    title: "Dzwonisz do nas",
    copy: "Krótka piłka – mówisz, co jesz, a my od razu wrzucamy to na ruszt.",
  },
  {
    number: "02",
    title: "Kręcimy na świeżo",
    copy: "Samo mięso, rzemieślniczy lawasz i dopracowane sosy. Bez odgrzewania.",
  },
  {
    number: "03",
    title: "Wpadasz po swoje",
    copy: "Odbierasz gorącego lawasza na miejscu. Zero czekania, pełen konkret.",
  },
];

const meatFacts = [
  "Mięso przygotowywane na miejscu, bez hurtowych gotowców.",
  "Ręczne nakładanie warstw, żeby zachować soczystość i strukturę.",
  "Autorska marynata z charakterem, która pracuje jeszcze przed ogniem.",
  "Spójne podejście do mięsa, lawasza, dodatków i sosów.",
];

const socialLinks: SocialItem[] = [
  { href: "https://www.facebook.com/LAWAszKebab", label: "Facebook · @LAWAszKebab" },
  { href: "https://www.instagram.com/lawasz.kebab/", label: "Instagram · @lawasz.kebab" },
  { href: "https://www.tiktok.com/@lawaszkebab", label: "TikTok · @lawaszkebab" },
];

const footerPrimarySocial = [socialLinks[0]];
const footerSecondarySocial = [socialLinks[2], socialLinks[1]];

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#odbior", label: "Zamów" },
  { href: "#mieso", label: "Mięso" },
  { href: "#sosy", label: "Sosy" },
  { href: "#kontakt", label: "Kontakt" },
];

const contentStore = {
  featuredMenu: featuredMenuItems,
  menuGroups: fullMenuGroups,
  updates: [] as UpdateItem[],
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

function hasPlayedIntroInSession() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(INTRO_PLAYED_KEY) === "1";
  } catch {
    return false;
  }
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("flex items-center leading-none", compact ? "origin-left gap-3" : "gap-3.5")}>
      {compact ? (
        <img
          src={HEADER_LOGO_MARK_URL}
          alt=""
          aria-hidden="true"
          className="h-11 w-11 shrink-0 object-contain [filter:drop-shadow(0_0_3px_rgba(0,0,0,0.5))_brightness(1.2)_contrast(1.24)] sm:h-12 sm:w-12"
          loading="eager"
          decoding="async"
        />
      ) : null}
      <div>
        <div className="font-display text-3xl uppercase tracking-[0.24em] text-white sm:text-4xl">
          LAWA<span className="text-[color:var(--fire)]">SZ</span>
        </div>
        <div className="font-display -mt-1 text-xs uppercase tracking-[0.58em] text-white/68 sm:text-sm">
          KEBAB
        </div>
      </div>
    </div>
  );
}

function IntroBrand() {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <img
        src={HEADER_LOGO_MARK_URL}
        alt=""
        aria-hidden="true"
        className="h-24 w-24 object-contain [filter:drop-shadow(0_0_14px_rgba(255,106,0,0.22))_brightness(1.24)_contrast(1.28)] sm:h-28 sm:w-28"
        loading="eager"
        decoding="async"
      />
      <div className="space-y-1">
        <div className="font-display text-6xl uppercase leading-none tracking-[0.22em] text-white sm:text-7xl">
          LAWA<span className="text-[color:var(--fire)]">SZ</span>
        </div>
        <div className="font-display text-sm uppercase tracking-[0.7em] text-white/62 sm:text-base">
          KEBAB
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      variants={revealItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.32 }}
      className="max-w-3xl space-y-4"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ember)] backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-[color:var(--fire)] shadow-[0_0_20px_rgba(255,106,0,0.8)]" />
        {eyebrow}
      </div>
      <div className="space-y-3">
        <h2 className="font-display text-5xl uppercase leading-none text-white sm:text-6xl lg:text-7xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function HoursList({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("space-y-3", compact ? "text-sm" : "text-base")}>
      {openingHours.map((row) => (
        <div
          key={row.day}
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-white/8 pb-3 last:border-b-0 last:pb-0",
            row.highlight ? "text-white" : "text-white/74",
          )}
        >
          <div>
            <div className="font-medium">{row.day}</div>
            {row.note ? <div className="mt-1 text-xs leading-5 text-white/44">{row.note}</div> : null}
          </div>
          <div className="text-right font-semibold">{row.hours}</div>
        </div>
      ))}
    </div>
  );
}

function FeaturedMenuCard({ item }: { item: FeaturedItem }) {
  return (
    <motion.article
      variants={revealItem}
      className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--gold)]">
            {item.badge}
          </div>
          <h3 className="font-display text-3xl uppercase tracking-[0.08em] text-white">{item.name}</h3>
        </div>
        <div className="text-right font-display text-3xl text-[color:var(--fire)]">{item.price}</div>
      </div>
      <p className="mt-4 text-sm leading-7 text-white/68">{item.detail}</p>
    </motion.article>
  );
}

function MenuAccordion({ category }: { category: MenuCategory }) {
  return (
    <motion.details
      variants={revealItem}
      className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04] backdrop-blur-sm"
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 marker:content-none">
        <div className="space-y-2">
          <div className="font-display text-2xl uppercase tracking-[0.1em] text-white">{category.title}</div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[color:var(--gold)]">
            {category.badge}
          </div>
          <p className="text-sm leading-6 text-white/62">{category.description}</p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/72 transition group-open:rotate-45 group-open:text-white"
        >
          +
        </span>
      </summary>
      <div className="space-y-5 border-t border-white/8 px-5 py-5 bg-black/10">
        {category.items.map((item) => (
          <div key={`${category.title}-${item.name}`} className="relative flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1 sm:pr-4">
              <span className="font-medium text-white/90 text-[15px]">{item.name}</span>
              {item.note && <span className="text-xs leading-relaxed text-white/50">{item.note}</span>}
            </div>
            <div className="hidden sm:block mb-1.5 h-px flex-1 border-b border-dotted border-white/10" />
            <span className="shrink-0 font-semibold text-[color:var(--ember)] text-base mt-1 sm:mt-0">{item.price}</span>
          </div>
        ))}
      </div>
    </motion.details>
  );
}

function SpitIllustration() {
  const slices = [
    "from-[#6e3412] via-[#8f481c] to-[#4e240a]",
    "from-[#84451d] via-[#aa6a35] to-[#65310d]",
    "from-[#5c2e0e] via-[#814219] to-[#482107]",
    "from-[#8a5726] via-[#bf8f5b] to-[#6f4519]",
    "from-[#5f300f] via-[#8b451a] to-[#432008]",
    "from-[#6a3512] via-[#9c5722] to-[#512608]",
  ];

  return (
    <div className="relative mx-auto flex aspect-[4/5] w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,106,0,0.1),rgba(255,106,0,0)_30%),radial-gradient(circle_at_center,rgba(255,149,0,0.12),transparent_46%),rgba(12,12,12,0.92)] p-10 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.04),transparent)] opacity-40" />
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-[color:var(--gold)]/55 blur-md"
          style={{
            width: `${10 + (index % 3) * 6}px`,
            height: `${10 + (index % 3) * 6}px`,
            left: `${18 + index * 9}%`,
            bottom: `${8 + (index % 4) * 7}%`,
          }}
          animate={{
            y: [-6, -42 - (index % 2) * 18],
            opacity: [0, 0.9, 0],
            x: [0, index % 2 === 0 ? -8 : 8],
          }}
          transition={{
            duration: 2.8 + index * 0.15,
            ease: "easeOut",
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.18,
          }}
        />
      ))}
      <motion.div
        className="relative z-10 flex h-full items-center justify-center"
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="absolute h-[90%] w-2 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-500 to-zinc-700 shadow-[0_0_30px_rgba(255,255,255,0.15)]" />
        <motion.div
          className="relative flex flex-col items-center gap-[-8px]"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 18, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {slices.map((gradient, index) => (
            <div
              key={gradient}
              className={cn("rounded-[45%] border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.24)]", "bg-gradient-to-r", gradient)}
              style={{
                width: `${112 - Math.abs(2.5 - index) * 14}px`,
                height: `${42 + (index % 2) * 8}px`,
                marginTop: index === 0 ? 0 : -8,
                transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)`,
              }}
            />
          ))}
        </motion.div>
        <div className="absolute bottom-10 h-10 w-36 rounded-full bg-[color:var(--fire)]/25 blur-2xl" />
      </motion.div>
      <div className="absolute inset-x-10 bottom-7 h-16 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,106,0,0.4),transparent_65%)] blur-xl" />
    </div>
  );
}

function SocialLink({ href, label }: SocialItem) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -3 }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/84 transition hover:border-[color:var(--fire)]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
    >
      <span aria-hidden="true" className="text-[color:var(--ember)]">
        ↗
      </span>
      {label}
    </motion.a>
  );
}

function StickyBottomBar() {
  return (
    <motion.div
      initial={{ y: 72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 72, opacity: 0 }}
      transition={{ type: "spring", damping: 28, stiffness: 340, mass: 0.8 }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#090909]/92 px-4 py-3 backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <motion.a
          href={PHONE_URL}
          aria-label="Zadzwoń i zamów"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.06, type: "spring", damping: 22, stiffness: 300 }}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--fire)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_rgba(255,106,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        >
          Zadzwoń
        </motion.a>
        <motion.a
          href={MAPS_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Otwórz trasę do lokalu"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, type: "spring", damping: 22, stiffness: 300 }}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/8 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
        >
          Trasa
        </motion.a>
      </div>
    </motion.div>
  );
}

function CurvedTextOverlay({ className, visible }: { className?: string; visible?: boolean }) {
  if (!visible) return null;
  return (
    <div className={cn("absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-700", className)}>
      <motion.svg
        initial={{ opacity: 0, scale: 0.85, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
          opacity: { delay: 0.12, duration: 0.88 }, 
          scale: { delay: 0.12, duration: 0.88, ease: [0.16, 1, 0.3, 1] }
        }}
        viewBox="0 0 500 500"
        className="w-[90%] max-w-[700px] h-auto drop-shadow-[0_0_15px_rgba(255,106,0,0.3)] mix-blend-screen"
      >
        <g style={{ transformOrigin: "250px 250px" }}>
          <defs>
            <linearGradient id="fireTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff761a" />
              <stop offset="50%" stopColor="#ff3800" />
              <stop offset="100%" stopColor="#ff761a" />
            </linearGradient>
            <path id="curve-top" d="M 100,250 A 150,150 0 0,1 400,250" fill="none" />
            <path id="curve-bottom" d="M 60,250 A 190,190 0 0,0 440,250" fill="none" />
          </defs>
          <text className="font-display font-bold uppercase tracking-[0.06em]" fontSize="38" fill="#ff6a00">
            <textPath href="#curve-top" startOffset="50%" textAnchor="middle">WŁASNE MIĘSO</textPath>
          </text>
          <text className="font-display font-bold uppercase tracking-[0.06em]" fontSize="38" fill="white">
            <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">AUTORSKI LAWASZ</textPath>
          </text>
        </g>
      </motion.svg>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(() => hasPlayedIntroInSession());
  const [introPlaying, setIntroPlaying] = useState(() => !hasPlayedIntroInSession());
  const [introVideoEnabled, setIntroVideoEnabled] = useState(true);
  const [introVideoReady, setIntroVideoReady] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : 60]);
  const heroCtaOpacity = useTransform(scrollY, [0, 60], [1, 0]);
  const heroCtaY = useTransform(scrollY, [0, 60], [0, 40]);

  const finishIntro = () => {
    setIntroPlaying(false);
    setIntroDone(true);

    try {
      window.sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
    } catch {
      // Brak sessionStorage nie powinien blokować startu strony.
    }
  };

  useEffect(() => {
    const syncViewport = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };

    syncViewport();
    window.addEventListener("resize", syncViewport, { passive: true });
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    const connection = (navigator as NavigatorWithConnection).connection;
    const lowDataMode = Boolean(connection?.saveData) || connection?.effectiveType === "2g";
    const disableIntroVideo = Boolean(reduceMotion) || lowDataMode;
    const introWasPlayed = hasPlayedIntroInSession();

    setIntroVideoEnabled(!disableIntroVideo);
    setIntroVideoReady(disableIntroVideo || introWasPlayed);

    if (disableIntroVideo || introWasPlayed) {
      setIntroDone(true);
      setIntroPlaying(false);
      return;
    }

    setIntroDone(false);
    setIntroPlaying(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (!introPlaying) {
      return;
    }

    const timeoutId = window.setTimeout(finishIntro, 5200);

    return () => window.clearTimeout(timeoutId);
  }, [introPlaying]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || introPlaying ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introPlaying, mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="relative overflow-x-hidden bg-[color:var(--dark)] pb-20 text-[color:var(--cream)] md:pb-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.14),transparent_22%),radial-gradient(circle_at_82%_16%,rgba(255,61,0,0.12),transparent_18%),linear-gradient(180deg,#090909_0%,#101010_46%,#090909_100%)]" />
      <a
        href="#main-content"
        className="sr-only z-[70] rounded-full border border-[color:var(--fire)]/60 bg-[#0a0a0a] px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
      >
        Przejdź do treści
      </a>

      {introDone ? (
        <>
          <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, delay: 0.08, ease: easeOutExpo }}
            className={cn(
              "fixed inset-x-0 top-0 z-50 transition-all duration-300",
              scrolled ? "border-b border-white/10 bg-[#090909]/78 backdrop-blur-2xl" : "bg-transparent",
            )}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <a
                href="#top"
                aria-label="LAWASZ KEBAB"
                className="transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              >
                <Logo compact />
              </a>

              <nav className="hidden items-center gap-7 text-sm font-medium text-white/72 md:flex">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex min-h-11 items-center transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white/85 transition hover:border-[color:var(--fire)]/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] md:hidden"
                >
                  <span className="relative block h-3.5 w-5">
                    <span
                      className={cn(
                        "absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition",
                        mobileMenuOpen ? "translate-y-[6px] rotate-45" : "",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute left-0 top-[6px] h-0.5 w-5 rounded-full bg-current transition",
                        mobileMenuOpen ? "opacity-0" : "",
                      )}
                    />
                    <span
                      className={cn(
                        "absolute left-0 top-[12px] h-0.5 w-5 rounded-full bg-current transition",
                        mobileMenuOpen ? "translate-y-[-6px] -rotate-45" : "",
                      )}
                    />
                  </span>
                </button>

                <a
                  href={PHONE_URL}
                  aria-label="Zadzwoń i zamów"
                  className="hidden min-h-11 items-center rounded-full border border-[color:var(--fire)]/40 bg-[color:var(--fire)]/12 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,106,0,0.18)] transition hover:bg-[color:var(--fire)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] sm:inline-flex"
                >
                  Zadzwoń i zamów
                </a>
              </div>
            </div>
          </motion.header>

          <motion.button
            type="button"
            aria-label="Zamknij menu mobilne"
            initial={false}
            animate={{ opacity: mobileMenuOpen ? 1 : 0, pointerEvents: mobileMenuOpen ? "auto" : "none" }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          <motion.nav
            id="mobile-menu"
            aria-label="Nawigacja mobilna"
            initial={false}
            animate={{
              opacity: mobileMenuOpen ? 1 : 0,
              y: mobileMenuOpen ? 0 : -16,
              pointerEvents: mobileMenuOpen ? "auto" : "none",
            }}
            transition={{ duration: 0.22, ease: easeOutExpo }}
            className="fixed inset-x-4 top-20 z-50 rounded-[1.4rem] border border-white/10 bg-[#0d0d0d]/96 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:hidden [overscroll-behavior:contain]"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={`mobile-${link.href}`}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/84 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        </>
      ) : null}

      <main id="main-content" className="relative z-10">
        <section id="top" className="relative isolate min-h-screen scroll-mt-28">
          <div className="hidden">v6-burn-final-active</div>
          <motion.div style={{ y: heroParallax }} className="absolute inset-0">
            {introVideoEnabled ? (
              <div className="absolute inset-0">
                <video
                  key={isMobileViewport ? "mobile" : "desktop"}
                  className={cn(
                    "h-full w-full transition-opacity duration-700",
                    isMobileViewport ? "object-contain object-top" : "object-cover object-center",
                    isMobileViewport && "mix-blend-screen pointer-events-none",
                    introVideoReady ? "opacity-100" : "opacity-0",
                  )}
                  autoPlay
                  muted
                  playsInline
                  loop={true}
                  preload="metadata"
                  aria-hidden="true"
                  onCanPlay={() => setIntroVideoReady(true)}
                  onError={() => {
                    setIntroVideoEnabled(false);
                    setIntroVideoReady(true);
                  }}
                >
                  <source 
                    src={isMobileViewport ? INTRO_VIDEO_MOBILE_URL : INTRO_VIDEO_URL} 
                    type="video/mp4" 
                  />
                </video>
                {!isMobileViewport && <CurvedTextOverlay visible={introDone} />}
              </div>
            ) : null}

            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                introVideoReady ? "opacity-0" : "opacity-100",
                "bg-[radial-gradient(circle_at_20%_20%,rgba(255,118,26,0.34),transparent_50%),radial-gradient(circle_at_78%_12%,rgba(255,56,0,0.26),transparent_42%),linear-gradient(165deg,#0f0c0a_0%,#1b100d_38%,#080808_100%)]",
              )}
            />
            <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(8,8,8,0.88)_14%,rgba(8,8,8,0.5)_50%,rgba(8,8,8,0.82)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,106,0,0.24),transparent_44%),linear-gradient(180deg,rgba(7,7,7,0.2)_0%,rgba(7,7,7,0.82)_86%)]" />
          </motion.div>

          {introPlaying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ duration: 4.8, times: [0, 0.76, 1], ease: "easeInOut" }}
              className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,106,0,0.07),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0.4)_0%,rgba(8,8,8,0.18)_42%,rgba(8,8,8,0)_72%),linear-gradient(180deg,rgba(4,4,4,0.82)_0%,rgba(4,4,4,0.12)_54%,rgba(4,4,4,0)_100%)] px-4 sm:px-6"
            >
              <div className="relative flex w-full max-w-md items-center justify-center">
                <motion.div
                  className="absolute inset-x-6 h-52 rounded-full bg-[radial-gradient(circle,rgba(255,130,36,0.28),rgba(255,61,0,0.04)_58%,transparent_76%)] blur-3xl"
                  animate={{ opacity: [0.16, 0.74, 0.28, 0], scale: [0.94, 1.03, 1.08, 1.12], y: [10, 0, -12, -18] }}
                  transition={{ duration: 4.8, times: [0, 0.36, 0.78, 1], ease: "easeInOut" }}
                />
                <motion.div
                  animate={{
                    opacity: [0.78, 0.94, 0.22, 0],
                    y: [0, 0, -10, -20],
                    scale: [1, 1.02, 1, 0.98],
                    filter: [
                      "drop-shadow(0 0 18px rgba(255,125,25,0.36)) brightness(1)",
                      "drop-shadow(0 0 26px rgba(255,137,28,0.44)) brightness(1.08)",
                      "drop-shadow(0 0 10px rgba(255,98,14,0.18)) contrast(1.08)",
                      "drop-shadow(0 0 2px rgba(255,92,0,0.04)) contrast(1) brightness(0.96)",
                    ],
                  }}
                  transition={{ duration: 4.8, times: [0, 0.34, 0.8, 1], ease: easeOutExpo }}
                  className="relative"
                >
                  <IntroBrand />
                </motion.div>
              </div>
            </motion.div>
          ) : null}

          {introDone ? (
            <>
              {/* --- HERO SCREEN --- */}
              <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-between px-4 pb-4 pt-28 sm:justify-end sm:pt-32 sm:px-6 lg:px-8 pointer-events-none">
                {/* Mobile brand identity – widoczna tylko na mobile w górnej części hero */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.78, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none flex sm:hidden flex-col items-center gap-3 pt-4 text-center"
                >
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-2 w-2 rounded-full bg-[color:var(--fire)] shadow-[0_0_16px_rgba(255,106,0,1)]"
                  />
                  <div className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[color:var(--fire)] shadow-[0_0_12px_rgba(255,106,0,0.4)]">
                    Świadomy Street Food
                  </div>
                  <h1 className="font-display text-[2.4rem] uppercase leading-[1.1] tracking-[0.08em] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)]">
                    Własne mięso.<br/>Autorski lawasz.
                  </h1>
                  <p className="max-w-[280px] text-[11px] leading-relaxed tracking-wider text-white/70">
                    Rzemieślniczy kebab w Piekarach Śląskich, na miejscu i na wynos.
                  </p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 backdrop-blur-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--fire)] shadow-[0_0_10px_rgba(255,106,0,0.9)]" />
                    Piekary Śląskie · odbiór osobisty
                  </motion.div>
                </motion.div>

                {/* Desktop location badge */}
                <motion.div
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.62, ease: easeOutExpo }}
                  className="pointer-events-auto mb-4 hidden sm:inline-flex w-fit items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--fire)] shadow-[0_0_18px_rgba(255,106,0,0.9)]" />
                  Piekary Śląskie · odbiór osobisty
                </motion.div>

                {/* CTA buttons */}
                <motion.div style={{ opacity: heroCtaOpacity, y: heroCtaY }} className="w-full flex justify-center z-20">
                  <motion.div
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.44, duration: 0.72, ease: easeOutExpo }}
                    className="pointer-events-auto mb-4 sm:mb-6 flex w-full max-w-md flex-col justify-center gap-3 sm:max-w-2xl sm:flex-row sm:gap-4"
                  >
                    <a
                      href={PHONE_URL}
                      aria-label="Zadzwoń i zamów"
                      className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--fire)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-[0_16px_40px_rgba(255,106,0,0.34)] transition hover:translate-y-[-2px] hover:bg-[color:var(--lava)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                    >
                      Zadzwoń i zamów
                    </a>
                    <a
                      href={MAPS_URL}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Otwórz trasę do lokalu"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-7 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white/88 backdrop-blur-sm transition hover:border-white/24 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                    >
                      Jak dojechać
                    </a>
                  </motion.div>
                </motion.div>

                <motion.a
                  href="#odbior"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.96, duration: 0.8 }}
                  className="pointer-events-auto hidden flex-col items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] lg:flex"
                >
                  Scroll
                  <span className="flex h-12 w-7 items-start justify-center rounded-full border border-white/16 p-1.5">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[color:var(--fire)]" />
                  </span>
                </motion.a>
              </div>

              {/* --- POST HERO CONTACT & TRUST POINTS --- */}
              <div className="relative z-10 mx-auto grid w-full max-w-7xl items-start gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.72, ease: easeOutExpo }}
                  className="grid gap-4 sm:grid-cols-3 lg:pt-8"
                >
                  {trustPoints.map((point) => (
                    <div key={point.title} className="rounded-[1.5rem] border border-white/10 bg-black/24 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                      <div className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{point.title}</div>
                      <p className="mt-3 text-sm leading-6 text-white/62">{point.copy}</p>
                    </div>
                  ))}
                </motion.div>

                <motion.aside
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.72, ease: easeOutExpo }}
                  className="rounded-[2rem] border border-white/10 bg-black/28 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl"
                >
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ember)]">
                        Szybki kontakt
                      </div>
                      <h2 className="font-display text-3xl uppercase tracking-[0.12em] text-white">Zadzwoń i wpadaj po swoje</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                        <div className="text-xs uppercase tracking-[0.22em] text-white/45">Adres</div>
                        <address className="mt-2 not-italic text-sm leading-7 text-white/84">{ADDRESS_LABEL}</address>
                      </div>
                      <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                        <div className="text-xs uppercase tracking-[0.22em] text-white/45">Telefon</div>
                        <a
                          href={PHONE_URL}
                          className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-white transition hover:text-[color:var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                        >
                          {PHONE_DISPLAY}
                        </a>
                      </div>
                      <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                        <div className="mb-3 text-xs uppercase tracking-[0.22em] text-white/45">Godziny</div>
                        <HoursList compact />
                      </div>
                    </div>
                  </div>
                </motion.aside>
              </div>
            </>
          ) : null}
        </section>

        <section id="odbior" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <SectionHeading
                eyebrow="Jak zamawiasz"
                title="Tu odbierasz bez kombinowania"
                subtitle="Telefon, krótka piłka, odbiór na miejscu. Zero czekania na dostawców i zbędnych apek. Po prostu gorący lawasz w Twoich rękach."
              />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                className="grid gap-4 md:grid-cols-3"
              >
                {pickupSteps.map((step) => (
                  <motion.article
                    key={step.number}
                    variants={revealItem}
                    className="rounded-[1.7rem] border border-white/10 bg-white/6 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                  >
                    <div className="font-display text-3xl text-[color:var(--fire)]">{step.number}</div>
                    <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/66">{step.copy}</p>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section id="menu" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl space-y-12">
            <SectionHeading
              eyebrow="Menu"
              title="Najczęściej zamawiane"
              subtitle="Najmocniejsze pozycje na szybki wybór z telefonu. Pełne menu zostawiamy niżej, żeby mobile był prostszy i czytelniejszy."
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.16 }}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
            >
              {contentStore.featuredMenu.map((item) => (
                <FeaturedMenuCard key={item.name} item={item} />
              ))}
            </motion.div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={PHONE_URL}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[color:var(--fire)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_16px_40px_rgba(255,106,0,0.28)] transition hover:bg-[color:var(--lava)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              >
                Zadzwoń i zamów
              </a>
              <a
                href="#pelne-menu"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/14 bg-white/6 px-7 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white/86 backdrop-blur-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              >
                Pełne menu
              </a>
            </div>

            <div id="pelne-menu" className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-display text-4xl uppercase tracking-[0.1em] text-white sm:text-5xl">Pełne menu</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/64">
                    Przejrzyj nasze pełne menu, od klasyków w lawaszu, przez konkretne bowle, aż po doładowane fryty. Skomponuj swój idealny zestaw.
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-[color:var(--fire)]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--fire)] shadow-[0_0_15px_rgba(255,106,0,0.15)]">
                  Wybierz coś dla siebie
                </div>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                className="grid gap-4 lg:grid-cols-2"
              >
                {contentStore.menuGroups.map((category) => (
                  <MenuAccordion key={category.title} category={category} />
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl space-y-12">
            <SectionHeading
              eyebrow="Dlaczego LAWASZ"
              title="Twój nowy ulubiony spot"
              subtitle="Wiemy, co robimy, bo wkładamy w to własne mięso i mnóstwo charakteru. Wpadnij do Piekar Śląskich przekonać się na własnych kubkach smakowych."
            />

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="grid gap-4 md:grid-cols-3"
              >
                {trustPoints.map((point) => (
                  <motion.article
                    key={point.title}
                    variants={revealItem}
                    className="rounded-[1.7rem] border border-white/10 bg-white/6 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold text-white">{point.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/66">{point.copy}</p>
                  </motion.article>
                ))}
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.72, ease: easeOutExpo }}
                className="rounded-[1.9rem] border border-white/10 bg-white/6 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-sm"
              >
                <div className="space-y-5">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ember)]">Social proof</div>
                    <h3 className="mt-3 font-display text-4xl uppercase tracking-[0.1em] text-white">Lokal, który żyje offline i online</h3>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-black/18 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/45">Adres</div>
                    <p className="mt-2 text-sm leading-7 text-white/82">{ADDRESS_LABEL}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-black/18 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/45">Social media</div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {socialLinks.map((item) => (
                        <SocialLink key={item.href} href={item.href} label={item.label} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        <section id="mieso" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -40, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
            >
              <SpitIllustration />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: easeOutExpo }}
              className="space-y-8"
            >
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ember)] backdrop-blur-sm">
                  Tylko konkret
                </div>
                <h2 className="font-display text-5xl uppercase leading-none text-white sm:text-6xl lg:text-7xl">
                  Robimy to
                  <br />
                  po swojemu
                </h2>
                <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                  Nasze mięso to nasza wizytówka. Ręcznie nabijamy na rożen autorską kompozycję z własną marynatą, dlatego masz pewność, że to co jesz, ma niepowtarzalny charakter.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {meatFacts.map((fact) => (
                  <div key={fact} className="flex gap-3 rounded-[1.5rem] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/72 backdrop-blur-sm">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[color:var(--fire)] shadow-[0_0_15px_rgba(255,106,0,0.85)]" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="sosy" className="scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl space-y-12">
            <SectionHeading
              eyebrow="Sosy"
              title="Dobierz swój ogień"
              subtitle="Od łagodnej klasyki po piekielną lawę. Sprawdź nasze sosy i znajdź swój idealny level ostrości."
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.14 }}
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {sauces.map((sauce) => (
                <motion.article
                  key={sauce.name}
                  variants={revealItem}
                  className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/6 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[color:var(--fire)]/35"
                >
                  <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,var(--fire),var(--gold))] transition duration-300 group-hover:scale-x-100" />
                  <div className="space-y-4">
                    <div className="text-4xl">{sauce.emoji}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{sauce.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/68">{sauce.description}</p>
                    </div>
                    <p className="rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[color:var(--ember)]">
                      {sauce.pairing}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <footer id="kontakt" className="relative z-10 border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <Logo />
            <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
              LAWASZ KEBAB to lokalny kebab z własnym mięsem, autorskim lawaszem i prostym odbiorem osobistym. Dzwonisz, zamawiasz i wpadasz po gotowe.
            </p>
            <div className="space-y-3 text-white/78">
              <address className="not-italic">{ADDRESS_LABEL}</address>
              <p>
                <a
                  href={PHONE_URL}
                  className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  {PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-display text-2xl uppercase tracking-[0.16em] text-white">Godziny</h3>
              <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <HoursList compact />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl uppercase tracking-[0.16em] text-white">Kontakt i dojazd</h3>
              <div className="space-y-4 rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/72 backdrop-blur-sm">
                <p>Zamawiasz telefonicznie, odbierasz na miejscu i masz trasę pod ręką od razu po wejściu na stronę.</p>
                <div className="flex flex-col gap-3">
                  <a
                    href={PHONE_URL}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[color:var(--fire)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                  >
                    Zadzwoń i zamów
                  </a>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/14 bg-white/6 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                  >
                    Otwórz trasę
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/8 pt-6 text-sm text-white/45">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <div>LAWASZ KEBAB · Piekary Śląskie</div>
              {footerPrimarySocial.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {footerSecondarySocial.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {introDone && scrolled && !mobileMenuOpen ? <StickyBottomBar key="sticky-bar" /> : null}
      </AnimatePresence>
    </div>
  );
}
