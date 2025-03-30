<?php
// Zeige PHP-Fehler an
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Einfache Ausgabe
echo "<h1>Vereinsintern Test</h1>";
echo "<p>Wenn du diesen Text siehst, funktioniert PHP!</p>";
echo "<p>PHP-Version: " . phpversion() . "</p>";
?>
