# CultureStream Interner Bereich - Technische Dokumentation

## Übersicht

Der interne Bereich von CultureStream bietet autorisierten Benutzern Zugang zu verwaltungsspezifischen Funktionen und detaillierten Ausstellungsinformationen. Diese Dokumentation beschreibt die Struktur, Implementierung und Funktionalität des internen Bereichs.

## Dateistruktur

```
intern/
├── index.html            # Login-Seite
├── exhibition.html       # Ausstellungsübersicht
├── admin.html            # Admin-Dashboard (rollenspezifisch)
├── member.html           # Mitglieder-Dashboard (rollenspezifisch)
├── vip.html              # VIP-Dashboard (rollenspezifisch)
├── community.html        # Community-Dashboard (rollenspezifisch)
├── settings.html         # Einstellungen
├── events.html           # Veranstaltungen
├── messages.html         # Nachrichten
├── profile.html          # Benutzerprofil
└── components/           # Wiederverwendbare Komponenten
    └── exhibition-card-1.html  # Ausstellungskarte Vorlage
```

## Authentifizierung und Autorisierung

### Login-System (intern/index.html)

Die Login-Funktionalität ist in `intern/index.html` implementiert. Hier sind die Hauptkomponenten:

1. **HTML-Struktur**:
   - Zweispaltiges Layout mit Hintergrundbild und Formular
   - Responsive Design für Desktop- und Mobilgeräte
   - Formular mit E-Mail, Passwort und "Angemeldet bleiben"-Option

2. **JavaScript-Authentifizierung**:
   ```javascript
   document.getElementById('loginForm').addEventListener('submit', function(e) {
       e.preventDefault();
       
       const email = document.getElementById('email').value;
       const password = document.getElementById('password').value;
       
       // Login-Daten für verschiedene Benutzerrollen
       const credentials = {
           admin: { email: 'admin@culturestream.de', password: 'admin123' },
           member: { email: 'mitglied@culturestream.de', password: 'mitglied123' },
           vip: { email: 'vip@culturestream.de', password: 'vip123' },
           community: { email: 'community@culturestream.de', password: 'community123' },
           artist: { email: 'kuenstler@culturestream.de', password: 'kuenstler123' }
       };
       
       // Überprüfung der Anmeldedaten
       let isValidLogin = false;
       let userRole = '';
       
       for (const role in credentials) {
           if (email === credentials[role].email && password === credentials[role].password) {
               isValidLogin = true;
               userRole = role;
               break;
           }
       }
       
       if (isValidLogin) {
           // Speichern der Benutzerinformationen im Session Storage
           sessionStorage.setItem('userRole', userRole);
           sessionStorage.setItem('isLoggedIn', 'true');
           
           // Weiterleitung zur Ausstellungsseite
           window.location.href = 'exhibition.html';
       } else {
           // Fehlgeschlagene Anmeldung
           alert('Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.');
       }
   });
   ```

3. **Sicherheitsmaßnahmen**:
   - Validierung der Eingabefelder mit HTML5-Attributen (`required`, etc.)
   - Überprüfung der Anmeldedaten gegen vorhandene Benutzerkonten
   - Speicherung der Authentifizierungsinformationen im Session Storage (in einer Produktionsumgebung würde ein sichererer Mechanismus mit JWT oder Server-Side-Sessions verwendet)

### Autorisierungssystem

Die Autorisierung basiert auf der Benutzerrolle:

1. **Rollenprüfung**: Jede geschützte Seite prüft, ob der Benutzer angemeldet ist:
   ```javascript
   document.addEventListener('DOMContentLoaded', function() {
       // Überprüfen, ob der Benutzer angemeldet ist
       const isLoggedIn = sessionStorage.getItem('isLoggedIn');
       const userRole = sessionStorage.getItem('userRole');
       
       if (!isLoggedIn || !userRole) {
           // Nicht angemeldet - zurück zur Login-Seite
           window.location.href = 'index.html';
           return;
       }
       
       // Rollenspezifischer Inhalt (Beispiel)
       if (userRole === 'admin') {
           // Admin-spezifische Elemente anzeigen
           document.querySelectorAll('.admin-only').forEach(el => {
               el.style.display = 'block';
           });
       }
   });
   ```

2. **Abmelden-Funktion**:
   ```javascript
   function logout() {
       // Entfernen der Authentifizierungsdaten aus dem Session Storage
       sessionStorage.removeItem('isLoggedIn');
       sessionStorage.removeItem('userRole');
       
       // Zurück zur Login-Seite
       window.location.href = 'index.html';
   }
   ```

## Ausstellungsseite (intern/exhibition.html)

Die Hauptseite des internen Bereichs zeigt eine Übersicht der Ausstellungen und bietet Filterfunktionen.

### Struktur und Design

1. **Header**: Navigation mit Links zur Hauptseite, Login und Weltkugel
2. **Filtersystem**: Formular mit Dropdown-Menüs für Kategorie, Status, Standort und Textsuche
3. **Ausstellungsgitter**: Responsive Grid mit Ausstellungskarten
4. **Paginierung**: Navigation zwischen Seiten mit Ausstellungen

### Funktionalität

1. **Filterfunktion**:
   ```javascript
   const filterForm = document.querySelector('.filter-form form');
   
   filterForm.addEventListener('submit', function(e) {
       e.preventDefault();
       
       // In einer Produktionsumgebung: AJAX-Request zum Server
       // Für die Demo: Eine einfache Erfolgsmeldung
       alert('Filter wurden angewendet!');
   });
   ```

2. **Bookmark-Funktion**:
   ```javascript
   const bookmarkButtons = document.querySelectorAll('.secondary-btn');
   
   bookmarkButtons.forEach(button => {
       button.addEventListener('click', function() {
           const icon = this.querySelector('i');
           const isBookmarked = icon.classList.contains('fas');
           
           if (isBookmarked) {
               icon.classList.remove('fas');
               icon.classList.add('far');
           } else {
               icon.classList.remove('far');
               icon.classList.add('fas');
           }
       });
   });
   ```

3. **Paginierung**:
   ```javascript
   const paginationLinks = document.querySelectorAll('.pagination .page-link');
   
   paginationLinks.forEach(link => {
       link.addEventListener('click', function(e) {
           e.preventDefault();
           
           // Aktive Klasse entfernen
           document.querySelector('.pagination .active').classList.remove('active');
           
           // Wenn der Pfeil nach rechts geklickt wird, zur Seite 2 navigieren
           if (this.innerHTML.includes('fa-chevron-right')) {
               document.querySelectorAll('.pagination .page-link')[2].classList.add('active');
           } else {
               // Ansonsten die angeklickte Seite aktivieren
               this.classList.add('active');
           }
       });
   });
   ```

### Ausstellungskarten

Jede Ausstellungskarte folgt dieser Struktur:

```html
<article class="exhibition-card">
    <div class="exhibition-image">
        <img src="../images/ausstellung1.jpg" alt="Ausstellung" onerror="this.src='../logo.png'; this.onerror=null;">
    </div>
    <div class="exhibition-details">
        <h3 class="exhibition-title">Titel der Ausstellung</h3>
        <div class="exhibition-meta">
            <div class="exhibition-location">
                <i class="fas fa-map-marker-alt"></i> Standort
            </div>
            <div class="exhibition-date">
                <i class="far fa-calendar-alt"></i> Zeitraum
            </div>
        </div>
        <div class="exhibition-status status-active">Status</div>
        <p class="exhibition-description">
            Beschreibung der Ausstellung...
        </p>
        <div class="exhibition-actions">
            <a href="#" class="action-btn primary-btn">
                <i class="fas fa-info-circle"></i> Details
            </a>
            <button class="action-btn secondary-btn">
                <i class="far fa-bookmark"></i> Merken
            </button>
        </div>
    </div>
</article>
```

## CSS-Stil und Responsive Design

Der interne Bereich verwendet ein einheitliches Styling-System mit CSS-Variablen für konsistente Farben und Abstände:

```css
:root {
    --primary: #D65108;
    --secondary: #e67e30;
    --accent: #f8eee2;
    --background: #ffffff;
    --foreground: #333333;
    --border: #e2e8f0;
    --input: #e2e8f0;
    --ring: #d65108;
    --radius: 0.5rem;
}
```

### Responsive Design-Prinzipien:

1. **Flexible Layouts**: Grid- und Flexbox-basierte Layouts
   ```css
   .exhibition-grid {
       display: grid;
       grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
       gap: 2rem;
   }
   ```

2. **Media Queries** für verschiedene Bildschirmgrößen:
   ```css
   @media (max-width: 768px) {
       .login-container {
           flex-direction: column;
       }
       
       .login-image {
           height: 200px;
       }
       
       .form-grid {
           grid-template-columns: 1fr;
       }
       
       .exhibition-grid {
           grid-template-columns: 1fr;
       }
   }
   ```

## Integrationsdetails mit dem Backend

In einer Produktionsumgebung würde die Authentifizierung und Datenabfrage über eine API erfolgen:

### API-Endpunkte (konzeptionell)

1. **Authentifizierung**:
   ```javascript
   async function login(email, password) {
       try {
           const response = await fetch('/api/auth/login', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({ email, password })
           });
           
           if (!response.ok) {
               throw new Error('Login fehlgeschlagen');
           }
           
           const data = await response.json();
           sessionStorage.setItem('token', data.token);
           sessionStorage.setItem('userRole', data.role);
           sessionStorage.setItem('isLoggedIn', 'true');
           
           return data;
       } catch (error) {
           console.error('Login-Fehler:', error);
           throw error;
       }
   }
   ```

2. **Ausstellungsdaten abrufen**:
   ```javascript
   async function getExhibitions(filters = {}) {
       try {
           const token = sessionStorage.getItem('token');
           const queryParams = new URLSearchParams(filters).toString();
           
           const response = await fetch(`/api/exhibitions?${queryParams}`, {
               headers: {
                   'Authorization': `Bearer ${token}`
               }
           });
           
           if (!response.ok) {
               throw new Error('Fehler beim Abrufen der Ausstellungen');
           }
           
           return await response.json();
       } catch (error) {
           console.error('Fehler beim Abrufen der Ausstellungen:', error);
           throw error;
       }
   }
   ```

3. **Ausstellung hinzufügen/bearbeiten** (nur für bestimmte Rollen):
   ```javascript
   async function saveExhibition(exhibitionData, isNew = false) {
       try {
           const token = sessionStorage.getItem('token');
           const method = isNew ? 'POST' : 'PUT';
           const url = isNew ? '/api/exhibitions' : `/api/exhibitions/${exhibitionData.id}`;
           
           const response = await fetch(url, {
               method,
               headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify(exhibitionData)
           });
           
           if (!response.ok) {
               throw new Error('Fehler beim Speichern der Ausstellung');
           }
           
           return await response.json();
       } catch (error) {
           console.error('Fehler beim Speichern der Ausstellung:', error);
           throw error;
       }
   }
   ```

### Integration mit Serverseitigen Technologien

In einer vollständigen Implementierung würde der interne Bereich mit einem Backend-Server kommunizieren:

1. **Node.js/Express-Backend** (konzeptionell):
   ```javascript
   // server.js
   const express = require('express');
   const jwt = require('jsonwebtoken');
   const bcrypt = require('bcrypt');
   const app = express();

   app.use(express.json());

   // Authentifizierung
   app.post('/api/auth/login', async (req, res) => {
       const { email, password } = req.body;
       
       // In einer echten Anwendung: Überprüfung gegen Datenbankeinträge
       // Für die Demo: Hardcodierte Benutzer
       const users = {
           'admin@culturestream.de': { 
               password: await bcrypt.hash('admin123', 10), 
               role: 'admin' 
           },
           // Weitere Benutzer...
       };
       
       const user = users[email];
       if (!user || !(await bcrypt.compare(password, user.password))) {
           return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
       }
       
       // JWT-Token erstellen
       const token = jwt.sign(
           { email, role: user.role },
           process.env.JWT_SECRET,
           { expiresIn: '1h' }
       );
       
       res.json({ token, role: user.role });
   });

   // Middleware für geschützte Routen
   function authenticate(req, res, next) {
       const authHeader = req.headers.authorization;
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
           return res.status(401).json({ error: 'Nicht autorisiert' });
       }
       
       const token = authHeader.split(' ')[1];
       try {
           const decoded = jwt.verify(token, process.env.JWT_SECRET);
           req.user = decoded;
           next();
       } catch (error) {
           return res.status(401).json({ error: 'Ungültiges Token' });
       }
   }

   // Geschützte Routen
   app.get('/api/exhibitions', authenticate, (req, res) => {
       // Filterparameter aus req.query
       // In einer echten Anwendung: Datenbankabfrage
       res.json([/* Ausstellungsdaten */]);
   });

   app.listen(3000, () => {
       console.log('Server läuft auf Port 3000');
   });
   ```

2. **Datenbankintegration** (konzeptionell mit MongoDB):
   ```javascript
   const mongoose = require('mongoose');

   // Ausstellungsschema
   const exhibitionSchema = new mongoose.Schema({
       title: { type: String, required: true },
       location: { type: String, required: true },
       dateStart: { type: Date, required: true },
       dateEnd: { type: Date, required: true },
       description: { type: String, required: true },
       status: { 
           type: String, 
           enum: ['active', 'upcoming', 'ended'],
           required: true 
       },
       image: { type: String, required: true },
       category: { type: String, required: true }
   });

   const Exhibition = mongoose.model('Exhibition', exhibitionSchema);

   // In der API-Route:
   app.get('/api/exhibitions', authenticate, async (req, res) => {
       try {
           const filter = {};
           
           if (req.query.category) {
               filter.category = req.query.category;
           }
           
           if (req.query.status) {
               filter.status = req.query.status;
           }
           
           if (req.query.location) {
               filter.location = { $regex: req.query.location, $options: 'i' };
           }
           
           if (req.query.search) {
               filter.$or = [
                   { title: { $regex: req.query.search, $options: 'i' } },
                   { description: { $regex: req.query.search, $options: 'i' } }
               ];
           }
           
           const exhibitions = await Exhibition.find(filter);
           res.json(exhibitions);
       } catch (error) {
           res.status(500).json({ error: 'Serverfehler' });
       }
   });
   ```

## Besondere Implementierungsdetails

### Fehlertolerante Bildanzeige

Alle Bilder verwenden ein Fallback zum Logo, wenn das eigentliche Bild nicht gefunden wird:

```html
<img src="../images/ausstellung1.jpg" alt="Ausstellung" onerror="this.src='../logo.png'; this.onerror=null;">
```

### Dynamische Statusanzeige

Statusanzeigen haben unterschiedliche Farben basierend auf dem Status:

```css
.status-active {
    background-color: #d1fae5;
    color: #065f46;
}

.status-upcoming {
    background-color: #e0f2fe;
    color: #0369a1;
}

.status-ended {
    background-color: #fef3c7;
    color: #92400e;
}
```

### Interaktive UI-Elemente

Hover-Effekte für Karten und Buttons erhöhen die Benutzerfreundlichkeit:

```css
.exhibition-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.exhibition-card:hover .exhibition-image img {
    transform: scale(1.05);
}
```

## Rollenspezifische Dashboard-Implementierung

Jede Benutzerrolle hat ein eigenes Dashboard mit spezifischen Funktionen:

1. **Admin-Dashboard** (`admin.html`):
   - Vollständige Kontrolle über alle Ausstellungen
   - Benutzerverwaltung
   - Statistiken und Reports

2. **Mitglieder-Dashboard** (`member.html`):
   - Eigene Ausstellungen verwalten
   - Mitgliedschaftsinformationen

3. **VIP-Dashboard** (`vip.html`):
   - Exklusive Inhalte
   - Vorabzugang zu Ausstellungen

4. **Community-Dashboard** (`community.html`):
   - Diskussionsforen
   - Community-Events

5. **Künstler-Dashboard** (für Künstler-Accounts):
   - Portfolio-Management
   - Ausstellungsanfragen

### Rollenbasierte Inhaltsanzeige

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const userRole = sessionStorage.getItem('userRole');
    
    // Rollenspezifische UI-Elemente ein-/ausblenden
    document.querySelectorAll('[data-role]').forEach(element => {
        const requiredRoles = element.dataset.role.split(',');
        
        if (!requiredRoles.includes(userRole)) {
            element.style.display = 'none';
        }
    });
});
```

## Wiederverwenden und Wiederaufbauen des Codes

Um den internen Bereich zu rekonstruieren:

1. Erstellen Sie die Verzeichnisstruktur wie oben angegeben
2. Implementieren Sie zuerst die Login-Funktionalität in `intern/index.html`
3. Erstellen Sie die Ausstellungsübersicht in `intern/exhibition.html`
4. Fügen Sie die rollenspezifischen Dashboards hinzu
5. Stellen Sie sicher, dass alle CSS-Stile und JavaScript-Funktionen korrekt implementiert sind

Die Schlüsselkomponenten sind:
- Das Authentifizierungssystem mit sessionStorage
- Die responsive Ausstellungsübersicht mit Filterung
- Das einheitliche Styling-System mit CSS-Variablen
- Die rollenbasierte Zugriffskontrolle

## Sicherheitshinweise

Der aktuelle Code verwendet Client-Side-Authentifizierung mit sessionStorage, was für Demonstrationszwecke ausreicht, aber in einer Produktionsumgebung nicht sicher ist. In einer echten Anwendung sollten Sie:

1. JWT-basierte Authentifizierung mit sicherer Server-Kommunikation verwenden
2. XSS- und CSRF-Schutzmaßnahmen implementieren
3. HTTPS für alle API-Anfragen erzwingen
4. Benutzerpasswörter sicher hashen und speichern

## Zusammenfassung

Der interne Bereich von CultureStream bietet ein vollständiges System für die Authentifizierung, Autorisierung und Verwaltung von Ausstellungen. Die Implementierung folgt modernen Webentwicklungspraktiken mit Fokus auf:
- Responsive Design
- Benutzerfreundlichkeit
- Rollenbasierte Zugriffssteuerung
- Modularer, wiederverwendbarer Code

Diese Dokumentation sollte alle notwendigen Informationen bieten, um den internen Bereich in Zukunft zu rekonstruieren oder zu erweitern. 