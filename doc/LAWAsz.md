LAWASZ KEBAB — Website Prototype Spec
Brief dla Claude Code
KONTEKST PROJEKTU
LAWASZ KEBAB to nowa marka street food z Piekar Śląskich (Śląsk, Polska). Nie mają strony internetowej — tylko social media (FB, IG, TikTok). To osłabia ich SEO i konwersję.
Strona ma być prototypem do prezentacji właścicielowi — wizytówką moich (developera) umiejętności. Równocześnie chcę zaproponować im integrację z FreeFlow Voice to Order (system zamawiania głosowego).
Styl marki: ciemny, ognisty, nowocześnie-surowy. Hasło: "Świadomy street food. Zero kompromisów."
DANE FIRMY (do użycia w treściach)
text

Nazwa: LAWASZ KEBAB
Adres: ul. Księdza Józefa Krupy 11, Piekary Śląskie
Telefon: +48 789 969 998
Facebook: @LAWAszKebab
Instagram: @lawasz.kebab
TikTok: @lawaszkebab
Slogan główny: "Świadomy street food. Zero kompromisów."
Slogan dodatkowy: "Mięso naszej produkcji zawinięte w autorski LAWASZ"
PEŁNE MENU (aktualne ceny)
LAWASZ L (mięso 140g, autorski lawasz, świeże warzywa, sosy)
Kurczak — 28,00 zł
Karkówka — 30,00 zł
Mix — 30,00 zł
LAWASZ XL (mięso 200g, autorski lawasz, świeże warzywa, sosy)
Kurczak — 35,00 zł
Karkówka — 37,00 zł
Mix — 38,00 zł
LAWASZ BOWL (porcja obiadowa, mięso 200g, świeże warzywa, sosy)
Kurczak — 34,00 zł
Karkówka — 36,00 zł
Mix — 36,00 zł
Frytki 150g — 6,00 zł
FRYTY 200g (smażone na tłuszczu wołowym)
Klasyczne frytki — 14,00 zł
Do wyboru: ketchup lub mayo
LAVA FRIES (doładowane fryty)
Frytki doładowane (150g frytek, gorący sos cheddar, czerwona cebula, przyprawy) — 20,00 zł

80g Mięsa — 8,00 zł

Jalapeño — 2,00 zł
NAPOJE
Fritz Napoje 330ml — 10,00 zł
Coca-Cola 330ml — 6,00 zł
Ayran 250ml — 6,00 zł
DODATKI
Ogórek kiszony — 2,00 zł
Jalapeño — 2,00 zł
Ser feta — 3,00 zł
SOSY (opis smaku)
Musztardowo-Miodowy — Harmonia słodyczy miodu i wyrazistej musztardy - delikatny, a jednocześnie charakterystyczny.
Wędzona Śliwka — Lekko kwaśny, słodko-wędzony sos o głębokim, dymnym aromacie dopełnionym nutą śliwki.
Chili Ananas — Słodki sos z pieczonych warzyw i ananasa z subtelną, rozgrzewającą pikatnością chili.
Czosnkowy — Klasyczny, intensywny sos czosnkowy - kremowy, aromatyczny i uniwersalny.
Piekielna Lawa — Ekstremalnie ostry sos tylko dla prawdziwych koneserów - tu ostrość zdecydowanie wyprzedza smak.
PAKOWANIE NA WYNOS
Torba na wynos (1szt.) — 2,00 zł
Opakowanie na wynos (1szt.) — 1,00 zł
DESIGN SYSTEM
Paleta kolorów
CSS

--fire: #FF6A00; /* główny akcent — ogień /
--ember: #FF9500; / ciepły amber /
--lava: #FF3D00; / intensywny czerwony ogień /
--gold: #FFB800; / złoty highlight /
--dark: #0A0A0A; / główne tło /
--dark2: #141414; / sekcje/karty /
--brick: #1A1210; / odcień cegły /
--cream: #FFF5E8; / ciepła biel na tekst /
--white: #FFFFFF;
--gray: #888888; / tekst drugorzędny */
Typografia
Display/Nagłówki: Bebas Neue (bold, uppercase, letter-spacing)
Body text: DM Sans (400, 500, 700)
Akcenty/Tagline: Playfair Display italic
Logo: "LAWA" w białym + "SZ" w kolorze --fire, "KEBAB" pod spodem
Ton komunikacji
Luźny, pewny siebie, zero korporacyjnego bełkotu. Krótkie hasła. Emoji w menu OK. Styl jak dobrze prowadzony Instagram street foodu.
STRUKTURA STRONY (sekcje i flow)
5.1 HERO (fullscreen)
Tło: Three.js scena — ceglana ściana z PBR teksturą + normal mapa + dynamiczne point light (kolor ognia, pulsujące)
Na ceglanej ścianie: 3D kręcący się baton mięsa na szpikulcu z ogniem u dołu (particle system)
Overlay z treścią:
Badge: "Piekary Śląskie — Street Food Nowej Generacji"
H1: "ŚWIADOMY STREET FOOD" (gradient fire text)
Tagline italic: "Rzemieślnicze mięso. Autorski lawasz. Zero kompromisów."
CTA: "Zobacz Menu" + "Nasza Historia"
Scroll indicator na dole
5.2 MENU
Ciemne karty/sekcje z menu
Dotted leaders między nazwą a ceną (jak w klasycznej karcie restauracyjnej)
Hover effects na pozycjach
Podział na kategorie: Lawasz L, XL, Bowl, Fryty, Lava Fries, Napoje, Dodatki
5.3 MIĘSO NASZEJ PRODUKCJI
Split layout: lewa strona — wizual (animowany rożen lub zdjęcie), prawa — tekst
Kluczowy przekaz: 100% własna produkcja, ręczne nakładanie, autorska marynata
Statystyki: "100% Własna produkcja" / "0 Kompromisów" / "24h Marynowania"
5.4 SOSY — REKOMENDOWANE POŁĄCZENIA
Karuzela/grid kart z sosami
Każda karta: emoji + nazwa + opis smaku
Hover: top-border reveal w kolorze fire
5.5 KONTAKT / FOOTER
Adres, telefon, linki social media
Mapa? (opcjonalnie)
"Świadomy street food. Zero kompromisów."
THREE.JS — SPECYFIKACJA TECHNICZNA
6.1 Ceglana ściana (tło hero)
Podejście: PBR z prawdziwą teksturą
Potrzebne pliki w /public/textures/:
brick_diffuse.jpg — tileable brick texture (1024x1024)
brick_normal.jpg — normal mapa do symulacji głębi fug
Opcjonalnie: brick_roughness.jpg
Źródła darmowych PBR tekstur:
https://ambientcg.com (szukaj "Bricks" → pobierz 1K JPG)
https://polyhaven.com/textures (szukaj "brick wall")
https://3dtextures.me
text

Setup:

THREE.PlaneGeometry(20, 12) jako tło
MeshStandardMaterial z map, normalMap, roughnessMap
PointLight w kolorze #FF6A00 (fire), intensity pulsujący sinusoidalnie
Opcjonalnie: drugi PointLight #FF3D00 z drugiej strony
Repeat texture: texture.wrapS = texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(4, 3) — dostosuj do proporcji
Fallback proceduralny: jeśli tekstury nie załadują się, generuj cegłę na canvas (jak w prototypie).
6.2 Baton mięsa 3D
Podejście: stos geometrii z noise displacement
text

Struktura:

Szpikulec — CylinderGeometry(0.03, 0.03, 5) w kolorze metalicznym
Mięso — stos 8-12 cylindrów o różnych średnicach:
Środkowe największe (r=0.7-0.8)
Górne/dolne mniejsze (r=0.3-0.5)
Każdy cylinder z losowym obrotem i displacement na wierzchołkach (noise)
Materiał: MeshStandardMaterial, kolor ciemnobrązowy #5C2E0E
roughness: 0.9, metalness: 0.1
Vertex displacement: pętla po geometry.attributes.position,
dodaj simplex noise * 0.05-0.15 do każdego vertex radialnie
Tłuste warstwy — co 2-3 cylindry cieńsza warstwa w jaśniejszym kolorze
Przypalone krawędzie — ciemniejsze na zewnątrz (gradient w shaderze lub vertex colors)
Animacja:

Obrót: mesh.rotation.y += 0.003 (wolny, stały obrót)
Lekkie kołysanie: rotation.z = sin(time * 0.5) * 0.02
Oświetlenie:

PointLight #FF4500 od dołu (ogień) — intensity oscyluje 1.5-2.5
PointLight #FF8C00 z boku — delikatny fill
AmbientLight 0x1a1a1a — minimalne, żeby reszta była ciemna
6.3 Ogień i cząsteczki
text

System 1: Płomienie pod mięsem

200 cząsteczek, AdditiveBlending
Pozycja startowa: skupione pod bałonem (y = dół szpikulca, x/z ±0.3)
Ruch: w górę (vy = 0.01-0.03), lekko na boki (sinusoida)
Kolor: gradient od #FF3D00 (dół) → #FF9500 → #FFD700 (góra) → zanikają
Rozmiar: maleje z wysokością
Shader: miękkie krawędzie (smoothstep w fragment shader)
System 2: Iskry / embery

30-50 większych, jaśniejszych cząsteczek
Wylatują wyżej, wolniej zanikają
Kolor: #FFB800-#FFF5E8 (gorące żółto-białe)
Ruch: bardziej chaotyczny, z "podrzutami"
6.4 Performance
text

WAŻNE:

pixelRatio: Math.min(window.devicePixelRatio, 2)
Tekstury max 1024x1024
Geometria mięsa: max 2000 trójkątów łącznie
Particles: max 300 (ogień) + 50 (iskry)
Na mobile: zmniejsz particle count o 50%
requestAnimationFrame + visibility check (nie renderuj gdy karta nieaktywna)
Dispose() geometrii i tekstur przy unmount
ANIMACJE (scroll-triggered)
text
Narzędzie: Intersection Observer (vanilla) lub Framer Motion (jeśli React/Next.js)

Hero:

Badge: fadeUp z delay 0.5s
H1: scale 0.9 → 1.0 + blur 10px → 0 (1s, delay 0.8s)
Tagline: fadeUp delay 1.2s
CTA buttons: fadeUp delay 1.8s
Three.js scena: od razu aktywna, parallax z scrollem
Menu:

Cała sekcja: fadeUp
Kategorie: stagger 0.15s każda
Pozycje menu: fadeUp indywidualnie z krótkim stagger
Mięso:

Wizual: slideIn from left
Tekst: slideIn from right
Stats: fadeUp ze stagger
Sosy:

Tytuł: fadeUp
Karty: stagger fadeUp 0.1s każda
Nav:

Scroll > 80px: backdrop blur zwiększa się, tło ciemnieje

Logo zawsze widoczne
TECH STACK — REKOMENDACJA
Opcja A: Next.js + React (rekomendowane)
text

Next.js 14+ (App Router)

React Three Fiber (@react-three/fiber) + Drei (@react-three/drei)

Tailwind CSS

Framer Motion (animacje scroll)

Struktura:
/app
page.tsx
layout.tsx
globals.css
/components
Hero.tsx (Three.js canvas + overlay)
ThreeScene.tsx (cegła + mięso + ogień)
MeatSpit.tsx (geometria mięsa)
FireParticles.tsx (system cząsteczek)
BrickWall.tsx (tło ceglane)
Menu.tsx
MeatSection.tsx
Sauces.tsx
Footer.tsx
/public
/textures
brick_diffuse.jpg
brick_normal.jpg

Opcja B: Vanilla HTML + Three.js (prostsze, jeden plik)

text

Jeden plik HTML
Three.js z CDN
CSS custom properties
Vanilla JS (Intersection Observer)
Łatwiejszy do prezentacji (otwórz plik w przeglądarce)
Rekomendacja: Opcja A jeśli chcesz to deployować (Vercel) i pokazać profesjonalnie. Opcja B jeśli potrzebujesz szybki prototyp do przeniesienia.
TEKSTURY DO POBRANIA (przed rozpoczęciem)
Przed startem w Claude Code, pobierz i umieść w /public/textures/:
Brick wall PBR z ambientcg.com:
Wejdź na https://ambientcg.com/list?type=Material&q=brick
Wybierz np. "Bricks076" lub "Bricks052" (czerwona cegła)
Pobierz w rozdzielczości 1K (JPG)
Potrzebujesz: *_Color.jpg (diffuse) + *_NormalGL.jpg (normal)
Opcjonalnie: *_Roughness.jpg
Alternatywne źródła:
https://polyhaven.com/textures → szukaj "brick"
https://3dtextures.me → sekcja "Brick Wall"
PROMPT STARTOWY DLA CLAUDE CODE
Wklej to na start sesji w Claude Code:
text
Buduję prototyp strony internetowej dla LAWASZ KEBAB — lokalnego street foodu z Piekar Śląskich.

Kluczowe wymagania:

Next.js 14 + React Three Fiber + Tailwind + Framer Motion
Hero section z Three.js: ceglana ściana (PBR texture z normal mapą) + 3D kręcący się baton mięsa na szpikulcu + system cząsteczek ognia pod mięsem + dynamiczne oświetlenie w kolorze ognia
Scroll-triggered animacje (fadeUp, slideIn, stagger)
Sekcje: Hero → Menu → Mięso Naszej Produkcji → Sosy → Kontakt
Paleta: ciemne tło (#0A0A0A), akcenty ognia (#FF6A00), Bebas Neue + DM Sans
Mobile-first, performance-optimized Three.js
Tekstury PBR cegły mam w /public/textures/ (brick_diffuse.jpg + brick_normal.jpg).

Zacznij od komponentu ThreeScene.tsx z ceglaną ścianą i batonem mięsa. Potem Hero.tsx z overlayem. Potem reszta sekcji.

Pełna specyfikacja projektu jest w pliku LAWASZ_SPEC.md — przeczytaj go przed rozpoczęciem.
NA CO UWAŻAĆ (pułapki)
Three.js + Next.js SSR — React Three Fiber musi być renderowany client-side ("use client" na komponentach z Canvas). Użyj dynamic import z ssr: false jeśli problemy.
Tekstury nie ładują się — sprawdź ścieżki. W Next.js pliki z /public są dostępne jako /textures/brick_diffuse.jpg (bez /public).
Mobile performance — testuj na prawdziwym telefonie. Zmniejsz particle count, ogranicz shadow mapy, daj dpr={[1, 1.5]} w R3F Canvas.
Uncanny valley mięsa — jeśli 3D mięso wygląda dziwnie, lepiej iść w stylizowany look (mocne oświetlenie, uproszczona geometria) niż próbować fotorealizmu.
Font loading — Bebas Neue i DM Sans z Google Fonts. Dodaj font-display: swap żeby tekst nie znikał na czas ładowania.
Scroll jank — Three.js canvas ma być position: fixed z pointer-events: none. Reszta strony scrolluje nad nim. Nie animuj Three.js sceny na każdy pixel scrolla — użyj throttlingu lub lerp.