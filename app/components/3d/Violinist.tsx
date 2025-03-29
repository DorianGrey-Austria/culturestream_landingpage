import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface ViolinistProps {
  scale?: number
  position?: THREE.Vector3 | [x: number, y: number, z: number]
  rotation?: THREE.Euler | [x: number, y: number, z: number]
  isHovered?: boolean
}

/**
 * 3D Geiger Komponente
 * Ein animierter Geiger, der sich mit dem Portal dreht
 * 
 * @component
 * @param {Object} props - Die Komponenten-Properties
 * @param {number} props.scale - Skalierungsfaktor des Geigers
 * @param {[number, number, number]} props.position - Position des Geigers [x, y, z]
 * @param {[number, number, number]} props.rotation - Rotation des Geigers [x, y, z]
 * @param {boolean} props.isHovered - Ob das übergeordnete Element gehovered ist
 */
export function Violinist({ 
  scale = 1, 
  position = new THREE.Vector3(0, 0, 0), 
  rotation = new THREE.Euler(0, 0, 0),
  isHovered = false 
}: ViolinistProps) {
  const violinistRef = useRef<THREE.Group>(null)
  
  // Basis-Geometrie für einen stilisierten Geiger
  const createViolinist = () => {
    const group = new THREE.Group()

    // Körper (größer und detaillierter)
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.2, 1.2, 12),
      new THREE.MeshPhongMaterial({ color: '#1a1a1a' })
    )
    body.position.y = 0.6
    group.add(body)

    // Kopf (größer)
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 12),
      new THREE.MeshPhongMaterial({ color: '#1a1a1a' })
    )
    head.position.y = 1.4
    group.add(head)

    // Geige (größer und detaillierter)
    const violin = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.15, 0.8),
      new THREE.MeshPhongMaterial({ color: '#8B4513' })
    )
    violin.position.set(0.5, 1.0, 0)
    violin.rotation.z = Math.PI / 6
    group.add(violin)

    // Bogen (länger)
    const bow = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.8, 0.08),
      new THREE.MeshPhongMaterial({ color: '#8B4513' })
    )
    bow.position.set(0.6, 1.0, 0.3)
    bow.rotation.z = Math.PI / 4
    group.add(bow)

    return group
  }

  // Animation Loop
  useFrame((state) => {
    if (violinistRef.current) {
      if (isHovered) {
        // Drehe den Geiger mit dem Portal
        const targetRotation = Math.PI
        violinistRef.current.rotation.y += (targetRotation - violinistRef.current.rotation.y) * 0.1
      } else {
        // Zurück zur Ausgangsposition
        violinistRef.current.rotation.y *= 0.95
      }
      // Leichte Schwebung und Geigenbewegung
      violinistRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05
      violinistRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.05
    }
  })

  return (
    <group 
      ref={violinistRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <primitive object={createViolinist()} />
    </group>
  )
} 