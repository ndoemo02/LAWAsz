import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
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

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const revealItem = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
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
      staggerChildren: 0.12,
    },
  },
};

const menuCategories: MenuCategory[] = [
  {
    title: "LAWASZ L",
    badge: "140g mięsa",
    description: "Autorski lawasz, świeże warzywa i sosy. Klasyk w miejskim tempie.",
    items: [
      { name: "Kurczak", price: "28,00 zł" },
      { name: "Karkówka", price: "30,00 zł" },
      { name: "Mix", price: "30,00 zł" },
    ],
  },
  {
    title: "LAWASZ XL",
    badge: "200g mięsa",
    description: "Więcej mięsa, więcej ognia, dalej bez kompromisów.",
    items: [
      { name: "Kurczak", price: "35,00 zł" },
      { name: "Karkówka", price: "37,00 zł" },
      { name: "Mix", price: "38,00 zł" },
    ],
  },
  {
    title: "LAWASZ BOWL",
    badge: "porcja obiadowa",
    description: "200g mięsa, świeże warzywa i sosy. Konkret, kiedy chcesz usiąść z czymś większym.",
    items: [
      { name: "Kurczak", price: "34,00 zł" },
      { name: "Karkówka", price: "36,00 zł" },
      { name: "Mix", price: "36,00 zł" },
    ],
  },
  {
    title: "FRYTY",
    badge: "wołowy tłuszcz",
    description: "200g fryt smażonych na tłuszczu wołowym. Do wyboru ketchup albo mayo.",
    items: [
      { name: "Klasyczne frytki", price: "14,00 zł" },
      { name: "Frytki 150g", price: "6,00 zł", note: "mała porcja" },
    ],
  },
  {
    title: "LAVA FRIES",
    badge: "doładowane",
    description: "150g frytek, gorący sos cheddar, czerwona cebula i przyprawy. Street food z dopaleniem.",
    items: [{ name: "Frytki doładowane", price: "20,00 zł" }],
  },
  {
    title: "NAPOJE",
    badge: "na zimno",
    description: "Klasyka do lawasza i coś pod ostre sosy.",
    items: [
      { name: "Fritz Napoje 330ml", price: "10,00 zł" },
      { name: "Coca-Cola 330ml", price: "6,00 zł" },
      { name: "Ayran 250ml", price: "6,00 zł" },
    ],
  },
  {
    title: "DODATKI",
    badge: "personalizacja",
    description: "Dokręć zamówienie pod siebie albo dobierz opcję na wynos.",
    items: [
      { name: "80g mięsa", price: "8,00 zł" },
      { name: "Ogórek kiszony", price: "2,00 zł" },
      { name: "Jalapeño", price: "2,00 zł" },
      { name: "Ser feta", price: "3,00 zł" },
      { name: "Torba na wynos", price: "2,00 zł" },
      { name: "Opakowanie na wynos", price: "1,00 zł" },
    ],
  },
];

const sauces = [
  {
    emoji: "🍯",
    name: "Musztardowo-Miodowy",
    description:
      "Harmonia słodyczy miodu i wyrazistej musztardy — delikatny, ale z charakterem.",
    pairing: "Top do kurczaka i klasycznego LAWASZA L.",
  },
  {
    emoji: "🌫️",
    name: "Wędzona Śliwka",
    description:
      "Lekko kwaśny, słodko-wędzony sos z głębokim aromatem dymu i nutą śliwki.",
    pairing: "Idealny do karkówki i bowli.",
  },
  {
    emoji: "🌶️",
    name: "Chili Ananas",
    description:
      "Słodki sos z pieczonych warzyw i ananasa z subtelną, rozgrzewającą pikantnością chili.",
    pairing: "Świetnie siada z mixem i Lava Fries.",
  },
  {
    emoji: "🧄",
    name: "Czosnkowy",
    description: "Klasyczny, intensywny, kremowy i uniwersalny. Pewniak dla większości ekipy.",
    pairing: "Dobry starter, gdy wchodzisz w markę pierwszy raz.",
  },
  {
    emoji: "🌋",
    name: "Piekielna Lawa",
    description:
      "Ekstremalnie ostry sos dla prawdziwych koneserów. Tutaj ostrość naprawdę wyprzedza smak.",
    pairing: "Bierz do XL, jeśli lubisz testować granice.",
  },
];

const stats = [
  { value: "100%", label: "Własna produkcja" },
  { value: "0", label: "Kompromisów" },
  { value: "24h", label: "Marynowania" },
];

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#historia", label: "Mięso" },
  { href: "#sosy", label: "Sosy" },
  { href: "#freeflow", label: "Voice" },
  { href: "#kontakt", label: "Kontakt" },
];

const INTRO_VIDEO_URL = "/video/intro.mp4";
const HEADER_LOGO_MARK_URL = "/image/Projekt bez nazwy.png";
const INTRO_PLAYED_KEY = "lawasz-intro-burn-played";
const INTRO_ANIMATION_MS = 3200;

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
    <div className={cn("flex items-center leading-none", compact ? "origin-left gap-3.5" : "gap-3") }>
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
        <div className="font-display text-3xl uppercase tracking-[0.26em] text-white sm:text-4xl">
          LAWA<span className="text-[color:var(--fire)]">SZ</span>
        </div>
        <div className="font-display -mt-1 text-xs uppercase tracking-[0.62em] text-white/70 sm:text-sm">
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
      viewport={{ once: true, amount: 0.35 }}
      className="max-w-3xl space-y-5"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--fire)]/25 bg-[color:var(--fire)]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-[color:var(--ember)]">
        <span className="h-2 w-2 rounded-full bg-[color:var(--fire)] shadow-[0_0_20px_rgba(255,106,0,0.8)]" />
        {eyebrow}
      </div>
      <div className="space-y-4">
        <h2 className="font-display text-5xl uppercase leading-none text-white sm:text-6xl lg:text-7xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function MenuCard({ category }: { category: MenuCategory }) {
  return (
    <motion.article
      variants={revealItem}
      className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--fire)]/40 hover:bg-white/[0.06]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="font-display text-3xl uppercase tracking-[0.12em] text-white">{category.title}</h3>
          <p className="text-sm leading-7 text-white/65">{category.description}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--gold)]">
          {category.badge}
        </span>
      </div>

      <div className="space-y-4">
        {category.items.map((item) => (
          <div key={`${category.title}-${item.name}`} className="group/row space-y-1">
            <div className="flex items-end gap-3 text-base text-white transition-colors group-hover/row:text-[color:var(--cream)]">
              <span className="shrink-0 font-medium">{item.name}</span>
              <span className="mb-1 h-px flex-1 border-b border-dotted border-white/20 transition-colors group-hover/row:border-[color:var(--fire)]/60" />
              <span className="shrink-0 font-semibold text-[color:var(--ember)]">{item.price}</span>
            </div>
            {item.note ? <p className="text-sm text-white/45">{item.note}</p> : null}
          </div>
        ))}
      </div>
    </motion.article>
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
    <div className="relative mx-auto flex aspect-[4/5] w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,106,0,0.12),rgba(255,106,0,0)_28%),radial-gradient(circle_at_center,rgba(255,149,0,0.14),transparent_45%),#121212] p-10 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.05),transparent)] opacity-40" />
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-[color:var(--gold)]/60 blur-md"
          style={{
            width: `${10 + (index % 3) * 6}px`,
            height: `${10 + (index % 3) * 6}px`,
            left: `${18 + index * 9}%`,
            bottom: `${8 + (index % 4) * 7}%`,
          }}
          animate={{ y: [-6, -42 - (index % 2) * 18], opacity: [0, 0.9, 0], x: [0, (index % 2 === 0 ? -8 : 8)] }}
          transition={{ duration: 2.8 + index * 0.15, ease: "easeOut", repeat: Number.POSITIVE_INFINITY, delay: index * 0.18 }}
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
              className={cn(
                "rounded-[45%] border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.24)]",
                "bg-gradient-to-r",
                gradient,
              )}
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

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ y: -4 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-[color:var(--fire)]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
    >
      <span aria-hidden="true" className="text-[color:var(--ember)]">↗</span>
      {label}
    </motion.a>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(() => hasPlayedIntroInSession());
  const [introPlaying, setIntroPlaying] = useState(() => !hasPlayedIntroInSession());
  const [introVideoEnabled, setIntroVideoEnabled] = useState(true);
  const [introVideoReady, setIntroVideoReady] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, reduceMotion ? 0 : 60]);

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

    const timeoutId = window.setTimeout(() => {
      setIntroPlaying(false);
      setIntroDone(true);

      try {
        window.sessionStorage.setItem(INTRO_PLAYED_KEY, "1");
      } catch {
        // no-op: brak dostępu do sessionStorage nie powinien zatrzymać UI
      }
    }, INTRO_ANIMATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [introPlaying]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
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
    <div className="relative overflow-x-hidden bg-[color:var(--dark)] text-[color:var(--cream)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.16),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(255,61,0,0.12),transparent_18%),linear-gradient(180deg,#0a0a0a_0%,#111_46%,#0a0a0a_100%)]" />
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-full border border-[color:var(--fire)]/60 bg-[#0a0a0a] px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
      >
        Przejdź do treści
      </a>

      {introDone ? (
        <>
          <header
            className={cn(
              "fixed inset-x-0 top-0 z-50 transition-all duration-300",
              scrolled ? "bg-[#090909]/78 backdrop-blur-2xl border-b border-white/10" : "bg-transparent",
            )}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <a href="#top" aria-label="LAWASZ KEBAB" className="transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]">
                <Logo compact />
              </a>
              <nav className="hidden items-center gap-7 text-sm font-medium text-white/70 md:flex">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]">
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/85 transition hover:border-[color:var(--fire)]/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] md:hidden"
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
                  href="tel:+48789969998"
                  className="inline-flex items-center rounded-full border border-[color:var(--fire)]/40 bg-[color:var(--fire)]/12 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,106,0,0.18)] transition hover:bg-[color:var(--fire)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  Zadzwoń
                </a>
              </div>
            </div>
          </header>
          <motion.button
            type="button"
            aria-label="Zamknij menu mobilne"
            initial={false}
            animate={{ opacity: mobileMenuOpen ? 1 : 0, pointerEvents: mobileMenuOpen ? "auto" : "none" }}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] md:hidden"
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
                  className="rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/84 transition hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        </>
      ) : null}

      <main id="main-content" className="relative z-10">
        <section id="top" className="relative isolate scroll-mt-28 min-h-screen">
          <motion.div style={{ y: heroParallax }} className="absolute inset-0">
            {introVideoEnabled ? (
              <video
                className={cn(
                  "h-full w-full object-cover object-center transition-opacity duration-700",
                  introVideoReady ? "opacity-100" : "opacity-0",
                )}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
                onCanPlay={() => setIntroVideoReady(true)}
                onError={() => {
                  setIntroVideoEnabled(false);
                  setIntroVideoReady(true);
                }}
              >
                <source src={INTRO_VIDEO_URL} type="video/mp4" />
              </video>
            ) : null}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                introVideoReady ? "opacity-0" : "opacity-100",
                "bg-[radial-gradient(circle_at_20%_20%,rgba(255,118,26,0.34),transparent_50%),radial-gradient(circle_at_78%_12%,rgba(255,56,0,0.26),transparent_42%),linear-gradient(165deg,#0f0c0a_0%,#1b100d_38%,#080808_100%)]",
              )}
            />
            <div className="absolute inset-0 bg-[linear-gradient(95deg,rgba(8,8,8,0.86)_16%,rgba(8,8,8,0.42)_52%,rgba(8,8,8,0.76)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,106,0,0.26),transparent_44%),linear-gradient(180deg,rgba(7,7,7,0.28)_0%,rgba(7,7,7,0.78)_84%)]" />
          </motion.div>

          {introPlaying ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-30 flex items-center justify-center px-6"
            >
              <div className="relative flex items-center justify-center">
                <motion.div
                  className="absolute -inset-20 rounded-full bg-[radial-gradient(circle,rgba(255,130,36,0.45),rgba(255,61,0,0.06)_55%,transparent_72%)] blur-3xl"
                  animate={{ opacity: [0.25, 0.95, 0.5, 0], scale: [0.85, 1.05, 1.18, 1.28], y: [22, -2, -22, -34] }}
                  transition={{ duration: INTRO_ANIMATION_MS / 1000, times: [0, 0.4, 0.78, 1], ease: "easeInOut" }}
                />
                <motion.div
                  animate={{
                    opacity: [1, 1, 0.78, 0],
                    y: [0, 0, -6, -24],
                    scale: [1, 1.04, 1.01, 0.95],
                    filter: [
                      "drop-shadow(0 0 14px rgba(255,125,25,0.58)) brightness(1)",
                      "drop-shadow(0 0 22px rgba(255,137,28,0.88)) brightness(1.24)",
                      "drop-shadow(0 0 10px rgba(255,98,14,0.46)) grayscale(0.35) contrast(1.22)",
                      "drop-shadow(0 0 3px rgba(255,92,0,0.16)) grayscale(1) contrast(1.4) brightness(0.62) blur(1px)",
                    ],
                  }}
                  transition={{ duration: INTRO_ANIMATION_MS / 1000, times: [0, 0.42, 0.8, 1], ease: easeOutExpo }}
                  className="relative"
                >
                  <Logo />
                </motion.div>
              </div>
            </motion.div>
          ) : null}

          {introDone ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, ease: easeOutExpo }}
                className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl gap-12 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:px-8"
              >
                <div className="max-w-4xl space-y-8 rounded-[2.2rem] border border-white/10 bg-black/25 p-6 backdrop-blur-sm sm:p-10 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.6, ease: easeOutExpo }}
                    className="inline-flex w-fit items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--fire)] shadow-[0_0_18px_rgba(255,106,0,0.9)]" />
                    Piekary Śląskie — Street Food Nowej Generacji
                  </motion.div>

                  <div className="space-y-6">
                    <motion.h1
                      initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      transition={{ delay: 0.8, duration: 1, ease: easeOutExpo }}
                      className="font-display text-7xl uppercase leading-[0.88] text-white sm:text-[7rem] lg:text-[9rem]"
                    >
                      <span className="fire-gradient-text">ŚWIADOMY</span>
                      <br />
                      STREET FOOD
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.72, ease: easeOutExpo }}
                      className="font-tagline text-2xl text-[color:var(--cream)]/90 sm:text-3xl"
                    >
                      Rzemieślnicze mięso. Autorski lawasz. Zero kompromisów.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.45, duration: 0.72, ease: easeOutExpo }}
                      className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg"
                    >
                      LAWASZ KEBAB to ciemny, ognisty i bezczelnie konkretny street food z Piekar Śląskich.
                      Mięso robione na miejscu, autorski lawasz, świeże dodatki i karta, która nie udaje niczego,
                      czym nie jest.
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.72, ease: easeOutExpo }}
                    className="flex flex-col gap-4 sm:flex-row"
                  >
                    <a
                      href="#menu"
                      className="inline-flex items-center justify-center rounded-full bg-[color:var(--fire)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-white shadow-[0_16px_40px_rgba(255,106,0,0.35)] transition hover:translate-y-[-2px] hover:bg-[color:var(--lava)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                    >
                      Zobacz Menu
                    </a>
                    <a
                      href="#historia"
                      className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.26em] text-white/88 transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                    >
                      Nasza Historia
                    </a>
                  </motion.div>
                </div>

                <motion.aside
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.55, duration: 0.72, ease: easeOutExpo }}
                  className="hidden rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-md lg:block"
                >
                  <div className="space-y-5">
                    <Logo />
                    <div className="space-y-3 text-sm leading-7 text-white/72">
                      <p>
                        <span className="font-semibold text-white">Slogan:</span> Świadomy street food. Zero kompromisów.
                      </p>
                      <p>
                        <span className="font-semibold text-white">Signature:</span> Mięso naszej produkcji zawinięte w autorski LAWASZ.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-white/45">Adres</div>
                        <div className="mt-2 font-medium text-white">ul. Księdza Józefa Krupy 11</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-white/45">Telefon</div>
                        <div className="mt-2 font-medium text-white">+48 789 969 998</div>
                      </div>
                    </div>
                  </div>
                </motion.aside>
              </motion.div>

              <motion.a
                href="#menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              >
                Scroll
                <span className="flex h-12 w-7 items-start justify-center rounded-full border border-white/16 p-1.5">
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[color:var(--fire)]" />
                </span>
              </motion.a>
            </>
          ) : null}
        </section>

        <section id="menu" className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl space-y-14">
            <SectionHeading
              eyebrow="Menu"
              title="OGIEŃ NA KARCIE"
              subtitle="Pełne menu LAWASZ KEBAB w ciemnej, surowej oprawie. Czytelnie, szybko i dokładnie tak, jak powinno wyglądać dobre streetfoodowe menu online."
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3"
            >
              {menuCategories.map((category) => (
                <MenuCard key={category.title} category={category} />
              ))}
            </motion.div>
          </div>
        </section>

        <section id="historia" className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
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
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--ember)]">
                  Mięso naszej produkcji
                </div>
                <h2 className="font-display text-5xl uppercase leading-none text-white sm:text-6xl lg:text-7xl">
                  ROBIMY TO
                  <br />
                  PO SWOJEMU
                </h2>
                <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                  Bez hurtowej taśmy. Bez gotowców. LAWASZ KEBAB opiera smak na mięsie własnej produkcji,
                  ręcznym nakładaniu na rożen i autorskiej marynacie, która robi robotę jeszcze zanim ogień zrobi resztę.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ delay: 0.12 * index, duration: 0.65, ease: easeOutExpo }}
                    className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="font-display text-4xl uppercase text-[color:var(--fire)]">{stat.value}</div>
                    <div className="mt-2 text-sm uppercase tracking-[0.22em] text-white/58">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Mięso przygotowywane na miejscu, zamiast kopiować hurtowe schematy.",
                  "Ręczne nakładanie warstw, żeby zachować strukturę i soczystość.",
                  "Autorska marynata z charakterem, nie z katalogu producenta.",
                  "Lawasz, świeże warzywa i sosy spięte w jedną, konsekwentną markę.",
                ].map((line) => (
                  <div key={line} className="flex gap-3 rounded-[1.5rem] border border-white/10 bg-[#141414] p-4 text-sm leading-7 text-white/72">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[color:var(--fire)] shadow-[0_0_15px_rgba(255,106,0,0.85)]" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="sosy" className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl space-y-14">
            <SectionHeading
              eyebrow="Sosy"
              title="DOBIERZ SWÓJ Ogień"
              subtitle="Karta sosów nie jest dodatkiem do obowiązku. To część charakteru marki — od słodkiego balansu po totalną, piekielną przesadę."
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-5"
            >
              {sauces.map((sauce) => (
                <motion.article
                  key={sauce.name}
                  variants={revealItem}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-[color:var(--fire)]/40 hover:bg-white/[0.06]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[linear-gradient(90deg,var(--fire),var(--gold))] transition duration-300 group-hover:scale-x-100" />
                  <div className="space-y-4">
                    <div className="text-4xl">{sauce.emoji}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{sauce.name}</h3>
                      <p className="mt-3 text-sm leading-7 text-white/68">{sauce.description}</p>
                    </div>
                    <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[color:var(--ember)]">
                      {sauce.pairing}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="freeflow" className="scroll-mt-28 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, ease: easeOutExpo }}
              className="overflow-hidden rounded-[2.2rem] border border-[color:var(--fire)]/25 bg-[linear-gradient(135deg,rgba(255,106,0,0.16),rgba(255,61,0,0.08)_32%,rgba(20,20,20,0.96)_72%)] p-8 shadow-[0_30px_100px_rgba(255,106,0,0.14)] sm:p-10 lg:p-12"
            >
              <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--gold)]">
                    FreeFlow Voice to Order
                  </div>
                  <div className="space-y-4">
                    <h2 className="font-display text-5xl uppercase leading-none text-white sm:text-6xl">
                      Ten prototyp jest gotowy na voice commerce.
                    </h2>
                    <p className="max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
                      To nie musi być tylko wizytówka. LAWASZ KEBAB może dostać wersję rozwojową z FreeFlow Voice to Order —
                      zamawianiem głosowym, szybszym kontaktem z klientem i nowym formatem obsługi poza social mediami.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      "Zamówienia głosowe bez tarcia",
                      "Lepsza konwersja z ruchu mobilnego",
                      "Silniejsza pozycja marki poza socialami",
                    ].map((item) => (
                      <div key={item} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/72">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {[
                    ["01", "Landing, który sprzedaje", "Menu, storytelling, SEO i jasne CTA zamiast samego feedu social media."],
                    ["02", "Warstwa operacyjna", "Po podpięciu FreeFlow strona może przejąć realne zamówienia i pytania głosowe."],
                    ["03", "Skalowanie marki", "Jeden spójny brand experience od pierwszego kliknięcia po finalne zamówienie."],
                  ].map(([number, title, copy]) => (
                    <div key={number} className="rounded-[1.6rem] border border-white/10 bg-black/25 p-5">
                      <div className="font-display text-3xl text-[color:var(--fire)]">{number}</div>
                      <div className="mt-2 text-lg font-semibold text-white">{title}</div>
                      <p className="mt-2 text-sm leading-7 text-white/68">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer id="kontakt" className="relative z-10 border-t border-white/10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <Logo />
            <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
              Świadomy street food. Zero kompromisów. Prototyp strony pokazujący, jak LAWASZ KEBAB może wyglądać online —
              nowocześnie, wyraziście i gotowo do rozwoju.
            </p>
            <div className="space-y-3 text-white/78">
              <p>ul. Księdza Józefa Krupy 11, Piekary Śląskie</p>
              <p>
                <a href="tel:+48789969998" className="transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]">
                  +48 789 969 998
                </a>
              </p>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-display text-2xl uppercase tracking-[0.16em] text-white">Social</h3>
              <div className="flex flex-wrap gap-3">
                <SocialLink href="https://www.facebook.com/LAWAszKebab" label="Facebook · @LAWAszKebab" />
                <SocialLink href="https://www.instagram.com/lawasz.kebab/" label="Instagram · @lawasz.kebab" />
                <SocialLink href="https://www.tiktok.com/@lawaszkebab" label="TikTok · @lawaszkebab" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl uppercase tracking-[0.16em] text-white">Kontakt i dojazd</h3>
              <div className="space-y-3 rounded-[1.8rem] border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/72">
                <p>Najprościej: kliknij, zadzwoń albo odpal mapę i wpadaj po lawasza.</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Ksi%C4%99dza+J%C3%B3zefa+Krupy+11%2C+Piekary+%C5%9Al%C4%85skie"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-[color:var(--ember)] transition hover:text-[color:var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
                >
                  Otwórz w Google Maps <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


















