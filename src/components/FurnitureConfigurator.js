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

// Your Model component without dissolve and fade animations
function Model({ activeTexture, lightColor, lightIntensity, ...props }) {
  const { nodes, materials } = useGLTF('/ramses.glb')
  const groupRef = useRef()
  const upbaseRef = useRef()
  const lightbaseRef = useRef()
  
  // Load all texture sets
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
    texture.repeat.set(10, 10) // Scale down by 5x (textures repeat 5 times)
    texture.flipY = false
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 16
  })

  // Create materials for each texture set (for Upbase/table)
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
        normalScale: new THREE.Vector2(1, 1),
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

  // Update materials immediately when texture changes
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

// Enhanced UI Component with responsive design
function UI({ 
  activeTexture, 
  setActiveTexture, 
  lightColor, 
  setLightColor,
  lightIntensity,
  setLightIntensity,
  environmentPreset,
  setEnvironmentPreset,
  environmentRotation,
  setEnvironmentRotation,
  environmentIntensity,
  setEnvironmentIntensity,
  isMobile
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const textureNames = ['Wood1', 'Wood2', 'Wood3', 'Wood4']
  
  const environmentPresets = [
    { value: 'sunset', name: 'Sunset' },
    { value: 'dawn', name: 'Dawn' },
    { value: 'night', name: 'Night' },
    { value: 'warehouse', name: 'Warehouse' },
    { value: 'forest', name: 'Forest' },
    { value: 'apartment', name: 'Apartment' },
    { value: 'studio', name: 'Studio' },
    { value: 'city', name: 'City' },
    { value: 'park', name: 'Park' },
    { value: 'lobby', name: 'Lobby' }
  ]

  const presetColors = [
    '#ffffff', '#f0f0f0', '#d0d0d0', '#a0a0a0',
    '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'
  ]

  const handleTextureChange = (index) => {
    console.log('Texture changed to:', index)
    setActiveTexture(index)
  }

  const handleColorChange = (color) => {
    console.log('Light color changed to:', color)
    setLightColor(color)
  }

  const handleIntensityChange = (intensity) => {
    console.log('Light intensity changed to:', intensity)
    setLightIntensity(intensity)
  }

  const handleEnvironmentChange = (preset) => {
    console.log('Environment preset changed to:', preset)
    setEnvironmentPreset(preset)
  }

  const handleRotationChange = (rotation) => {
    console.log('Environment rotation changed to:', rotation)
    setEnvironmentRotation(rotation)
  }

  const handleEnvironmentIntensityChange = (intensity) => {
    console.log('Environment intensity changed to:', intensity)
    setEnvironmentIntensity(intensity)
  }

  // Mobile UI
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle">
          <button
            className="toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="toggle-icon">{mobileMenuOpen ? '✕' : '⚙️'}</span>
            <span className="toggle-text">Configure</span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-overlay">
            <div className="mobile-panel">
              <div className="mobile-header">
                <h2>Configurator</h2>
                <button 
                  className="close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="mobile-content">
                {/* Materials */}
                <div className="mobile-section">
                  <h3>Material</h3>
                  <div className="mobile-texture-grid">
                    {[1, 2, 3, 4].map((index) => (
                      <button
                        key={index}
                        className={`mobile-texture-btn ${activeTexture === index ? 'active' : ''}`}
                        onClick={() => handleTextureChange(index)}
                      >
                        <span className="texture-number">{index}</span>
                        <span className="texture-name">{textureNames[index - 1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Environment */}
                <div className="mobile-section">
                  <h3>Environment</h3>
                  <div className="mobile-control">
                    <label>Preset</label>
                    <select
                      value={environmentPreset}
                      onChange={(e) => handleEnvironmentChange(e.target.value)}
                      className="mobile-select"
                    >
                      {environmentPresets.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mobile-dual-control">
                    <div className="mobile-control">
                      <label>Rotation</label>
                      <div className="mobile-slider-container">
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="1"
                          value={environmentRotation}
                          onChange={(e) => handleRotationChange(parseInt(e.target.value))}
                          className="mobile-slider"
                        />
                        <span className="mobile-slider-value">{environmentRotation}°</span>
                      </div>
                    </div>
                    <div className="mobile-control">
                      <label>Intensity</label>
                      <div className="mobile-slider-container">
                        <input
                          type="range"
                          min="0.1"
                          max="2"
                          step="0.1"
                          value={environmentIntensity}
                          onChange={(e) => handleEnvironmentIntensityChange(parseFloat(e.target.value))}
                          className="mobile-slider"
                        />
                        <span className="mobile-slider-value">{environmentIntensity.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lighting */}
                <div className="mobile-section">
                  <h3>Lighting</h3>
                  <div className="mobile-control">
                    <label>Color</label>
                    <div className="mobile-color-grid">
                      {presetColors.map((color, index) => (
                        <button
                          key={index}
                          className={`mobile-color-btn ${lightColor === color ? 'active' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mobile-dual-control">
                    <div className="mobile-control">
                      <label>Custom</label>
                      <input
                        type="color"
                        value={lightColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="mobile-color-input"
                      />
                    </div>
                    <div className="mobile-control">
                      <label>Intensity</label>
                      <div className="mobile-slider-container">
                        <input
                          type="range"
                          min="0.5"
                          max="5"
                          step="0.1"
                          value={lightIntensity}
                          onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
                          className="mobile-slider"
                        />
                        <span className="mobile-slider-value">{lightIntensity.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .mobile-toggle {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
          }

          .toggle-btn {
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            padding: 12px 20px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
          }

          .toggle-btn:hover {
            background: rgba(0, 0, 0, 0.9);
            transform: scale(1.05);
          }

          .toggle-icon {
            font-size: 16px;
          }

          .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            z-index: 1001;
            display: flex;
            align-items: flex-end;
          }

          .mobile-panel {
            width: 100%;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.95);
            border-radius: 20px 20px 0 0;
            color: white;
            overflow-y: auto;
          }

          .mobile-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .mobile-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
          }

          .close-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            color: white;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-content {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .mobile-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .mobile-section h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .mobile-texture-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .mobile-texture-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .mobile-texture-btn:hover,
          .mobile-texture-btn.active {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
            color: white;
          }

          .texture-number {
            font-weight: 600;
            font-size: 18px;
          }

          .texture-name {
            font-size: 12px;
            opacity: 0.8;
          }

          .mobile-control {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .mobile-control label {
            font-size: 12px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .mobile-select {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 12px;
            color: white;
            font-size: 14px;
            cursor: pointer;
          }

          .mobile-dual-control {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .mobile-color-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }

          .mobile-color-btn {
            width: 40px;
            height: 40px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .mobile-color-btn:hover,
          .mobile-color-btn.active {
            border-color: white;
            transform: scale(1.1);
          }

          .mobile-color-input {
            width: 40px;
            height: 40px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: none;
            cursor: pointer;
          }

          .mobile-slider-container {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .mobile-slider {
            flex: 1;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            outline: none;
            cursor: pointer;
            -webkit-appearance: none;
            appearance: none;
          }

          .mobile-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            cursor: pointer;
          }

          .mobile-slider-value {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            font-family: monospace;
            min-width: 40px;
            text-align: right;
          }
        `}</style>
      </>
    )
  }

  // Desktop UI (existing code with minor adjustments)
  return (
    <>
      <div className="glass-panel">
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
                    onClick={() => handleTextureChange(index)}
                  >
                    <span className="texture-number">{index}</span>
                    <span className="texture-name">{textureNames[index - 1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Environment */}
            <div className="section">
              <h3 className="section-title">Environment</h3>
              
              <div className="control">
                <label className="control-label">Preset</label>
                <select
                  value={environmentPreset}
                  onChange={(e) => handleEnvironmentChange(e.target.value)}
                  className="select-input"
                >
                  {environmentPresets.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dual-control">
                <div className="control">
                  <label className="control-label">Rotation</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="1"
                      value={environmentRotation}
                      onChange={(e) => handleRotationChange(parseInt(e.target.value))}
                      className="slider"
                    />
                    <span className="slider-value">{environmentRotation}°</span>
                  </div>
                </div>
                <div className="control">
                  <label className="control-label">Intensity</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={environmentIntensity}
                      onChange={(e) => handleEnvironmentIntensityChange(parseFloat(e.target.value))}
                      className="slider"
                    />
                    <span className="slider-value">{environmentIntensity.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lighting */}
            <div className="section">
              <h3 className="section-title">Lighting</h3>
              
              <div className="control">
                <label className="control-label">Color</label>
                <div className="color-grid">
                  {presetColors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-btn ${lightColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>

              <div className="dual-control">
                <div className="control">
                  <label className="control-label">Custom</label>
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => handleColorChange(e.target.value)}
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
                      onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
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
                  console.log('Resetting to defaults')
                  setActiveTexture(1)
                  setLightColor('#ffffff')
                  setLightIntensity(2)
                  setEnvironmentPreset('warehouse')
                  setEnvironmentRotation(0)
                  setEnvironmentIntensity(0.58)
                }}
              >
                Reset
              </button>
              <button
                className="action-btn primary"
                onClick={() => {
                  const config = { 
                    activeTexture, 
                    lightColor, 
                    lightIntensity,
                    environmentPreset,
                    environmentRotation,
                    environmentIntensity
                  }
                  console.log('Configuration saved:', config)
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
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

        .select-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 6px 8px;
          color: white;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .select-input:hover,
        .select-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          outline: none;
        }

        .select-input option {
          background: #1a1a1a;
          color: white;
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
          grid-template-columns: 1fr 1fr;
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
          min-width: 32px;
          text-align: right;
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
      `}</style>
    </>
  )
}

// Hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export default function FurnitureConfigurator() {
  const [activeTexture, setActiveTexture] = useState(1)
  const [lightColor, setLightColor] = useState('#ffffff')
  const [lightIntensity, setLightIntensity] = useState(2)
  const [environmentPreset, setEnvironmentPreset] = useState('warehouse')
  const [environmentRotation, setEnvironmentRotation] = useState(0)
  const [environmentIntensity, setEnvironmentIntensity] = useState(0.58)
  
  const isMobile = useIsMobile()

  // Dynamic camera settings based on device
  const cameraPosition = isMobile ? [8, 8, 8] : [5, 5, 5]
  const cameraFov = isMobile ? 55 : 45

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: cameraPosition, fov: cameraFov }}
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
     
          <Stage 
            adjustCamera={false} 
            environment={environmentPreset} 
            preset={'soft'} 
            intensity={environmentIntensity}
          />

          <Environment 
            preset={environmentPreset} 
            environmentRotation={[0, (environmentRotation * Math.PI) / 180, 0]}
            environmentIntensity={environmentIntensity}
          />
          
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
          minDistance={isMobile ? 5 : 3}
          maxDistance={isMobile ? 20 : 15}
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
        environmentPreset={environmentPreset}
        setEnvironmentPreset={setEnvironmentPreset}
        environmentRotation={environmentRotation}
        setEnvironmentRotation={setEnvironmentRotation}
        environmentIntensity={environmentIntensity}
        setEnvironmentIntensity={setEnvironmentIntensity}
        isMobile={isMobile}
      />
    </div>
  )
}

// Preload the model
useGLTF.preload('/ramses.glb')