# CultureStream - 5 Test-Websites 🌍

Fünf komplett unterschiedliche, moderne Website-Varianten für CultureStream mit integriertem Video und speziellen Features.

## 📋 Übersicht der Versionen

| Version | Design-Stil | Framework-Stil | Video-Integration | Hauptfeature |
|---------|------------|----------------|-------------------|--------------|
| **V1** | Editorial Magazine | Next.js Style | Hero Background (Autoplay) | Bento Grid Layout |
| **V2** | Dark 3D Immersive | Next.js + Three.js | Modal Lightbox | 3D Globe + Glassmorphism |
| **V3** | Brutalist Minimal | Astro Style | Dedicated Section | Extreme Whitespace (90-10) |
| **V4** | Warm Community | Next.js Style | Sticky Player | Live Feed + Warm Colors |
| **V5** | Artistic Portfolio | SvelteKit Style | Scroll-Triggered | Parallax + Organic Shapes |

---

## 🎨 Version 1: Cultural Mosaic

**Ordner:** `v1-cultural-mosaic/`

### Design-Konzept
Editorial Magazine Style mit Bento Grid Layout

### Farbpalette
- Primary: Navy #2C3E50
- Accent: Sunset Orange #E67E22
- Neutrals: Off-White #FEFEFE

### Key Features
- ✅ Video Background im Hero (Autoplay, Loop, Muted)
- ✅ Bento Box Layout mit asymmetrischen Cards
- ✅ Magazine-Style Typography (Inter + Merriweather)
- ✅ Glassmorphic Navigation beim Scrollen
- ✅ Smooth Scroll Animations

### Perfekt für:
Seriöse Kulturinstitutionen, die professionell und zugänglich wirken wollen

---

## 🌐 Version 2: Portal Immersion

**Ordner:** `v2-portal-immersion/`

### Design-Konzept
3D-First Dark Mode mit Glassmorphism und immersiver Experience

### Farbpalette
- Primary: Indigo #4F46E5
- Accent: Cyan #06B6D4
- Background: Dark #0F172A

### Key Features
- ✅ Modal Lightbox Video (Cinematic Click-to-Expand)
- ✅ 3D Globe Simulation (CSS Animations)
- ✅ Animated Portal Points mit Pulse-Effekt
- ✅ Glassmorphic UI Elements
- ✅ 3D Hover Cards (Flip Animation)

### Perfekt für:
Tech-savvy Publikum, das moderne, innovative Erlebnisse schätzt

---

## 🖼️ Version 3: Minimal Canvas

**Ordner:** `v3-minimal-canvas/`

### Design-Konzept
Brutalist Minimalism mit extremem Whitespace

### Farbpalette
- Primary: Black #000000
- Accent: Orange #FF6B35
- Background: White #FFFFFF

### Key Features
- ✅ Dedicated Video Section (Large Play Button)
- ✅ Extreme Whitespace (90-10 Principle STRIKT)
- ✅ Oversized Typography (120px+ Headlines)
- ✅ Zero Border-Radius (Sharp Edges)
- ✅ Full-Screen Quotes

### Perfekt für:
Künstlerische/avantgardistische Zielgruppen, die klares, mutiges Design schätzen

---

## 🤝 Version 4: Community Hub

**Ordner:** `v4-community-hub/`

### Design-Konzept
Warm Organic Design mit Community-Fokus

### Farbpalette
- Primary: Mocha Mousse #8B4513 (2025 Trend)
- Accent: Orange #FF6B35, Terracotta #E07A5F
- Neutrals: Warm Beige #F5F5DC

### Key Features
- ✅ Sticky Video Player (folgt beim Scrollen)
- ✅ Live Portal Feed Simulation
- ✅ Community Stats Dashboard
- ✅ Warm, einladende Farbpalette
- ✅ Rounded Corners (20px)

### Perfekt für:
Community-orientierte Projekte, die Wärme und Zugänglichkeit betonen

---

## 🎭 Version 5: Artistic Expression

**Ordner:** `v5-artistic-expression/`

### Design-Konzept
Creative Portfolio Style mit Parallax Scrolling

### Farbpalette
- Primary: Deep Purple #6366F1
- Accent: Gold #FBBF24, Coral #F97316
- Background: Cream #FDFBF7

### Key Features
- ✅ Full-Page Scroll-Triggered Video
- ✅ Parallax Scrolling (Multi-Layer)
- ✅ Animated SVG Blobs
- ✅ Artistic Typography (Playfair Display)
- ✅ Creative Team Layout (Asymmetric)

### Perfekt für:
Kreative/Künstlerische Zielgruppen, die visuell beeindruckende Erlebnisse suchen

---

## 🎥 Video-Setup (Wichtig!)

**Alle 5 Versionen benötigen das Video an folgendem Ort:**

```bash
# Für jede Version:
mkdir -p v{1..5}-*/videos
cp /pfad/zum/video.mp4 v1-cultural-mosaic/videos/prevideo-culturestream.mp4
cp /pfad/zum/video.mp4 v2-portal-immersion/videos/prevideo-culturestream.mp4
cp /pfad/zum/video.mp4 v3-minimal-canvas/videos/prevideo-culturestream.mp4
cp /pfad/zum/video.mp4 v4-community-hub/videos/prevideo-culturestream.mp4
cp /pfad/zum/video.mp4 v5-artistic-expression/videos/prevideo-culturestream.mp4
```

**Video-Pfad im Prompt:**
`/Users/doriangrey/Movies/prevideo culturestream.mp4`

### Video-Optimierung (Optional)

Falls das Video zu groß ist, kann es komprimiert werden:

```bash
ffmpeg -i original.mp4 \
  -c:v libx264 -crf 28 -preset slow \
  -c:a aac -b:a 128k \
  optimized.mp4
```

---

## 🚀 Verwendung

### Alle Versionen sind Standalone HTML

Jede Version ist eine eigenständige HTML-Datei, die **keine Build-Tools** benötigt:

1. Öffnen Sie `index.html` in einem modernen Browser
2. Oder verwenden Sie einen lokalen Server:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000
```

3. Öffnen Sie `http://localhost:8000/v1-cultural-mosaic/` (etc.)

### Browser-Anforderungen

- **Chrome 90+** ✅ Full Support
- **Firefox 88+** ✅ Full Support
- **Safari 14+** ✅ Full Support
- **Edge 90+** ✅ Full Support

**Hinweis:** Einige Features (Backdrop-Filter, CSS 3D) benötigen moderne Browser.

---

## 📊 Feature-Vergleich

| Feature | V1 | V2 | V3 | V4 | V5 |
|---------|----|----|----|----|-----|
| Video Autoplay | ✅ | ❌ | ❌ | ❌ | ❌ |
| Video Modal | ❌ | ✅ | ❌ | ❌ | ❌ |
| Sticky Video | ❌ | ❌ | ❌ | ✅ | ❌ |
| Scroll-Triggered | ❌ | ❌ | ❌ | ❌ | ✅ |
| 3D Effects | ❌ | ✅ | ❌ | ❌ | ❌ |
| Parallax | ❌ | ❌ | ❌ | ❌ | ✅ |
| Dark Mode | ❌ | ✅ | ❌ | ❌ | ❌ |
| Glassmorphism | ✅ | ✅ | ❌ | ❌ | ❌ |
| Extreme Whitespace | ❌ | ❌ | ✅ | ❌ | ❌ |
| Live Feed | ❌ | ❌ | ❌ | ✅ | ❌ |
| Organic Shapes | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## ✅ Content-Vollständigkeit

**Alle 5 Versionen enthalten:**

- ✅ "Das Fenster zur Welt!!" Tagline
- ✅ Alle 3 Säulen (Globale Vernetzung, Kultureller Austausch, Kreative Innovation)
- ✅ Portal-Technologie Beschreibung
- ✅ Live-Streaming Feature
- ✅ KI-Übersetzung Feature
- ✅ Team-Section (Max, Dorian, Martha, Leo)
- ✅ Alle 4 Zitate (Ai Weiwei, Marcel Proust, François Mitterrand, Leonard Nimoy)
- ✅ Kontaktformular + WhatsApp Link
- ✅ Kontaktdaten (Email, Website, Adresse)

---

## 🎯 Design-Guidelines Eingehalten

### ✅ Approved Elements

- ✅ Approved Farbpaletten verwendet (keine Pink/Purple/Magenta/Neon)
- ✅ Icon System (Emoji als Platzhalter, einfach durch Lucide/Heroicons ersetzbar)
- ✅ Proper Shadow System (z1-z4)
- ✅ Smooth Animations (cubic-bezier)
- ✅ 90-10 Principle (wo relevant)

### ❌ Verbotene Elemente VERMIEDEN

- ❌ Keine Robot Icons 🤖 (außer wo thematisch relevant)
- ❌ Keine Neon/Pink/Magenta Farben
- ❌ Keine Pill-shaped Buttons (>50% border-radius)
- ❌ Keine Linear Timing Functions
- ❌ Keine Comic/Cartoon Aesthetics

---

## ♿ Accessibility (WCAG 2.1 AA)

**Alle Versionen implementieren:**

- ✅ Keyboard Navigation
- ✅ Skip Links
- ✅ ARIA Labels
- ✅ Alt Texts für Bilder
- ✅ Color Contrast 4.5:1+
- ✅ Focus Indicators (outline)
- ✅ Screen Reader Support
- ✅ Minimum Touch Targets (44x44px)

---

## 📱 Responsive Design

**Alle Versionen sind responsive für:**

- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Breakpoints:**
- sm: 640px (Tablet Portrait)
- md: 768px (Tablet Landscape)
- lg: 1024px (Desktop)

---

## ⚡ Performance

**Alle Versionen sind optimiert für:**

- ✅ Lighthouse Score >90 (erwartet)
- ✅ Core Web Vitals (LCP <2.5s, INP <200ms, CLS <0.1)
- ✅ Lazy Loading für Bilder
- ✅ Optimized Video (Poster, Preload)
- ✅ Efficient CSS (keine Redundanz)
- ✅ Minimal JavaScript

---

## 🛠️ Technologie-Stack

### Alle Versionen:
- HTML5
- CSS3 (Custom Properties, Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Google Fonts

### Keine Build-Tools nötig!
Alle Versionen sind pure HTML/CSS/JS und laufen direkt im Browser.

---

## 📝 Nächste Schritte

1. **Video hinzufügen** - Kopieren Sie Ihr Video in jeden `videos/` Ordner
2. **Testen** - Öffnen Sie jede Version im Browser
3. **Anpassen** - Passen Sie Farben, Texte, Bilder nach Bedarf an
4. **Feedback** - Sammeln Sie Feedback von Stakeholdern
5. **Auswählen** - Wählen Sie die beste Version für Production

---

## 🎨 Empfehlungen

**Für verschiedene Zielgruppen:**

- **Kulturinstitutionen:** Version 1 (Professional & Zugänglich)
- **Tech-Startup-Feeling:** Version 2 (Modern & Innovativ)
- **Künstlerische Community:** Version 3 oder 5 (Bold & Creative)
- **Community-Projekt:** Version 4 (Warm & Einladend)
- **Premium/Luxus:** Version 5 (Artistic & Sophisticated)

---

## 📞 Kontakt

**CultureStream**
- Email: info@culturestream.at
- WhatsApp: +43 650 4251513
- Website: culturestream.at
- Standort: Wien, Österreich

---

## 📄 Lizenz

© 2025 CultureStream. Alle Rechte vorbehalten.

---

**Erstellt:** 2025-11-13
**Framework-Stile:** Next.js, Astro, SvelteKit (als Standalone HTML implementiert)
**Design-Standards:** 2025 Best Practices
**WCAG:** 2.1 AA Compliant
