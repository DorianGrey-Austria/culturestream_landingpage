# Learnings bei der PHP-Entwicklung mit MAMP

## Fehler: Dateien werden nicht angezeigt/ausgeführt trotz korrektem Code

### Problem
Ein häufiger Fehler bei der Arbeit mit MAMP ist, dass PHP-Dateien erstellt werden, aber nicht im Browser angezeigt werden können, weil sie sich nicht im korrekten Verzeichnis befinden.

**Symptome:**
- Weiße/leere Seite im Browser
- "Not Found" Fehlermeldung
- PHP-Code wird als Plaintext angezeigt statt ausgeführt
- Dateien existieren, werden aber nicht korrekt verarbeitet

### Ursache
Die Dateien wurden nicht direkt im MAMP htdocs-Verzeichnis oder einem Unterordner davon gespeichert, sondern in einem anderen Verzeichnis. MAMP kann nur auf Dateien zugreifen, die sich im Document Root (standardmäßig `/Applications/MAMP/htdocs/`) befinden.

In unserem konkreten Fall: Die Dateien wurden nur in der Projektstruktur erstellt, aber nicht in das MAMP htdocs-Verzeichnis verschoben.

### Lösung
1. Stelle sicher, dass alle Webdateien im korrekten Verzeichnis gespeichert werden:
   - Hauptverzeichnis: `/Applications/MAMP/htdocs/`
   - Projektverzeichnis: `/Applications/MAMP/htdocs/vereinsintern/`

2. Beim Erstellen von Dateien immer den vollständigen Pfad überprüfen

3. Wenn Dateien an einem anderen Ort erstellt wurden, müssen sie in das htdocs-Verzeichnis verschoben werden:
   ```bash
   # Beispiel für das Verschieben von Dateien
   mv ~/Desktop/meinprojekt/* /Applications/MAMP/htdocs/meinprojekt/
   ```

### Prävention
- **Arbeitsablauf festlegen:** Immer direkt im htdocs-Verzeichnis oder einem Unterordner arbeiten
- **Pfadverständnis:** MAMP-URL-Struktur verstehen: `http://localhost:8888/` entspricht `/Applications/MAMP/htdocs/`
- **Konsistenz:** Editoren so konfigurieren, dass sie standardmäßig im richtigen Verzeichnis öffnen/speichern
- **Checkliste:** Bei Problemen immer als erstes den Dateipfad überprüfen

### Schnelltest
Um zu prüfen, ob PHP grundsätzlich funktioniert, eine einfache Test-Datei erstellen:
```php
<?php echo "TEST"; ?>
```
Speichere diese als `test.php` im htdocs-Verzeichnis und rufe `http://localhost:8888/test.php` auf. 