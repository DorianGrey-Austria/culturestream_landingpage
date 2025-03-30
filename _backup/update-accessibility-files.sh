#!/bin/bash

# CultureStream Accessibility Test Integration Script
# Updates all HTML files with links to accessibility test scripts

echo "CultureStream Accessibility Files Update Script"
echo "================================================"

# Files to add
A11Y_TEST="accessibility-test.js"
A11Y_REPORT="accessibility-report.js"
A11Y_INTEGRATION="accessibility-test-integration.js"
A11Y_CSS="accessibility.css"

# Get all HTML files
HTML_FILES=$(find . -name "*.html")

# Counter for updated files
UPDATED=0

for file in $HTML_FILES; do
  echo "Processing $file..."
  
  # Check if accessibility files are already included
  if grep -q "$A11Y_TEST" "$file"; then
    echo "  - $A11Y_TEST already included"
  else
    # Insert accessibility test script before the closing body tag
    sed -i '' -e "s|</body>|  <script src=\"$A11Y_TEST\"></script>\n</body>|" "$file"
    echo "  + Added $A11Y_TEST"
    UPDATED=$((UPDATED+1))
  fi
  
  if grep -q "$A11Y_REPORT" "$file"; then
    echo "  - $A11Y_REPORT already included"
  else
    # Insert accessibility report script before the closing body tag
    sed -i '' -e "s|</body>|  <script src=\"$A11Y_REPORT\"></script>\n</body>|" "$file"
    echo "  + Added $A11Y_REPORT"
    UPDATED=$((UPDATED+1))
  fi
  
  if grep -q "$A11Y_INTEGRATION" "$file"; then
    echo "  - $A11Y_INTEGRATION already included"
  else
    # Insert accessibility integration script before the closing body tag
    sed -i '' -e "s|</body>|  <script src=\"$A11Y_INTEGRATION\"></script>\n</body>|" "$file"
    echo "  + Added $A11Y_INTEGRATION"
    UPDATED=$((UPDATED+1))
  fi
  
  if grep -q "$A11Y_CSS" "$file"; then
    echo "  - $A11Y_CSS already included"
  else
    # Insert accessibility CSS in the head
    sed -i '' -e "s|</head>|  <link rel=\"stylesheet\" href=\"$A11Y_CSS\">\n</head>|" "$file"
    echo "  + Added $A11Y_CSS"
    UPDATED=$((UPDATED+1))
  fi
  
  echo "Done processing $file"
  echo "--------------------------"
done

echo "Update complete! Modified $UPDATED files."

# Create integration guide
cat > accessibility-guide.md << 'EOF'
# CultureStream Accessibility Test Guide

## Übersicht

Die CultureStream-Plattform enthält jetzt ein integriertes Accessibility-Test-System, das WCAG 2.1 AA-Konformitätstests auf allen Seiten durchführt. Dieses System besteht aus mehreren Komponenten:

1. **accessibility-test.js** - Das Kerntestwerkzeug, das automatische Tests für WCAG-Kriterien durchführt
2. **accessibility-report.js** - Dashboard für Testergebnisse und -berichte
3. **accessibility-test-integration.js** - Integration beider Systeme mit Benutzeroberfläche
4. **accessibility.css** - CSS für verbesserte Zugänglichkeit der Plattform

## Funktionen

- **Automatisierte Tests** für Bilder, Überschriften, Links, Formulare, Landmarks, Tastaturnavigation, Kontrast und ARIA-Attribute
- **Visuelles Feedback** zu Zugänglichkeitsproblemen direkt auf der Seite
- **Umfassendes Dashboard** zur Anzeige von Testergebnissen und Problembehebung
- **WCAG 2.1 AA-Konformitätsprüfung** mit detaillierten Berichten
- **Exportierbare Berichte** für Dokumentations- und Compliance-Zwecke

## Verwendung

### Manuelle Tests durchführen

1. Klicken Sie auf die schwebende Schaltfläche "Test" in der unteren rechten Ecke einer beliebigen Seite
2. Die Tests werden ausgeführt und die Ergebnisse als Benachrichtigung angezeigt
3. Probleme werden direkt auf der Seite mit visuellen Indikatoren hervorgehoben

### Bericht anzeigen

1. Öffnen Sie `/accessibility-report.html` in Ihrem Browser
2. Das Dashboard zeigt eine Zusammenfassung aller Tests und Probleme
3. Verwenden Sie die Registerkarten, um Details zu bestimmten Kategorien anzuzeigen
4. Scannen Sie zusätzliche Seiten mit dem Formular "Seite scannen"

### Berichte exportieren

1. Navigieren Sie zum Dashboard
2. Klicken Sie auf die Schaltfläche "Ergebnisse exportieren"
3. Eine JSON-Datei wird heruntergeladen, die alle Testergebnisse enthält

## Integration in neue Seiten

Alle neuen HTML-Seiten sollten folgende Skripte vor dem schließenden `</body>`-Tag einbinden:

```html
<script src="accessibility-test.js"></script>
<script src="accessibility-report.js"></script>
<script src="accessibility-test-integration.js"></script>
```

Und das folgende Stylesheet im `<head>`:

```html
<link rel="stylesheet" href="accessibility.css">
```

## Tipps zur Fehlerbehebung

### Häufige Probleme und Lösungen

1. **Bilder ohne Alt-Text**
   ```html
   <img src="bild.jpg" alt="Beschreibender Text">
   ```

2. **Leere Überschriften**
   ```html
   <h2>Aussagekräftiger Titel</h2>
   ```

3. **Links ohne aussagekräftigen Text**
   ```html
   <a href="seite.html">Beschreibender Linktext</a>
   statt
   <a href="seite.html">hier klicken</a>
   ```

4. **Formulare ohne Labels**
   ```html
   <label for="name">Name:</label>
   <input type="text" id="name">
   ```

5. **Kontrastprobleme**
   - Verwenden Sie die CSS-Variablen der Plattform für konsistente Farben
   - Mindestkontrastverhältnis von 4,5:1 für normalen Text

## WCAG-Compliance-Checkliste

- [X] Alt-Texte für alle Bilder
- [X] Korrekte Dokumentstruktur mit semantischem HTML5
- [X] Ausreichender Farbkontrast
- [X] Tastaturzugänglichkeit
- [X] ARIA-Attribute für dynamische Inhalte
- [X] Responsive Design für verschiedene Geräte
- [X] Klarer Fokusindikator für Tastaturnavigation
- [X] Beschriftungen für Formularelemente
- [X] Konsistente Navigation und Layout
EOF

echo "Created accessibility guide: accessibility-guide.md" 