import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Stage,
  Environment,
  OrbitControls,
  useProgress,
  Html,
  useGLTF,
  useTexture,
  ContactShadows
} from '@react-three/drei'
import * as THREE from 'three'

import gsap from 'gsap'

import { EffectComposer, Bloom } from '@react-three/postprocessing'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{
        padding: '20px',
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '10px',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          width: '200px',
          height: '4px',
          background: '#333',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '10px'
        }}>
          <div 
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <p style={{ margin: 0, fontSize: '14px' }}>{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  )
}

// Your Model component (keeping your original logic)
function Model({ activeTexture, lightColor, lightIntensity, ...props }) {
  const { nodes, materials } = useGLTF('/ramses.glb')
  const groupRef = useRef()
  const upbaseRef = useRef()
  const lightbaseRef = useRef()
  
  // Load all texture sets (removed displacement maps)
  const textures = useTexture({
    // Texture Set 1
    baseColor1: '/textures/1base.jpg',
    normal1: '/textures/1norm.jpg',
    specular1: '/textures/1specular.jpg',
    ao1: '/textures/1aomap.jpg',
    
    // Texture Set 2
    baseColor2: '/textures/2base.jpg',
    normal2: '/textures/2norm.jpg',
    specular2: '/textures/2specular.jpg',
    ao2: '/textures/2aomap.jpg',
    
    // Texture Set 3
    baseColor3: '/textures/3base.jpg',
    normal3: '/textures/3norm.jpg',
    specular3: '/textures/3specular.jpg',
    ao3: '/textures/3aomap.jpg',
    
    // Texture Set 4
    baseColor4: '/textures/4base.jpg',
    normal4: '/textures/4norm.jpg',
    specular4: '/textures/4specular.jpg',
    ao4: '/textures/4aomap.jpg',
  })

  // Configure textures for better quality and scale them down 5x
  Object.values(textures).forEach(texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(10,10 ) // Scale down by 5x (textures repeat 5 times)
    texture.flipY = false
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 16
  })

  // Create materials for each texture set (for Upbase/table) - removed displacement maps
  const tableMaterials = useMemo(() => {
    const materials = {}
    for (let i = 1; i <= 4; i++) {
      materials[i] = new THREE.MeshStandardMaterial({
        map: textures[`baseColor${i}`],
        normalMap: textures[`normal${i}`],
        roughnessMap: textures[`specular${i}`],
        aoMap: textures[`ao${i}`],
        aoMapIntensity: 1,
        roughness: 0.98,
        metalness: 0.01,
        normalScale: new THREE.Vector2(1,1),
      })
      
      // Set the second UV channel for AO map if available
      if (materials[i].aoMap) {
        materials[i].aoMap.channel = 1
      }
    }
    return materials
  }, [textures])

  // Light material with emissive properties (for Lightbase)
  const lightMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: lightColor,
      emissive: lightColor,
      emissiveIntensity: lightIntensity,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    })
  }, [lightColor, lightIntensity])

  // Update Upbase material when activeTexture changes
  useEffect(() => {
    if (upbaseRef.current && tableMaterials[activeTexture]) {
      upbaseRef.current.material = tableMaterials[activeTexture]
      upbaseRef.current.material.needsUpdate = true
    }
  }, [activeTexture, tableMaterials])

  // Update Lightbase material when color/intensity changes
  useEffect(() => {
    if (lightbaseRef.current && lightMaterial) {
      lightbaseRef.current.material = lightMaterial
      lightbaseRef.current.material.needsUpdate = true
    }
  }, [lightMaterial])


  useEffect(() => {
    if (groupRef.current) {
      gsap.fromTo(groupRef.current.scale, 
        { x: 0.95, y: 0.95, z: 0.95 },
        { 
          x: 1, y: 1, z: 1, 
          duration: 0.5, 
          ease: "back.out(1.7)" 
        }
      )
      
      gsap.fromTo(groupRef.current.rotation, 
        { y: groupRef.current.rotation.y },
        { 
          y: groupRef.current.rotation.y + Math.PI * 0.1, 
          duration: 0.3, 
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        }
      )
    }
  }, [activeTexture])


  // Subtle breathing animation and light pulsing
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
    
    if (lightbaseRef.current && lightbaseRef.current.material) {
      const pulseFactor = Math.sin(state.clock.elapsedTime * 2) * 0.2
      lightbaseRef.current.material.emissiveIntensity = lightIntensity + pulseFactor
      
      // Add subtle color shift for warmth
      const time = state.clock.elapsedTime * 0.5
      const colorShift = Math.sin(time) * 0.05
      lightbaseRef.current.material.emissive.setHex(
        new THREE.Color(lightColor).offsetHSL(0, 0, colorShift).getHex()
      )
    }
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* Upbase - Table that receives texture changes */}
      <mesh
        ref={upbaseRef}
        castShadow
        receiveShadow
        geometry={nodes.Upbase.geometry}
        material={tableMaterials[activeTexture]}
      />
      
      {/* Lightbase - Light that glows and changes color */}
      <mesh
        ref={lightbaseRef}
        castShadow
        receiveShadow
        geometry={nodes.Lightbase.geometry}
        material={lightMaterial}
      />
    </group>
  )
}

// Improved Glassmorphism UI Component
function UI({ 
  activeTexture, 
  setActiveTexture, 
  lightColor, 
  setLightColor,
  lightIntensity,
  setLightIntensity 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const textureNames = ['Wood', 'Metal', 'Stone', 'Glass']

  const presetColors = [
    '#ffffff', '#f0f0f0', '#d0d0d0', '#a0a0a0',
    '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'
  ]

  return (
    <>
      {/* Main Panel */}
      <div className="glass-panel">
        {/* Header */}
        <div className="panel-header">
          <h2 className="panel-title">
            {isCollapsed ? 'FC' : 'Configurator'}
          </h2>
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '←' : '→'}
          </button>
        </div>
        
        {!isCollapsed && (
          <div className="panel-content">
            {/* Materials */}
            <div className="section">
              <h3 className="section-title">Material</h3>
              <div className="texture-grid">
                {[1, 2, 3, 4].map((index) => (
                  <button
                    key={index}
                    className={`texture-btn ${activeTexture === index ? 'active' : ''}`}
                    onClick={() => setActiveTexture(index)}
                  >
                    <span className="texture-number">{index}</span>
                    <span className="texture-name">{textureNames[index - 1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div className="section">
              <h3 className="section-title">Lighting</h3>
              
              {/* Color Grid */}
              <div className="control">
                <label className="control-label">Color</label>
                <div className="color-grid">
                  {presetColors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-btn ${lightColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setLightColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color & Intensity */}
              <div className="dual-control">
                <div className="control">
                  <label className="control-label">Custom</label>
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="color-input"
                  />
                </div>
                <div className="control">
                  <label className="control-label">Intensity</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={lightIntensity}
                      onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                      className="slider"
                    />
                    <span className="slider-value">{lightIntensity.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions">
              <button
                className="action-btn"
                onClick={() => {
                  setActiveTexture(1)
                  setLightColor('#ffffff')
                  setLightIntensity(2)
                }}
              >
                Reset
              </button>
              <button
                className="action-btn primary"
                onClick={() => {
                  console.log('Saved:', { activeTexture, lightColor, lightIntensity })
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mobile-controls">
        {[1, 2, 3, 4].map((index) => (
          <button
            key={index}
            className={`mobile-btn ${activeTexture === index ? 'active' : ''}`}
            onClick={() => setActiveTexture(index)}
          >
            {index}
          </button>
        ))}
      </div>

      <style jsx>{`
        .glass-panel {
          position: fixed;
          top: 16px;
          right: 16px;
          width: ${isCollapsed ? '56px' : '280px'};
          max-height: 90vh;
          background: rgba(2, 0, 0, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 0, 0, 0.56);
          border-radius: 16px;
          padding: 16px;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .glass-panel::-webkit-scrollbar {
          display: none;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${isCollapsed ? '0' : '16px'};
        }

        .panel-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: white;
        }

        .collapse-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          width: 24px;
          height: 24px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .collapse-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .panel-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-title {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .texture-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .texture-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 8px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 11px;
        }

        .texture-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .texture-btn.active {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          color: white;
        }

        .texture-number {
          font-weight: 600;
          font-size: 12px;
        }

        .texture-name {
          font-size: 9px;
          opacity: 0.9;
        }

        .control {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .control-label {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
        }

        .color-btn {
          width: 24px;
          height: 24px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .color-btn:hover {
          transform: scale(1.1);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .color-btn.active {
          border-width: 2px;
          border-color: white;
          transform: scale(1.05);
        }

        .dual-control {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: end;
        }

        .color-input {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          background: none;
          cursor: pointer;
        }

        .slider-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .slider {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .slider-value {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.8);
          font-family: monospace;
          min-width: 24px;
        }

        .actions {
          display: flex;
          gap: 6px;
        }

        .action-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px 12px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 11px;
          font-weight: 500;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-1px);
        }

        .action-btn.primary {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .mobile-controls {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 8px;
          z-index: 1000;
        }

        .mobile-btn {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
          font-size: 14px;
        }

        .mobile-btn:hover,
        .mobile-btn.active {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .glass-panel {
            top: 12px;
            right: 12px;
            width: ${isCollapsed ? '48px' : '260px'};
            padding: 12px;
          }

          .texture-grid {
            grid-template-columns: 1fr;
            gap: 4px;
          }

          .dual-control {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>
    </>
  )
}

export default function FurnitureConfigurator() {
  const [activeTexture, setActiveTexture] = useState(1)
  const [lightColor, setLightColor] = useState('#ffffff')
  const [lightIntensity, setLightIntensity] = useState(2)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 45 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#ffffff']} />
        
        <Suspense fallback={<Loader />}>
          <ContactShadows position={[0, -1, 0]} opacity={0.64} scale={30} blur={0.7} />
       
          <Model
            activeTexture={activeTexture}
            lightColor={lightColor}
            lightIntensity={lightIntensity}
          />
     
      <Stage adjustCamera={false} environment={'warehouse'} preset={'soft'} intensity={0.58}></Stage>
          
          <EffectComposer>
            <Bloom
              intensity={0.15}
              luminanceThreshold={0.9}
              luminanceSmoothing={15}
              height={90}
            />
          </EffectComposer>
  
        </Suspense>
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      <UI
        activeTexture={activeTexture}
        setActiveTexture={setActiveTexture}
        lightColor={lightColor}
        setLightColor={setLightColor}
        lightIntensity={lightIntensity}
        setLightIntensity={setLightIntensity}
      />
    </div>
  )
}

// Preload the model
useGLTF.preload('/ramses.glb')