# CultureStream - Interne Seite Dokumentation

## Überblick

Diese Dokumentation beschreibt detailliert den internen Bereich der CultureStream-Website, der sich in der Entwicklungsphase befand. Die Dokumentation dient als Referenz, um den Code später rekonstruieren zu können und enthält wichtige Informationen zur Server-Integration und Login-Weiterleitung.

## Verzeichnisstruktur

```
intern/
├── index.html        # Login-Seite mit Weiterleitung
├── exhibition.html   # Hauptseite des internen Bereichs
├── components/       # Wiederverwendbare Komponenten
│   ├── exhibition-card-1.html
│   └── ... weitere Komponenten
├── css/
│   ├── main.css      # Haupt-Stylesheet
│   └── modules/      # CSS-Module für Code-Splitting
│       ├── slider.css
│       └── ... weitere Module
└── js/
    ├── main.js       # Haupt-JavaScript
    └── modules/      # JS-Module für Code-Splitting
        ├── slider.js
        └── ... weitere Module
```

## Login-System

### Login-Logik

Der Login-Mechanismus in `index.html` verwendet Client-seitiges JavaScript für die Authentifizierung. In einer vollständigen Implementation würde dies durch einen Server-basierten Auth-Flow ersetzt werden.

```javascript
// Pseudocode der Login-Logik
function handleLogin(email, password) {
  // Mapping von Benutzeranmeldedaten zu Rollen
  const users = {
    "admin@culturestream.de": { password: "admin123", role: "admin" },
    "member@culturestream.de": { password: "member123", role: "member" },
    "vip@culturestream.de": { password: "vip123", role: "vip" },
    "community@culturestream.de": { password: "community123", role: "community" },
    "artist@culturestream.de": { password: "artist123", role: "artist" }
  };
  
  // Authentifizierung prüfen
  const user = users[email];
  if (user && user.password === password) {
    // Bei erfolgreicher Anmeldung:
    // 1. Token im localStorage speichern
    localStorage.setItem('csUserToken', generateToken(email, user.role));
    localStorage.setItem('csUserRole', user.role);
    
    // 2. Weiterleitung zur internen Seite
    window.location.href = 'exhibition.html';
    return true;
  }
  
  return false;
}
```

### Rollenverwaltung

Nach dem Login wird die Benutzerrolle im localStorage gespeichert und bestimmt den Zugriff auf verschiedene Funktionen:

- **Admin**: Vollständiger Zugriff auf alle Funktionen, einschließlich Benutzerverwaltung
- **Member**: Grundlegender Zugriff auf Inhalte und persönliche Einstellungen
- **VIP**: Erweiterter Zugriff auf Premium-Inhalte und exklusive Ausstellungen
- **Community**: Zugriff auf Community-Features und kollaborative Werkzeuge
- **Künstler**: Zugriff auf Künstlerwerkzeuge und Portfolio-Management

## Ausstellungsseite (exhibition.html)

Die Ausstellungsseite ist die Hauptseite des internen Bereichs und bietet:

1. Eine Übersicht über aktuelle Ausstellungen
2. Filterfunktionen nach Kategorie, Datum und Ort
3. Detailansicht für einzelne Ausstellungen
4. Lazy-Loading von Ausstellungskarten für verbesserte Performance

### Performanceoptimierungen

Die Seite implementiert mehrere Performanceoptimierungen:

1. **Lazy-Loading**: Bilder und Ausstellungskarten werden erst geladen, wenn sie in den Viewport kommen
2. **Code-Splitting**: CSS und JavaScript sind in Module aufgeteilt, die bei Bedarf geladen werden
3. **Critical CSS**: Wichtige Styles werden inline geladen, um das Rendering zu beschleunigen
4. **Preloading**: Kritische Assets werden vorgeladen

```html
<!-- Beispiel für Lazy-Loading einer Ausstellungskarte -->
<div class="exhibition-card-placeholder" data-card-id="1">
  <div class="lazy-load-spinner"></div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const placeholder = entry.target;
            const cardId = placeholder.dataset.cardId;
            
            // Dynamisches Laden der Kartenkomponente
            fetch(`components/exhibition-card-${cardId}.html`)
              .then(response => response.text())
              .then(html => {
                placeholder.innerHTML = html;
                observer.unobserve(placeholder);
              });
          }
        });
      });
      
      document.querySelectorAll('.exhibition-card-placeholder').forEach(placeholder => {
        observer.observe(placeholder);
      });
    });
  </script>
</div>
```

## Slider-Komponente

Die Slider-Komponente ist ein Beispiel für Code-Splitting und modulare Komponenten:

### JavaScript (js/modules/slider.js)

```javascript
window.CultureStream = window.CultureStream || {};

// Slider-Modul mit Namespace
window.CultureStream.Slider = (function() {
  // Standardoptionen
  const defaults = {
    slideClass: '.slide',
    activeClass: 'active',
    arrowNext: '.arrow-next',
    arrowPrev: '.arrow-prev',
    dotsContainer: '.slider-dots',
    autoplay: true,
    autoplayDuration: 5000,
    transitionTime: 500
  };
  
  // Konstruktor-Funktion
  function Slider(container, options = {}) {
    this.container = typeof container === 'string' ? 
      document.querySelector(container) : container;
    
    if (!this.container) {
      console.error('Slider container not found');
      return;
    }
    
    // Optionen mit Defaults zusammenführen
    this.options = { ...defaults, ...options };
    
    // DOM-Elemente initialisieren
    this.slides = this.container.querySelectorAll(this.options.slideClass);
    this.currentIndex = 0;
    this.autoplayTimer = null;
    this.isTransitioning = false;
    
    // Slider initialisieren
    this.init();
  }
  
  // Prototyp-Methoden
  Slider.prototype = {
    init: function() {
      // Navigation erstellen
      this.createNavigation();
      
      // Erstes Slide aktivieren
      this.goToSlide(0);
      
      // Event-Listener hinzufügen
      this.bindEvents();
      
      // Autoplay starten, wenn aktiviert
      if (this.options.autoplay) {
        this.startAutoplay();
      }
    },
    
    // Weitere Methoden für Navigation, Events, etc.
    // ...
  };
  
  return Slider;
})();
```

### CSS (css/modules/slider.css)

```css
/* Slider Container */
.slider-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
}

/* Slides Wrapper */
.slides-wrapper {
  display: flex;
  transition: transform 0.5s ease;
}

/* Individual Slides */
.slide {
  min-width: 100%;
  position: relative;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.slide.active {
  opacity: 1;
}

/* Navigation Arrows */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s ease;
}

.slider-arrow:hover {
  background: rgba(255, 255, 255, 0.9);
}

.arrow-prev {
  left: 20px;
}

.arrow-next {
  right: 20px;
}

/* Dots Navigation */
.slider-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s ease;
}

.slider-dot.active {
  background: white;
}

.slider-dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .slider-arrow {
    width: 30px;
    height: 30px;
  }
  
  .arrow-prev {
    left: 10px;
  }
  
  .arrow-next {
    right: 10px;
  }
  
  .slider-dots {
    bottom: 10px;
  }
  
  .slider-dot {
    width: 10px;
    height: 10px;
  }
}
```

## Geplante Backend-Integration

Die vollständige Implementierung würde eine Serverintegration mit folgenden Komponenten umfassen:

### API-Endpunkte

```
/api/auth/login         - Authentifizierung
/api/auth/logout        - Abmeldung
/api/auth/refresh       - Token-Aktualisierung
/api/exhibitions        - Ausstellungsliste
/api/exhibitions/:id    - Einzelne Ausstellung
/api/users/:id/profile  - Benutzerprofil
```

### Datenbank-Schema

```sql
-- Benutzer-Tabelle
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Ausstellungs-Tabelle
CREATE TABLE exhibitions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Authentifizierung und Autorisierung

Die geplante Implementierung würde JWT (JSON Web Tokens) für die Authentifizierung verwenden:

1. **Anmeldung**: Benutzer gibt E-Mail und Passwort ein, Server validiert die Anmeldedaten und gibt ein JWT zurück
2. **Autorisierung**: Das JWT enthält die Benutzerrolle und wird bei jeder API-Anfrage gesendet
3. **Token-Aktualisierung**: Ein Refresh-Token-Mechanismus würde die Sitzung aktualisieren
4. **Abmeldung**: Das Token wird auf die Blacklist gesetzt

## Bekannte Probleme und geplante Verbesserungen

1. **Clientseitige Authentifizierung**: Die aktuelle Implementierung verwendet clientseitige Authentifizierung, was ein Sicherheitsrisiko darstellt. In der vollständigen Version würde dies durch serverseitige Authentifizierung ersetzt.

2. **Fehlende Datenpersistenz**: Es gibt keine Datenbankanbindung, alle Daten sind statisch. Eine vollständige Implementierung würde eine Datenbank wie PostgreSQL oder MongoDB verwenden.

3. **Begrenzte Funktionalität**: Viele Funktionen sind nur als UI-Elemente vorhanden, ohne tatsächliche Implementierung. 

4. **Fehlendes Error-Handling**: Es gibt begrenztes Error-Handling für Netzwerkfehler oder Backend-Probleme.

## Wiederherstellungsschritte

Um den aktuellen Code später wiederherzustellen und weiterzuentwickeln:

1. **Klonen des Repositories**: `git clone [Repository-URL]`
2. **Wechsel zum Branch**: `git checkout katastrophenFail` (oder der entsprechende Branch-Name)
3. **Installation der Abhängigkeiten**: `npm install` (falls ein package.json vorhanden ist)
4. **Einrichtung der Backend-Komponenten**:
   - Erstellung einer Datenbank gemäß dem oben beschriebenen Schema
   - Implementierung der API-Endpunkte gemäß der Dokumentation
   - Konfiguration der Authentifizierung
5. **Integration des Frontends mit dem Backend**:
   - Ersetzen der statischen Daten durch API-Aufrufe
   - Implementierung von Fehlerbehandlung und Ladeanimationen
   - Vervollständigung der fehlenden Funktionen

## Künftige Verbesserungen

1. **Authentifizierung**: Implementierung von OAuth2 oder SSO (Single Sign-On)
2. **Real-time Funktionen**: WebSocket-Integration für Echtzeit-Updates
3. **Suchfunktionen**: Volltextsuche mit Elasticsearch oder ähnlicher Technologie
4. **Erweiterte Benutzerverwaltung**: Benutzergruppen, Berechtigungssystem, Profilbilder
5. **Mehrsprachige Unterstützung**: i18n-Integration für internationale Nutzer
6. **Analytics**: Benutzerverhalten und Interaktionsanalyse
7. **Mobile App**: Native mobile App mit der gleichen Funktionalität
8. **API-Dokumentation**: Generierung von API-Dokumentation mit Swagger oder ähnlichen Tools

## Prüfsummen wichtiger Dateien

Zur Überprüfung der Integrität bei einer späteren Wiederherstellung sind hier MD5-Prüfsummen der wichtigsten Dateien aufgeführt:

```
index.html: [MD5-PRÜFSUMME]
exhibition.html: [MD5-PRÜFSUMME]
js/modules/slider.js: [MD5-PRÜFSUMME]
css/modules/slider.css: [MD5-PRÜFSUMME]
```

## Kontaktinformationen

Für Fragen bezüglich dieser Dokumentation wenden Sie sich bitte an:

E-Mail: [E-MAIL-ADRESSE]
Projektverantwortliche: [NAME] 