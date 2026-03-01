'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Text, Stars, MeshDistortMaterial, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'

function BronzeParticles({ count = 500, scrollProgress = 0 }: { count?: number; scrollProgress?: number }) {
  const mesh = useRef<THREE.Points>(null)
  
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = Math.random() * 0.003 + 0.001
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
    return { positions: pos, velocities: vel }
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const posArray = mesh.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      posArray[i * 3] += data.velocities[i * 3]
      posArray[i * 3 + 1] += data.velocities[i * 3 + 1]
      posArray[i * 3 + 2] += data.velocities[i * 3 + 2]
      
      if (posArray[i * 3 + 1] > 10) {
        posArray[i * 3 + 1] = -10
        posArray[i * 3] = (Math.random() - 0.5) * 20
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={data.positions}
          itemSize={3}
          args={[data.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#B07A45"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function BronzeVLogo({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.15
    
    // Scale based on scroll — logo gets bigger as you scroll to reveal section
    const scale = 0.8 + scrollProgress * 0.4
    groupRef.current.scale.setScalar(scale)
    
    if (glowRef.current) {
      const glowScale = 1.5 + Math.sin(t * 2) * 0.1
      glowRef.current.scale.setScalar(glowScale)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef}>
        {/* Main V shape using two angled planes */}
        <mesh position={[-0.4, 0, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.15, 2, 0.15]} />
          <meshStandardMaterial
            color="#B07A45"
            metalness={0.9}
            roughness={0.1}
            emissive="#B07A45"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0.4, 0, 0]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.15, 2, 0.15]} />
          <meshStandardMaterial
            color="#B07A45"
            metalness={0.9}
            roughness={0.1}
            emissive="#B07A45"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Glow sphere behind logo */}
        <mesh ref={glowRef} position={[0, 0, -0.5]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#B07A45"
            transparent
            opacity={0.05}
          />
        </mesh>
      </group>
    </Float>
  )
}

function FloatingGeometry() {
  const group = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.05
    group.current.rotation.x = state.clock.elapsedTime * 0.03
  })

  return (
    <group ref={group}>
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 5 + Math.random() * 3
        return (
          <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.5}>
            <mesh
              position={[
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 4,
                Math.sin(angle) * radius
              ]}
            >
              <icosahedronGeometry args={[0.3 + Math.random() * 0.3, 0]} />
              <meshStandardMaterial
                color="#B07A45"
                wireframe
                transparent
                opacity={0.15}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

function CameraController({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const { camera } = useThree()
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    
    // Camera moves based on scroll
    const targetZ = 8 - scrollProgress * 3
    const targetY = scrollProgress * 2
    const targetX = Math.sin(t * 0.1) * 0.3
    
    camera.position.x += (targetX - camera.position.x) * 0.02
    camera.position.y += (targetY - camera.position.y) * 0.02
    camera.position.z += (targetZ - camera.position.z) * 0.02
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

function InnerScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <>
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 5, 25]} />
      
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#B07A45" />
      <pointLight position={[-5, -5, -5]} intensity={0.3} color="#4a6fa5" />
      <spotLight
        position={[0, 10, 0]}
        intensity={0.5}
        color="#B07A45"
        angle={0.3}
        penumbra={0.8}
      />
      
      <BronzeVLogo scrollProgress={scrollProgress} />
      <BronzeParticles count={600} scrollProgress={scrollProgress} />
      <FloatingGeometry />
      <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />
      
      <CameraController scrollProgress={scrollProgress} />
      
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          radius={0.8}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
        <Noise opacity={0.04} />
      </EffectComposer>
    </>
  )
}

export default function Scene3D({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <InnerScene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
