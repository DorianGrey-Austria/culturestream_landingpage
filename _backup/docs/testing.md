# CultureStream Testing-Dokumentation

## Übersicht

Dieses Dokument beschreibt die Testumgebung der CultureStream-Plattform und erklärt, wie Tests ausgeführt, erstellt und erweitert werden können.

## Einrichtung der Testumgebung

Die CultureStream-Plattform verwendet Jest als Test-Framework. Die Testumgebung ist so konfiguriert, dass DOM-Manipulationen, Events und andere Browser-APIs simuliert werden können.

### Technologie-Stack

- **Jest**: Test-Runner und Test-Framework
- **Jest-Environment-JSDOM**: Simuliert die DOM-Umgebung für Tests
- **Babel**: Kompiliert modernen JavaScript-Code für die Tests
- **jest-html-reporters**: Generiert HTML-Berichte für die Testergebnisse

## Test ausführen

Es gibt mehrere Möglichkeiten, die Tests auszuführen:

### Über NPM-Skripte

```bash
# Alle Tests einmalig ausführen
npm test

# Tests im Watch-Modus ausführen (bei Dateiänderungen automatisch neu ausführen)
npm run test:watch

# Tests mit Coverage-Report ausführen
npm run test:coverage
```

### Über das Test-Runner-Skript

Wir bieten ein Shell-Skript an, das den Testprozess vereinfacht und die Testergebnisse öffnet:

```bash
# Alle Tests ausführen
./scripts/run-tests.sh

# Tests im Watch-Modus ausführen
./scripts/run-tests.sh watch

# Tests mit Coverage-Report ausführen
./scripts/run-tests.sh coverage
```

## Testberichte

Nach der Testausführung werden zwei Arten von Berichten generiert:

1. **HTML-Bericht**: `test-reports/report.html` - Visualisiert die Testergebnisse in einer benutzerfreundlichen Oberfläche
2. **Coverage-Bericht**: `coverage/lcov-report/index.html` - Zeigt, welcher Teil des Codes durch Tests abgedeckt ist

## Teststruktur

Die Tests sind nach Modulen der Anwendung organisiert:

```
tests/
  ├── scripts.test.js          # Tests für das CultureStream JS-Framework
  ├── form-validation.test.js  # Tests für die Formularvalidierung
  ├── mocks/                   # Mock-Dateien für Tests
  │   ├── styleMock.js         # Mock für CSS-Dateien
  │   └── fileMock.js          # Mock für Bilddateien
  └── setup.js                 # Globales Setup für alle Tests
```

## Neue Tests schreiben

### Dateistruktur

Neue Testdateien sollten im `tests/`-Verzeichnis erstellt werden und das Format `name.test.js` verwenden.

### Grundlegendes Testbeispiel

```javascript
// Eine Funktion aus der Anwendung importieren oder mocken
const { myFunction } = require('../path/to/module');

// Beschreibung der Testgruppe
describe('Meine Funktionalität', () => {
  // Einzelner Test
  test('sollte korrekt funktionieren', () => {
    // Arrange - Vorbereitung
    const input = 'test';
    
    // Act - Ausführung
    const result = myFunction(input);
    
    // Assert - Überprüfung
    expect(result).toBe('expected output');
  });
});
```

### DOM-Tests

Für DOM-Tests steht ein Mock-System zur Verfügung:

```javascript
test('DOM-Elemente manipulieren', () => {
  // Mock-Element erstellen
  const button = document.createElement('button');
  document.body.appendChild(button);
  
  // Event-Handler hinzufügen
  button.addEventListener('click', () => {
    button.textContent = 'Geklickt';
  });
  
  // Event auslösen
  button.click();
  
  // Ergebnis überprüfen
  expect(button.textContent).toBe('Geklickt');
});
```

## Mock-System

Die Testumgebung bietet ein umfassendes Mock-System:

### DOM-Mocks

- `document.createElement`
- `document.querySelector`
- `document.querySelectorAll`
- Event-Handling (`addEventListener`, `removeEventListener`, `dispatchEvent`)
- Element-Eigenschaften (classList, style, attributes)

### Browser-API-Mocks

- LocalStorage
- Fetch-API
- IntersectionObserver
- CustomEvent
- MatchMedia

## Best Practices

1. **Isolation**: Jeder Test sollte unabhängig von anderen Tests sein.
2. **Arrangieren-Handeln-Behaupten**: Strukturiere Tests in diese drei Phasen.
3. **Deskriptive Namen**: Verwende aussagekräftige Namen für Tests und Testgruppen.
4. **Mocks vermeiden, wenn möglich**: Bevorzuge echte Implementierungen gegenüber Mocks, wenn sie einfach und deterministisch sind.
5. **Tests für Edge Cases**: Schreibe Tests für Grenzfälle und Fehlerszenarien.

## Fehlerbehebung

### Häufige Probleme

1. **DOM-Elemente nicht gefunden**
   - Stelle sicher, dass die DOM-Elemente im Test erstellt werden oder gemockt sind.

2. **Asynchrone Tests schlagen fehl**
   - Verwende `async/await` oder Promises in asynchronen Tests.
   
   ```javascript
   test('asynchroner Test', async () => {
     const result = await asyncFunction();
     expect(result).toBe('expected');
   });
   ```

3. **Mocks funktionieren nicht**
   - Überprüfe, ob das Mock im richtigen Scope erstellt wurde und vor dem Test.

## Integrationstests und E2E-Tests

Die nächsten Schritte in der Testentwicklung sind:

1. **Integrationstests**: Tests, die die Interaktion zwischen Komponenten überprüfen.
2. **End-to-End-Tests**: Tests, die den Benutzerfluss durch die Anwendung simulieren.

Diese werden in kommenden Sprints implementiert.

## Ressourcen

- [Jest-Dokumentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [MDN Web Docs - Testing](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing) 