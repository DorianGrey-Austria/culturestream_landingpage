import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { Violinist } from './Violinist'

interface PortalProps {
  scale?: number
  position?: THREE.Vector3 | [x: number, y: number, z: number]
  rotation?: THREE.Euler | [x: number, y: number, z: number]
}

/**
 * 3D Portal Komponente
 * Ein stilisiertes Portal-Modell mit Glaseffekt und Animation
 * 
 * @component
 * @param {Object} props - Die Komponenten-Properties
 * @param {number} props.scale - Skalierungsfaktor des Portals
 * @param {[number, number, number]} props.position - Position des Portals [x, y, z]
 * @param {[number, number, number]} props.rotation - Rotation des Portals [x, y, z]
 */
export function Portal({ 
  scale = 1, 
  position = new THREE.Vector3(0, 0, 0), 
  rotation = new THREE.Euler(0, 0, 0) 
}: PortalProps) {
  const portalRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  // Animation Loop
  useFrame((state) => {
    if (portalRef.current) {
      if (isHovered) {
        // Sanfte Rotation von vorne nach hinten
        const targetRotation = Math.PI
        portalRef.current.rotation.y += (targetRotation - portalRef.current.rotation.y) * 0.1
      } else {
        // Zurück zur Ausgangsposition (Vorderseite)
        portalRef.current.rotation.y *= 0.95
      }
      // Leichte Schwebe-Animation
      portalRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group 
      ref={portalRef} 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      {/* Äußerer Ring */}
      <mesh>
        <torusGeometry args={[2, 0.2, 16, 100]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          roughness={0}
          metalness={0}
          transmission={1}
          distortion={0.5}
          distortionScale={1}
          temporalDistortion={0.1}
          chromaticAberration={0.5}
          color="#88ccff"
        />
      </mesh>

      {/* Innere Fläche */}
      <mesh>
        <circleGeometry args={[1.8, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          roughness={0}
          metalness={0}
          transmission={1}
          distortion={0.5}
          distortionScale={1}
          temporalDistortion={0.1}
          chromaticAberration={0.5}
          color="#aaddff"
        />
      </mesh>

      {/* Energielinien */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} rotation={[0, 0, (Math.PI * 2 * i) / 8]}>
          <boxGeometry args={[0.05, 2, 0.05]} />
          <meshStandardMaterial
            color="#4488ff"
            emissive="#4488ff"
            emissiveIntensity={2}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      {/* Geiger */}
      <Violinist 
        scale={1.2} 
        position={new THREE.Vector3(0, -0.2, 0.5)} 
        rotation={new THREE.Euler(0, Math.PI, 0)}
        isHovered={isHovered}
      />
    </group>
  )
} 