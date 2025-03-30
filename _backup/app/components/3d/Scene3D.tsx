import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'

interface Scene3DProps {
  children: React.ReactNode
  enableOrbitControls?: boolean
  cameraPosition?: [number, number, number]
}

export default function Scene3D({ 
  children, 
  enableOrbitControls = true,
  cameraPosition = [0, 0, 5]
}: Scene3DProps) {
  return (
    <Canvas>
      <Suspense fallback={null}>
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
        />
        
        {enableOrbitControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2.5}
          />
        )}

        {/* Beleuchtung */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {children}
      </Suspense>
    </Canvas>
  )
} 