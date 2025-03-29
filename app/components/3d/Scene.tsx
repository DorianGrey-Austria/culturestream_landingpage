import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamischer Import der Canvas-Komponente
const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-background/50 animate-pulse rounded-xl" />
  ),
})

/**
 * 3D-Szenen-Wrapper Komponente
 * Stellt die Grundfunktionalität für 3D-Rendering bereit
 * 
 * @component
 * @param {Object} props - Die Komponenten-Properties
 * @param {React.ReactNode} props.children - Die 3D-Elemente, die gerendert werden sollen
 * @param {boolean} props.enableOrbitControls - Ob die Orbit-Kontrollen aktiviert sein sollen
 * @param {[number, number, number]} props.cameraPosition - Position der Kamera [x, y, z]
 */
export function Scene({ 
  children, 
  enableOrbitControls = true,
  cameraPosition = [0, 0, 5]
}: {
  children: React.ReactNode
  enableOrbitControls?: boolean
  cameraPosition?: [number, number, number]
}) {
  return (
    <div className="w-full h-full">
      <Scene3D
        enableOrbitControls={enableOrbitControls}
        cameraPosition={cameraPosition}
      >
        {children}
      </Scene3D>
    </div>
  )
} 