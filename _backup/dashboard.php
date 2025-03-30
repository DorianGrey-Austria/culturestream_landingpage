<?php
/**
 * @file admin/dashboard.php
 * @description Dashboard für den vereinsinternen Bereich
 * @created <?php echo date('Y-m-d'); ?>
 */

// Konfiguration und Authentifizierung einbinden
require_once __DIR__ . '/../includes/config/config.php';
require_once __DIR__ . '/../includes/auth/auth.php';

// Session starten
session_start();

// Zugriffskontrolle - nur für angemeldete Benutzer
if (!isLoggedIn()) {
    // Nicht angemeldet, Umleitung zur Login-Seite
    header('Location: ../public/index.php');
    exit;
}

// Benutzerdaten aus der Session holen
$userId = $_SESSION['user_id'];
$username = $_SESSION['username'];
$userRole = $_SESSION['role'];
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vereinsintern - Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .admin-header {
            background: #333;
            color: #fff;
            padding: 15px 20px;
            border-radius: 5px 5px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .user-info {
            font-size: 0.9em;
        }
        .admin-nav {
            background: #444;
            border-radius: 0 0 5px 5px;
            margin-bottom: 20px;
        }
        .admin-nav ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
        }
        .admin-nav a {
            color: #fff;
            text-decoration: none;
            padding: 10px 15px;
            display: block;
        }
        .admin-nav a:hover, .admin-nav a.active {
            background: #555;
        }
        .admin-content {
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .dashboard-widgets {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .widget {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
        }
        .btn {
            display: inline-block;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
        }
        .btn-sm {
            padding: 4px 8px;
            font-size: 0.9em;
        }
        .btn-outline {
            background: transparent;
            border: 1px solid #fff;
            color: #fff;
        }
        .btn-outline:hover {
            background: rgba(255,255,255,0.1);
        }
        footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="admin-header">
            <h1>Vereinsintern</h1>
            <div class="user-info">
                Angemeldet als: <strong><?php echo htmlspecialchars($username); ?></strong> 
                (<?php echo htmlspecialchars($userRole); ?>)
                <a href="logout.php" class="btn btn-sm btn-outline">Abmelden</a>
            </div>
        </header>
        
        <nav class="admin-nav">
            <ul>
                <li><a href="dashboard.php" class="active">Dashboard</a></li>
                <?php if ($userRole === 'admin'): ?>
                <li><a href="users.php">Benutzerverwaltung</a></li>
                <?php endif; ?>
                <li><a href="profile.php">Mein Profil</a></li>
                <!-- Weitere Menüpunkte hier -->
            </ul>
        </nav>
        
        <main class="admin-content">
            <h2>Dashboard</h2>
            
            <div class="dashboard-widgets">
                <div class="widget">
                    <h3>Willkommen zurück!</h3>
                    <p>Du bist erfolgreich im vereinsinternen Bereich angemeldet.</p>
                </div>
                
                <!-- Weitere Dashboard-Widgets hier -->
                <div class="widget">
                    <h3>Dokumente</h3>
                    <p>Hier findest du wichtige Vereinsdokumente.</p>
                    <p><em>Noch keine Dokumente verfügbar.</em></p>
                </div>
                
                <div class="widget">
                    <h3>Ankündigungen</h3>
                    <p>Aktuelle Informationen für Vereinsmitglieder.</p>
                    <p><em>Keine aktuellen Ankündigungen.</em></p>
                </div>
            </div>
        </main>
        
        <footer>
            <p>&copy; <?php echo date('Y'); ?> Vereinsintern. Alle Rechte vorbehalten.</p>
        </footer>
    </div>
</body>
</html>