#!/bin/bash

# CultureStream Test Runner
# Dieses Skript führt Tests aus und öffnet den Testreport

echo "CultureStream Test Runner"
echo "========================="

# Verzeichnisse für Test-Ausgaben erstellen
mkdir -p test-reports
mkdir -p coverage

# Port bereinigen
function cleanup_port() {
  echo "Bereinige Port 3000..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    lsof -i :3000 -t | xargs kill -9 2>/dev/null || true
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    fuser -k 3000/tcp 2>/dev/null || true
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows mit Git Bash oder ähnlichem
    netstat -ano | findstr :3000 | awk '{print $5}' | xargs taskkill /F /PID 2>/dev/null || true
  fi
}

# Prüfen, ob Testmodus angegeben wurde
TEST_MODE="all"
if [ "$1" != "" ]; then
  TEST_MODE=$1
fi

# Tests starten basierend auf Modus
cleanup_port

if [ "$TEST_MODE" == "watch" ]; then
  echo "Starte Tests im Watch-Modus..."
  npx jest --watch
elif [ "$TEST_MODE" == "coverage" ]; then
  echo "Starte Tests mit Coverage-Report..."
  npx jest --coverage
  
  # Öffne Coverage-Report
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open coverage/lcov-report/index.html
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open coverage/lcov-report/index.html
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    start coverage/lcov-report/index.html
  fi
else
  echo "Starte alle Tests..."
  npx jest
fi

# HTML-Report öffnen
if [ -f "test-reports/report.html" ]; then
  echo "Öffne HTML-Testreport..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open test-reports/report.html
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open test-reports/report.html
  elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    start test-reports/report.html
  fi
fi

echo "Tests abgeschlossen!" 