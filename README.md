# CultureStream Landingpage

## Projektübersicht

Das CultureStream-Projekt besteht aus drei Hauptbereichen:

1. **Hauptseite (index.html)**: Die Landing Page des Projekts mit Informationen über den Kulturverein
2. **Weltkugel (out/index.html)**: Eine interaktive 3D-Weltkugel-Visualisierung
3. **Interner Bereich (intern/index.html)**: Zugang zum internen Ausstellungsbereich

## Navigationsstruktur

Die Bereiche sind wie folgt miteinander verbunden:

```
Hauptseite (index.html)
  │
  ├── Weltkugel-Button → out/index.html
  │    
  └── Intern-Button → intern/index.html
                           │
                           └── Auto-Weiterleitung → intern/exhibition.html
```

## Interne Login-Daten

Für den Zugriff auf den internen Bereich können folgende Login-Daten verwendet werden:

- **Admin**: admin@culturestream.de / admin123
- **Member**: member@culturestream.de / member123
- **VIP**: vip@culturestream.de / vip123
- **Community**: community@culturestream.de / community123
- **Künstler**: artist@culturestream.de / artist123

## Entwicklung und Test

### Lokalen Server starten

Um die Website lokal zu testen, navigieren Sie zum Projektverzeichnis und starten Sie einen einfachen HTTP-Server. Beispiel mit Python:

```bash
# Wenn Python installiert ist
python -m http.server 3000

# Alternativ mit Node.js
npx serve
```

### Wichtige Dateien

- `index.html` - Hauptlandingpage
- `out/index.html` - Weltkugel-Visualisierung
- `intern/index.html` - Weiterleitung zum internen Bereich
- `intern/exhibition.html` - Ausstellungsübersicht

## Technologien

- HTML5, CSS3, JavaScript
- Next.js (für die Weltkugel-Komponente)
- Responsive Design
- Dark Mode Unterstützung
- Barrierefreiheit nach WCAG 2.1

## Hinweise

- Die Next.js-Komponenten in der Weltkugel-Seite benötigen eine vollständige Next.js-Umgebung, wenn sie lokal entwickelt werden sollen.
- Der interne Bereich verwendet einfache HTML/CSS/JS ohne Back-End-Funktionalität.
- Die Login-Daten sind nur für Demonstrationszwecke und werden direkt im JavaScript überprüft.

## Zukunftspläne

- Backend-Integration mit vollständiger Datenbank-Anbindung
- Erweiterte Benutzerinteraktionen in der Weltkugel-Visualisierung
- Vollständige Implementierung der Ausstellungsverwaltung im internen Bereich

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