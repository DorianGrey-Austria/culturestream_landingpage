'use client'; // Dies kennzeichnet die Komponente als Client-Komponente

import { useEffect, useRef } from 'react'
import { 
  WebGLRenderer, 
  Scene, 
  PerspectiveCamera, 
  DirectionalLight, 
  AmbientLight, 
  Vector3,
  Color,
  Quaternion,
  Matrix4
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// @ts-ignore
import ThreeGlobe from 'three-globe'
import countriesData from './countries.json'

/**
 * Portal-Standorte und ihre Verbindungen
 * Definiert die geografischen Koordinaten der Portale und ihre Verbindungen untereinander
 */
const PORTAL_LOCATIONS = {
  wien: { name: 'Wien', lat: 48.2082, lng: 16.3719 },
  kairo: { name: 'Kairo', lat: 30.0444, lng: 31.2357 },
  sydney: { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  tokyo: { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  newYork: { name: 'New York', lat: 40.7128, lng: -74.0060 },
  nairobi: { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
  rio: { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 }
}

/**
 * Verbindungen zwischen den Portalen
 * Jede Verbindung definiert Start- und Endpunkt sowie eine Farbe
 */
const PORTAL_CONNECTIONS = [
  // Europa (Wien) Verbindungen
  {
    start: PORTAL_LOCATIONS.wien,
    end: PORTAL_LOCATIONS.newYork,
    color: '#ff3333'
  },
  {
    start: PORTAL_LOCATIONS.wien,
    end: PORTAL_LOCATIONS.tokyo,
    color: '#33ff33'
  },
  {
    start: PORTAL_LOCATIONS.wien,
    end: PORTAL_LOCATIONS.kairo,
    color: '#3333ff'
  },
  {
    start: PORTAL_LOCATIONS.wien,
    end: PORTAL_LOCATIONS.sydney,
    color: '#ff33ff'
  },
  // Asien (Tokyo) Verbindungen
  {
    start: PORTAL_LOCATIONS.tokyo,
    end: PORTAL_LOCATIONS.sydney,
    color: '#ffff33'
  },
  {
    start: PORTAL_LOCATIONS.tokyo,
    end: PORTAL_LOCATIONS.newYork,
    color: '#33ffff'
  },
  // Amerika (New York) Verbindungen
  {
    start: PORTAL_LOCATIONS.newYork,
    end: PORTAL_LOCATIONS.sydney,
    color: '#ff9933'
  },
  {
    start: PORTAL_LOCATIONS.newYork,
    end: PORTAL_LOCATIONS.rio,
    color: '#ff3366'
  },
  // Afrika (Kairo) Verbindungen
  {
    start: PORTAL_LOCATIONS.kairo,
    end: PORTAL_LOCATIONS.sydney,
    color: '#9933ff'
  },
  {
    start: PORTAL_LOCATIONS.kairo,
    end: PORTAL_LOCATIONS.nairobi,
    color: '#ff66cc'
  },
  // Afrika (Nairobi) Verbindungen
  {
    start: PORTAL_LOCATIONS.nairobi,
    end: PORTAL_LOCATIONS.sydney,
    color: '#66ff99'
  },
  {
    start: PORTAL_LOCATIONS.nairobi,
    end: PORTAL_LOCATIONS.tokyo,
    color: '#cc99ff'
  },
  // Südamerika (Rio) Verbindungen
  {
    start: PORTAL_LOCATIONS.rio,
    end: PORTAL_LOCATIONS.sydney,
    color: '#66ccff'
  },
  {
    start: PORTAL_LOCATIONS.rio,
    end: PORTAL_LOCATIONS.nairobi,
    color: '#ffcc66'
  },
  {
    start: PORTAL_LOCATIONS.rio,
    end: PORTAL_LOCATIONS.wien,
    color: '#99ff66'
  }
]

/**
 * Interface für Portal-Daten mit Hover-Status
 */
interface PortalData extends HtmlElementData {
  __isHovered?: boolean;
}

/**
 * Interface für die HTML-Element-Daten
 */
interface HtmlElementData {
  lat: number;
  lng: number;
  name: string;
}

/**
 * Erzeugt ein vereinfachtes Portal-Symbol als HTML-Element
 */
const createPortalMarker = (name: string): HTMLDivElement => {
  const container = document.createElement('div');
  container.style.cssText = `
    position: relative;
    transform: translate(-50%, -50%);
    z-index: 1000;
    pointer-events: all;
  `;

  // Leuchtender Punkt
  const dot = document.createElement('div');
  dot.style.cssText = `
    width: 12px;
    height: 12px;
    background: #00ffff;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
    animation: pulse 2s infinite;
    position: absolute;
    left: 0;
    top: 0;
  `;

  // Stadtname (permanent sichtbar, rechts neben dem Punkt)
  const label = document.createElement('div');
  label.style.cssText = `
    position: absolute;
    left: 20px; /* Abstand zum Punkt */
    top: -10px;
    color: #00ffff;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 
      0 0 10px #00ffff,
      0 0 20px #00ffff,
      0 0 30px rgba(0,255,255,0.5);
    white-space: nowrap;
    background: rgba(0, 0, 0, 0.7);
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid rgba(0, 255, 255, 0.3);
  `;
  label.textContent = name;

  // Hover-Effekte
  container.addEventListener('mouseenter', () => {
    dot.style.transform = 'scale(1.5)';
    label.style.transform = 'scale(1.1)';
    dot.style.boxShadow = '0 0 20px #ffffff, 0 0 40px #ffffff';
    label.style.color = '#ffffff';
    label.style.textShadow = '0 0 10px #ffffff, 0 0 20px #ffffff';
  });

  container.addEventListener('mouseleave', () => {
    dot.style.transform = 'scale(1)';
    label.style.transform = 'scale(1)';
    dot.style.boxShadow = '0 0 10px #00ffff, 0 0 20px #00ffff';
    label.style.color = '#00ffff';
    label.style.textShadow = '0 0 10px #00ffff, 0 0 20px #00ffff';
  });

  // Animationen
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;

  container.appendChild(style);
  container.appendChild(dot);
  container.appendChild(label);
  
  return container;
}

/**
 * Konvertiert Längen- und Breitengrad in 3D-Koordinaten
 * Verwendet die ThreeGlobe-Konvention:
 * x = R * cos(φ) * sin(λ)
 * y = R * sin(φ)
 * z = R * cos(φ) * cos(λ)
 */
const latLngToVector3 = (lat: number, lng: number, radius: number = 100): Vector3 => {
  // Konvertiere zu Radianten
  const phi = lat * Math.PI / 180;
  const lambda = lng * Math.PI / 180;
  
  // Berechne die Koordinaten mit korrigiertem x-Wert
  const x = radius * Math.cos(phi) * Math.sin(lambda);
  const y = radius * Math.sin(phi);
  const z = radius * Math.cos(phi) * Math.cos(lambda);
  
  return new Vector3(x, y, z);
};

/**
 * 3D Globus Komponente
 * Ein interaktiver Globus mit Verbindungslinien zwischen Portal-Standorten
 * 
 * @component
 * @param {Object} props - Die Komponenten-Properties
 * @param {number} props.scale - Skalierungsfaktor des Globus
 * @param {[number, number, number]} props.position - Position des Globus [x, y, z]
 * @param {[number, number, number]} props.rotation - Rotation des Globus [x, y, z]
 */
export function Globe({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return

    // Szene Setup
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Standort-Anzeige erstellen
    const locationDisplay = document.createElement('div')
    locationDisplay.style.cssText = `
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.7);
      padding: 20px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      font-family: sans-serif;
      min-width: 200px;
    `

    // Titel für Standort-Anzeige
    const locationTitle = document.createElement('div')
    locationTitle.textContent = 'Aktuelle Portal Verbindung'
    locationTitle.style.cssText = `
      color: white;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      text-align: center;
    `
    locationDisplay.appendChild(locationTitle)

    // Aktueller Standort
    const currentLocation = document.createElement('div')
    currentLocation.style.cssText = `
      color: #00ffff;
      margin-bottom: 20px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
    `
    currentLocation.innerHTML = '<strong>Portal eins:</strong> Keine Stadt ausgewählt'
    locationDisplay.appendChild(currentLocation)

    // Vorheriger Standort
    const previousLocation = document.createElement('div')
    previousLocation.style.cssText = `
      color: #ffaa00;
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
    `
    previousLocation.innerHTML = '<strong>Portal zwei:</strong> Keine Stadt ausgewählt'
    locationDisplay.appendChild(previousLocation)

    container.appendChild(locationDisplay)

    // Städteliste erstellen
    const cityList = document.createElement('div')
    cityList.style.cssText = `
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.7);
      padding: 20px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 1000;
      font-family: sans-serif;
    `

    // Titel hinzufügen
    const title = document.createElement('div')
    title.textContent = 'Portal Standorte'
    title.style.cssText = `
      color: white;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      text-align: center;
    `
    cityList.appendChild(title)

    // Städte mit ihren Verbindungsfarben auflisten
    Object.entries(PORTAL_LOCATIONS).forEach(([key, city]) => {
      const cityColor = PORTAL_CONNECTIONS.find(conn => 
        conn.start.name === city.name || conn.end.name === city.name
      )?.color || '#ffffff'

      const cityElement = document.createElement('div')
      cityElement.style.cssText = `
        display: flex;
        align-items: center;
        margin: 10px 0;
        padding: 8px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        cursor: pointer; produktiv
      `

      // Punkt
      const dot = document.createElement('div')
      dot.style.cssText = `
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${cityColor};
        margin-right: 10px;
        box-shadow: 0 0 10px ${cityColor};
        transition: all 0.3s ease; 
      `

      // Stadtname
      const name = document.createElement('div')
      name.textContent = city.name
      name.style.cssText = `
        color: ${cityColor};
        font-size: 16px;
        text-shadow: 0 0 10px ${cityColor};
        transition: all 0.3s ease;
      `

      // Klick-Handler für Kamera-Animation
      cityElement.addEventListener('click', () => {
        const prevCity = currentLocation.textContent?.split(': ')[1] || 'Keine Stadt ausgewählt';
        const newCity = city.name;

        // Nur aktualisieren, wenn sich die Stadt geändert hat
        if (newCity !== prevCity) {
          previousLocation.innerHTML = `<strong>Portal zwei:</strong> ${prevCity}`;
          currentLocation.innerHTML = `<strong>Portal eins:</strong> ${newCity}`;
          updateConnections(newCity, prevCity);
        }

        // Debug-Ausgabe der Koordinaten
        console.log(`Clicking ${city.name}:`, {
          lat: city.lat,
          lng: city.lng,
          position: latLngToVector3(city.lat, city.lng, 100)
        });

        // Controls temporär deaktivieren
        controls.enabled = false;

        // Position der Stadt auf der Kugel berechnen
        const cityPosition = latLngToVector3(city.lat, city.lng, 100);
        
        // Startposition der Kamera speichern
        const startCameraPos = camera.position.clone();
        const startCameraLookAt = controls.target.clone();
        
        // Zielposition der Kamera berechnen (etwas versetzt von der Stadt)
        const targetCameraPos = cityPosition.clone().multiplyScalar(2.5); // Kamera weiter außen
        const targetLookAt = new Vector3(0, 0, 0); // Immer zum Zentrum schauen
        
        // Animationsparameter
        const duration = 2000;
        const startTime = Date.now();

        // Animationsfunktion
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing-Funktion für sanftere Animation
          const easeProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          // Kamera Position interpolieren
          camera.position.lerpVectors(startCameraPos, targetCameraPos, easeProgress);
          
          // LookAt-Punkt interpolieren
          controls.target.lerpVectors(startCameraLookAt, targetLookAt, easeProgress);
          controls.update();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            // Animation beendet
            setTimeout(() => {
              controls.enabled = true;
            }, 1000);
          }
        };

        animate();
      });

      // Hover-Effekte
      cityElement.addEventListener('mouseenter', () => {
        cityElement.style.background = 'rgba(255, 255, 255, 0.2)';
        dot.style.transform = 'scale(1.2)';
        name.style.transform = 'translateX(5px)';
      });

      cityElement.addEventListener('mouseleave', () => {
        cityElement.style.background = 'rgba(255, 255, 255, 0.1)';
        dot.style.transform = 'scale(1)';
        name.style.transform = 'translateX(0)';
      });

      cityElement.appendChild(dot);
      cityElement.appendChild(name);
      cityList.appendChild(cityElement);
    })

    container.appendChild(cityList)
    
    // Canvas erstellen und zum Container hinzufügen
    const canvas = document.createElement('canvas')
    container.appendChild(canvas)
    
    const renderer = new WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      canvas: canvas
    })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)

    const scene = new Scene()
    const camera = new PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 300

    // Verbesserte Beleuchtung
    const ambientLight = new AmbientLight(0x8888ff, 1.0)
    scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xfff0d8, 1.5)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    const directionalLight2 = new DirectionalLight(0xfff0d8, 0.5)
    directionalLight2.position.set(-1, -0.5, -1)
    scene.add(directionalLight2)

    // Globe Initialisierung
    const globe = new ThreeGlobe()
      .globeImageUrl('/images/earth-blue-marble.jpg')
      .bumpImageUrl('/images/earth-topology.png')
      .hexPolygonsData(countriesData.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .hexPolygonColor(() => '#ffffff33')
      // Verbindungslinien
      .arcsData(PORTAL_CONNECTIONS.map(conn => ({
        startLat: conn.start.lat,
        startLng: conn.start.lng,
        endLat: conn.end.lat,
        endLng: conn.end.lng,
        color: conn.color,
        stroke: 0.5 // Standard-Linienbreite
      })))
      .arcColor('color')
      .arcDashLength(0.3)
      .arcDashGap(0.2)
      .arcDashInitialGap(() => Math.random())
      .arcDashAnimateTime(1500)
      .arcStroke('stroke') // Verwende die individuelle Linienbreite
      .arcsTransitionDuration(1000)
      .atmosphereColor('#89cff0')
      .atmosphereAltitude(0.25)

    // Funktion zum Aktualisieren der Verbindungslinien
    const updateConnections = (selectedCity: string, previousCity: string) => {
      if (!previousCity || previousCity === 'Keine Stadt ausgewählt') {
        return;
      }

      // Hilfsfunktion zum Erstellen eines Graphen aus den Verbindungen
      const createGraph = () => {
        const graph: { [key: string]: string[] } = {};
        PORTAL_CONNECTIONS.forEach(conn => {
          if (!graph[conn.start.name]) graph[conn.start.name] = [];
          if (!graph[conn.end.name]) graph[conn.end.name] = [];
          graph[conn.start.name].push(conn.end.name);
          graph[conn.end.name].push(conn.start.name);
        });
        return graph;
      };

      // Breitensuche zum Finden des kürzesten Pfads
      const findShortestPath = (start: string, end: string) => {
        const graph = createGraph();
        const queue = [[start]];
        const visited = new Set([start]);

        while (queue.length > 0) {
          const path = queue.shift()!;
          const current = path[path.length - 1];

          if (current === end) {
            return path;
          }

          for (const neighbor of graph[current] || []) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push([...path, neighbor]);
            }
          }
        }
        return null;
      };

      // Finde den kürzesten Pfad zwischen den ausgewählten Städten
      const path = findShortestPath(selectedCity, previousCity);
      
      if (!path) {
        console.log('Kein Pfad gefunden zwischen:', selectedCity, previousCity);
        return;
      }

      // Erstelle Paare von aufeinanderfolgenden Städten im Pfad
      const connectionPairs: [string, string][] = [];
      for (let i = 0; i < path.length - 1; i++) {
        connectionPairs.push([path[i], path[i + 1]] as [string, string]);
      }

      // Aktualisiere die Verbindungslinien
      const newArcsData = PORTAL_CONNECTIONS.map(conn => {
        const isOnPath = connectionPairs.some(
          ([city1, city2]) =>
            (conn.start.name === city1 && conn.end.name === city2) ||
            (conn.start.name === city2 && conn.end.name === city1)
        );

        return {
          startLat: conn.start.lat,
          startLng: conn.start.lng,
          endLat: conn.end.lat,
          endLng: conn.end.lng,
          color: conn.color,
          stroke: isOnPath ? 3 : 0.5
        };
      });

      globe.arcsData(newArcsData);
    };

    // Initiale Rotation setzen (reduziert für bessere Orientierung)
    globe.rotation.x = Math.PI / 12; // Leichtere Neigung
    
    scene.add(globe)

    // Orbit Controls für Interaktivität (ohne Auto-Rotation)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = true
    controls.minDistance = 150
    controls.maxDistance = 400
    controls.enablePan = false

    // Animation Loop
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Responsive Handling
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      scene.remove(globe)
      renderer.dispose()
      controls.dispose()
      if (canvas.parentElement) {
        canvas.parentElement.removeChild(canvas)
      }
      if (cityList.parentElement) {
        cityList.parentElement.removeChild(cityList)
      }
      if (locationDisplay.parentElement) {
        locationDisplay.parentElement.removeChild(locationDisplay)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full relative" />
  )
} 