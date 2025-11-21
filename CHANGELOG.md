# Changelog

Alle wesentlichen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

---

## [Unreleased] - Mobile Development Branch

### Branch: `claude/improve-website-design-013HHSt2Jf2X9un7HQdqs52w`

---

## [2.0.0] - 2025-11-21 - Design-Modernisierung 2025

### 🎨 Design-Überarbeitung (Breaking Changes)

#### Logo-Modernisierung
- **CHANGED:** Logo-Größe von 64px auf 120px (Desktop) erhöht
- **CHANGED:** Logo-Größe auf Tablet: 80px
- **CHANGED:** Logo-Größe auf Mobile: 64px (wie vorher)
- **CHANGED:** Border-Radius von 12px auf 24px erhöht
- **ADDED:** Professionelle Box-Shadow mit Primary-Color-Tint
- **ADDED:** Glow-Effekt beim Hover (Blur 20px, Opacity 0.3)
- **ADDED:** Rotation-Animation beim Hover (2deg)
- **ADDED:** Scale-Transform beim Hover (1.05)
- **ADDED:** Neue CSS-Klasse `.logo-container`

#### Typografie
- **CHANGED:** Font-Family von Arial auf Inter umgestellt
- **ADDED:** Google Fonts Import für Inter (Weights 300-800/900)
- **CHANGED:** Font-Weight für Headlines von 700 auf 800 erhöht
- **CHANGED:** Letter-Spacing für große Überschriften: -0.03em
- **ADDED:** Font-Smoothing: Antialiased für alle Plattformen
- **CHANGED:** Line-Height von standard auf 1.6

#### Buttons & CTAs
- **CHANGED:** Background von Flat-Color auf Gradient umgestellt
- **ADDED:** 135° Linear-Gradient (Primary → Secondary)
- **ADDED:** Shine-Effekt beim Hover (weiße Linie)
- **ADDED:** Box-Shadow mit Primary-Color (4px → 8px beim Hover)
- **CHANGED:** Border-Radius von 5px auf 12px erhöht
- **CHANGED:** Padding erhöht: 10px→12px (vertikal), 20px→24px (horizontal)
- **CHANGED:** Transition auf Cubic-Bezier mit 0.4s Duration
- **ADDED:** TranslateY(-3px) beim Hover

#### Hero-Section
- **CHANGED:** Background-Gradient von Linear (top→bottom) auf 135° Diagonal
- **ADDED:** Drei-Farben-Gradient statt Zwei-Farben
- **CHANGED:** Accent-Color aufgehellt (#f8eee2 → #f8f6f3)
- **ADDED:** Zusätzliche Farbe #fff5eb für smooth transition
- **CHANGED:** Padding erhöht auf 80px (vertikal) und 20px (horizontal)

#### Farbpalette
- **CHANGED:** Foreground-Color dunkler (#333333 → #1a1a1a)
- **CHANGED:** Accent-Color aufgehellt (#f8eee2 → #f8f6f3)
- **CHANGED:** Border-Color aufgehellt (#e2e8f0 → #e5e7eb)
- **CHANGED:** Input-Background aufgehellt (→ #f3f4f6)
- **ADDED:** Neue CSS-Variablen für Shadows:
  - `--shadow-sm`: 0 2px 8px rgba(0, 0, 0, 0.04)
  - `--shadow-md`: 0 4px 16px rgba(0, 0, 0, 0.08)
  - `--shadow-lg`: 0 8px 32px rgba(0, 0, 0, 0.12)

#### Theme-Toggle
- **CHANGED:** Border-Width von 1px auf 2px erhöht
- **ADDED:** Backdrop-Filter: blur(10px)
- **CHANGED:** Hover-Rotation von 0deg auf 12deg erhöht
- **CHANGED:** Hover-Scale von 1.1 auf 1.15 erhöht
- **ADDED:** Border-Color-Change beim Hover (→ Primary)

#### Navigation-Dots
- **CHANGED:** Hover-Scale von 1.2 auf 1.3 erhöht
- **ADDED:** Active-State mit Scale 1.5
- **ADDED:** Cubic-Bezier-Transitions
- **CHANGED:** Transition-Duration auf 0.3s

#### Responsive Design
- **CHANGED:** Desktop-Breakpoint-Typography: H1 von 4.5rem auf 5rem
- **CHANGED:** Mobile-Typography: besseres Scaling
- **ADDED:** Neuer Breakpoint bei 480px für sehr kleine Screens
- **ADDED:** Flexbox-Direction-Change für Logo+Titel auf Mobile (column)

### 📂 Neue Dateien

- **ADDED:** `/new-solution/modern-styles.css` (420 Zeilen)
  - Komplette CSS-Überarbeitung für Version 2
  - Alle modernen Design-Features
  - Dark-Mode-Optimierungen
  - Responsive Breakpoints
  - Animation-Keyframes

- **ADDED:** `/DEVELOPMENT_LOG.md`
  - Ausführliches Entwicklungsprotokoll
  - Technische Details aller Änderungen
  - Empfehlungen für Masterversion
  - Testing-Anleitung

- **ADDED:** `/VERSION_COMPARISON.md`
  - Direkter Vergleich Version 1 vs. Version 2
  - Entscheidungshilfe
  - Performance-Metriken
  - Feature-Matrix

- **ADDED:** `/DESIGN_IMPROVEMENTS_SUMMARY.md`
  - Vorher/Nachher-Vergleich
  - Top 5 Verbesserungen
  - Code-Beispiele
  - Testing-Checklists

- **ADDED:** `/CHANGELOG.md` (diese Datei)

### 🔄 Geänderte Dateien

#### `/index.html` (Version 1)
- **CHANGED:** +559 Zeilen, -48 Zeilen
- **ADDED:** Inter Font Import
- **CHANGED:** Komplettes CSS-Refactoring im `<style>`-Tag
- **ADDED:** Neue `.logo-container` Klasse
- **CHANGED:** Header-Button-Styles modernisiert
- **CHANGED:** Hero-Section HTML für neuen Logo-Container
- **ADDED:** Neue CSS-Variablen
- **CHANGED:** Theme-Toggle CSS-Klasse

#### `/new-solution/index.html` (Version 2)
- **ADDED:** Link zu `modern-styles.css` im `<head>`
- **CHANGED:** Minimal (HTML-Struktur unverändert)

#### `/README.md`
- **ADDED:** Neuer Abschnitt "Aktuelle Entwicklung"
- **ADDED:** Links zu allen neuen Dokumentationen
- **ADDED:** Quick-Start-Anleitung für Hauptcomputer
- **ADDED:** Empfehlung für Masterversion

### 🐛 Bugfixes

- **FIXED:** Logo war zu klein auf großen Screens (64px → 120px)
- **FIXED:** Typografie wirkte veraltet (Arial → Inter)
- **FIXED:** Buttons zu flach und wenig ansprechend (Gradient hinzugefügt)
- **FIXED:** Hero-Section-Gradient zu einfach (3-Farben-Gradient)
- **FIXED:** Theme-Toggle zu subtil (Border + Rotation erhöht)

### 🚀 Performance

- **ADDED:** Font-Smoothing für bessere Darstellung
- **ADDED:** Image-Rendering-Optimierungen
- **ADDED:** Hardware-Acceleration für Animationen
- **MAINTAINED:** Ladezeiten unter 3 Sekunden
- **MAINTAINED:** Lighthouse-Score > 90

### 📱 Responsive

- **IMPROVED:** Logo-Scaling auf allen Geräten
- **IMPROVED:** Typography-Scaling
- **IMPROVED:** Button-Spacing auf Mobile
- **ADDED:** Neue Breakpoints für sehr kleine Screens

### ♿ Accessibility

- **MAINTAINED:** Alle ARIA-Labels
- **MAINTAINED:** Semantic HTML
- **IMPROVED:** Kontraste bei neuen Farben geprüft
- **MAINTAINED:** Keyboard-Navigation

### 🎯 2025 Webdesign-Trends

- ✅ **Minimalism mit Impact** implementiert
- ✅ **Bold Typography** mit Inter Font
- ✅ **Gradient Renaissance** bei Buttons und Backgrounds
- ✅ **Micro-Animations** bei Hover-Effekten
- ✅ **Professional Shadows** mit mehreren Ebenen
- ✅ **Mobile-First** Ansatz beibehalten
- ✅ **User-Centered Design** fokussiert

---

## [1.0.0] - 2024 - Initial Release

### Features
- ✅ Responsive Landing Page
- ✅ 3D-Globus-Visualisierung
- ✅ Theme-Toggle (Light/Dark Mode)
- ✅ Seitennavigation mit Dots
- ✅ Hero-Section mit Logo
- ✅ Features-Bereich
- ✅ Team-Sektion
- ✅ Kontakt-Formular
- ✅ Vereins-Information
- ✅ Zitate-Sektion
- ✅ Intern-Bereich mit Login

### Technologies
- HTML5, CSS3, JavaScript
- Next.js (Version 2)
- Tailwind CSS
- Three.js für 3D-Globus
- Supabase Backend

---

## Versions-Schema

Format: `[MAJOR.MINOR.PATCH]`

- **MAJOR:** Breaking Changes (Design-Überarbeitung, Struktur-Änderung)
- **MINOR:** Neue Features (ohne Breaking Changes)
- **PATCH:** Bugfixes und kleine Verbesserungen

---

## Links

- **Repository:** https://github.com/DorianGrey-Austria/culturestream_landingpage
- **Branch:** `claude/improve-website-design-013HHSt2Jf2X9un7HQdqs52w`
- **Dokumentation:**
  - [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)
  - [VERSION_COMPARISON.md](./VERSION_COMPARISON.md)
  - [DESIGN_IMPROVEMENTS_SUMMARY.md](./DESIGN_IMPROVEMENTS_SUMMARY.md)

---

**Letzte Aktualisierung:** 2025-11-21
