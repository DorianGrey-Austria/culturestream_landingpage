<?php
/**
 * @file admin/logout.php
 * @description Abmeldeskript für den vereinsinternen Bereich
 * @created <?php echo date('Y-m-d'); ?>
 */

// Authentifizierung einbinden
require_once __DIR__ . '/../includes/auth/auth.php';

// Session starten
session_start();

// Benutzer abmelden
logoutUser();

// Auf die Login-Seite umleiten
header('Location: ../public/index.php');
exit;
?>