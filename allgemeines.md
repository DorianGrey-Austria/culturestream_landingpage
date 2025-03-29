# CultureStream Landingpage - Technischer Überblick

## Tech Stack

### Frontend-Framework
- **Next.js**: React-Framework, das Server-Side Rendering und statisches Site-Generieren ermöglicht
- **TypeScript**: Typsichere Erweiterung von JavaScript für robustere Codebasis
- **React 18+**: UI-Bibliothek für komponentenbasierte Entwicklung

### 3D-Visualisierung
- **Three.js**: JavaScript-Bibliothek für 3D-Grafiken im Browser
- **React Three Fiber**: React-Renderer für Three.js
- **React Three Drei**: Hilfsbibliothek für React Three Fiber

### Styling & UI
- **Tailwind CSS**: Utility-First CSS-Framework
- **Shadcn UI**: Komponentenbibliothek mit Tailwind CSS
- **Framer Motion**: Bibliothek für Animationen und Übergänge

### Backend & Datenspeicherung
- **Supabase**: Open-Source Firebase-Alternative mit PostgreSQL-Datenbank
  - Verwendet für Kontaktformular und Datenspeicherung

### Deployment & Hosting
- **Static Site Generation**: Next.js generiert statische HTML-Dateien
- **GitHub**: Versionskontrolle und Quellcode-Verwaltung
- **Webserver-Kompatibilität**: Die statischen Dateien können auf jedem Webserver gehostet werden

## Projektstruktur

- **/app**: Next.js App Router Struktur
  - **/components**: Wiederverwendbare React-Komponenten
    - **/3d**: Three.js Komponenten (Globe, Portal)
  - **/page.tsx**: Hauptseite der Anwendung
- **/components**: Shadcn UI Komponenten
- **/lib**: Hilfsfunktionen und Dienstprogramme
  - **utils.ts**: Allgemeine Hilfsfunktionen
  - **supabase.ts**: Supabase-Client-Konfiguration
- **/public**: Statische Assets (Bilder, Videos)
- **/out**: Generierte statische Dateien für Deployment

## Besondere Features

1. **3D-Globus-Visualisierung**: Interaktive Darstellung globaler Verbindungen mit Three.js
2. **Dynamisches Portal**: 3D-Animation eines Portals als visuelle Metapher für globale Verbindungen
3. **Responsive Design**: Optimiert für alle Bildschirmgrößen (Mobil, Tablet, Desktop)
4. **Dark/Light Mode**: Automatische und manuelle Umschaltung zwischen Farbschemata
5. **Animationen**: Scroll-basierte Animationen mit Framer Motion
6. **Kontaktformular**: Integration mit Supabase zur Speicherung von Kontaktanfragen
7. **Barrierefreiheit**: Implementierung von ARIA-Attributen und Tastaturnavigation

## Performance-Optimierungen

1. **Statische Generierung**: Vorab gerenderte HTML-Dateien für schnelle Ladezeiten
2. **Lazy Loading**: Dynamischer Import von 3D-Komponenten
3. **Code-Splitting**: Automatische Aufteilung des JavaScript-Codes durch Next.js
4. **Optimierte Assets**: Komprimierte Bilder und Videos
5. **Progressive Enhancement**: Grundfunktionalität ohne JavaScript, erweiterte Funktionen mit JavaScript

## Zukunftsplanung

- Integration weiterer 3D-Modelle und interaktiver Elemente
- Mehrsprachige Unterstützung (i18n)
- Erweiterte Analytics und Tracking
- CMS-Integration für einfachere Content-Updates
- PWA-Funktionalität für Offline-Nutzung 