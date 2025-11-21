# CultureStream Landingpage

Eine moderne, interaktive Landing Page für CultureStream mit 3D-Globus und responsivem Design.

---

## 🚀 Aktuelle Entwicklung (Mobile Development - Letzte Woche)

**Branch:** `claude/improve-website-design-013HHSt2Jf2X9un7HQdqs52w`
**Status:** ✅ Design-Modernisierung abgeschlossen

### 📚 Wichtige Dokumentation für Hauptcomputer

Die letzte Woche wurde intensiv an der Design-Modernisierung beider Website-Versionen gearbeitet. Alle Änderungen sind ausführlich dokumentiert:

#### 📖 Haupt-Dokumentationen

1. **[DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md)** 📋
   - Komplettes Entwicklungsprotokoll
   - Detaillierte Beschreibung aller Änderungen
   - Schritt-für-Schritt-Anleitungen
   - Technische Details und Code-Beispiele
   - **Start hier für vollständigen Überblick!**

2. **[VERSION_COMPARISON.md](./VERSION_COMPARISON.md)** ⚖️
   - Direkter Vergleich Version 1 vs. Version 2
   - Entscheidungshilfe: Welche Version verwenden?
   - Performance-Metriken
   - Feature-Matrix
   - **Start hier für schnelle Entscheidung!**

3. **[DESIGN_IMPROVEMENTS_SUMMARY.md](./DESIGN_IMPROVEMENTS_SUMMARY.md)** 🎨
   - Vorher/Nachher Vergleich
   - Top 5 Verbesserungen
   - Code-Beispiele
   - Testing-Checklists
   - **Start hier für Design-Überblick!**

### ✨ Was wurde verbessert?

#### Hauptverbesserungen (2025 Webdesign-Standards)
- ✅ **Logo:** 64px → **120px** (Desktop)
- ✅ **Typografie:** Arial → **Inter Font**
- ✅ **Buttons:** Flat → **Gradient mit Shine-Effekten**
- ✅ **Hero-Section:** **135° Multi-Color-Gradient**
- ✅ **Animationen:** Moderne Cubic-Bezier-Transitions
- ✅ **Responsive:** Optimierte Breakpoints

#### Beide Versionen modernisiert
- **Version 1:** `/index.html` (Standalone, Production-Ready)
- **Version 2:** `/new-solution/index.html` (Next.js, + neue CSS-Datei)

### 🎯 Quick-Start auf Hauptcomputer

```bash
# 1. Branch auschecken
git fetch origin
git checkout claude/improve-website-design-013HHSt2Jf2X9un7HQdqs52w

# 2. Dokumentation lesen
open DEVELOPMENT_LOG.md          # Vollständige Dokumentation
open VERSION_COMPARISON.md       # Versions-Vergleich
open DESIGN_IMPROVEMENTS_SUMMARY.md  # Design-Übersicht

# 3. Versionen testen
open index.html                  # Version 1
cd new-solution && open index.html  # Version 2

# 4. Masterversion zusammenstellen
# Siehe DEVELOPMENT_LOG.md → "Empfehlungen für Masterversion"
```

### 📊 Empfehlung für Masterversion

**Empfohlen:** Version 1 (`/index.html`) als Basis
- ✅ Standalone, keine Dependencies
- ✅ Schnelles Deployment
- ✅ Alle modernen Design-Features integriert
- ✅ Production-Ready

Details siehe: [VERSION_COMPARISON.md](./VERSION_COMPARISON.md)

---

## Über das Projekt

CultureStream ist ein Kulturverein, der sich auf die globale Vernetzung von Künstler:innen und Kulturschaffenden konzentriert. Diese Landing Page wurde entwickelt, um die Vision, Mission und Funktionen des Projekts zu präsentieren.

## Features

- **Responsives Design**: Optimiert für alle Geräte und Bildschirmgrößen
- **3D-Globus Visualisierung**: Interaktive Darstellung der globalen Portale und Verbindungen
- **Moderne UI**: Implementiert mit Next.js, Tailwind CSS und Three.js
- **Barrierefreie Benutzeroberfläche**: Gestaltet für optimale Zugänglichkeit
- **Mehrsprachige Unterstützung**: Vorbereitet für internationale Zielgruppen

## Technologien

- [Next.js](https://nextjs.org/) - React Framework
- [Three.js](https://threejs.org/) - 3D-Bibliothek
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS-Framework
- [Framer Motion](https://www.framer.com/motion/) - Animationsbibliothek
- [Supabase](https://supabase.io/) - Open Source Firebase Alternative

## Hosting-Anleitung

Diese Website wurde als statische Site exportiert und kann auf jedem statischen Hosting-Dienst bereitgestellt werden.

### Vorbereitung für das Hosting

1. Der gesamte Inhalt des `out`-Verzeichnisses muss auf den Server hochgeladen werden
2. Wichtig: Die Verzeichnisstruktur muss beibehalten werden
3. Der `_next`-Ordner muss sich im Stammverzeichnis der Website befinden

### Hosting mit GitHub Pages, Netlify oder Vercel

1. **GitHub Pages**:
   - Aktivieren Sie GitHub Pages in den Repository-Einstellungen
   - Wählen Sie den Branch und das Verzeichnis (normalerweise `main` und `/out`)

2. **Netlify/Vercel**:
   - Verknüpfen Sie das Repository mit Ihrem Netlify/Vercel-Konto
   - Verwenden Sie den Befehl `next build && next export` als Build-Befehl
   - Setzen Sie das Ausgabeverzeichnis auf `out`

### Hosting auf traditionellen Webservern

1. Laden Sie den gesamten Inhalt des `out`-Verzeichnisses auf Ihren Server hoch
2. Stellen Sie sicher, dass die `.htaccess`-Datei im Root-Verzeichnis liegt
3. Überprüfen Sie, ob alle Dateien lesbar und öffentlich zugänglich sind

## Kontakt

Bei Fragen oder Problemen wenden Sie sich bitte an:
- Website: [culturestream.at](https://culturestream.at)
- E-Mail: info@culturestream.at

# CultureStream Plattform

Eine moderne Web-Plattform für kulturelle Veranstaltungen und Gemeinschaftsengagement.

## Überblick

Die CultureStream-Plattform bietet ein umfassendes Ökosystem für kulturelle Inhalte, Künstler und Kunstliebhaber. Die Plattform umfasst Funktionen wie Veranstaltungskalender, Ausstellungsübersichten, Mitgliederprofile und Community-Engagement-Tools.

## Hauptfunktionen

- Responsives Design für alle Geräte
- Barrierefreiheit nach WCAG 2.1 AA-Standard
- Supabase-Integration für Datenmanagement
- Umfassende Performance-Optimierungen
- Admin-Dashboard für Datenverwaltung
- KI-Avatar-Integration

## Technologie-Stack

- HTML5, CSS3, JavaScript (ES6+)
- TypeScript
- Supabase
- Jest für Unit-Tests
- PWA-Features

## Hinweise zur Repository

**Wichtig:** Das DeepSeek LLM-Modell (im Verzeichnis `/DeepSeek-V3`) wird aufgrund seiner Größe (>300MB) nicht auf GitHub gepusht. Dieses Modell ist für die KI-Avatar-Funktionalität erforderlich und muss separat installiert werden.

## Installation

1. Repository klonen
2. `npm install` ausführen
3. DeepSeek LLM Modell separat herunterladen und im Ordner `/DeepSeek-V3` platzieren
4. `npm run dev` für Entwicklungsumgebung starten

## Roadmap

Die vollständige Roadmap mit aktuellen Fortschritten ist in der Datei `roadmap.md` dokumentiert.

## Lizenz

Alle Rechte vorbehalten. 