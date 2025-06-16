// // import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react'
// // import { Canvas, useFrame } from '@react-three/fiber'
// // import {
// //   Stage,
// //   Environment,
// //   OrbitControls,
// //   useProgress,
// //   Html,
// //   useGLTF,
// //   useTexture,
// //   ContactShadows
// // } from '@react-three/drei'
// // import * as THREE from 'three'
// // import { EffectComposer, Bloom } from '@react-three/postprocessing'

// // function Loader() {
// //   const { progress } = useProgress()
// //   return (
// //     <Html center>
// //       <div style={{
// //         padding: '20px',
// //         background: 'rgba(0,0,0,0.8)',
// //         borderRadius: '10px',
// //         color: 'white',
// //         textAlign: 'center',
// //         fontFamily: 'Arial, sans-serif'
// //       }}>
// //         <div style={{
// //           width: '200px',
// //           height: '4px',
// //           background: '#333',
// //           borderRadius: '2px',
// //           overflow: 'hidden',
// //           marginBottom: '10px'
// //         }}>
// //           <div 
// //             style={{
// //               width: `${progress}%`,
// //               height: '100%',
// //               background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
// //               transition: 'width 0.3s ease'
// //             }}
// //           />
// //         </div>
// //         <p style={{ margin: 0, fontSize: '14px' }}>{progress.toFixed(0)}% loaded</p>
// //       </div>
// //     </Html>
// //   )
// // }

// // // Your Model component without dissolve and fade animations
// // function Model({ activeTexture, lightColor, lightIntensity, ...props }) {
// //   const { nodes, materials } = useGLTF('/ramses.glb')
// //   const groupRef = useRef()
// //   const upbaseRef = useRef()
// //   const lightbaseRef = useRef()
  
// //   // Load all texture sets
// //   const textures = useTexture({
// //     // Texture Set 1
// //     baseColor1: '/textures/1base.jpg',
// //     normal1: '/textures/1norm.jpg',
// //     specular1: '/textures/1specular.jpg',
// //     ao1: '/textures/1aomap.jpg',
    
// //     // Texture Set 2
// //     baseColor2: '/textures/2base.jpg',
// //     normal2: '/textures/2norm.jpg',
// //     specular2: '/textures/2specular.jpg',
// //     ao2: '/textures/2aomap.jpg',
    
// //     // Texture Set 3
// //     baseColor3: '/textures/3base.jpg',
// //     normal3: '/textures/3norm.jpg',
// //     specular3: '/textures/3specular.jpg',
// //     ao3: '/textures/3aomap.jpg',
    
// //     // Texture Set 4
// //     baseColor4: '/textures/4base.jpg',
// //     normal4: '/textures/4norm.jpg',
// //     specular4: '/textures/4specular.jpg',
// //     ao4: '/textures/4aomap.jpg',
// //   })

// //   // Configure textures for better quality and scale them down 5x
// //   Object.values(textures).forEach(texture => {
// //     texture.wrapS = texture.wrapT = THREE.RepeatWrapping
// //     texture.repeat.set(10, 10) // Scale down by 5x (textures repeat 5 times)
// //     texture.flipY = false
// //     texture.generateMipmaps = true
// //     texture.minFilter = THREE.LinearMipmapLinearFilter
// //     texture.magFilter = THREE.LinearFilter
// //     texture.anisotropy = 16
// //   })

// //   // Create materials for each texture set (for Upbase/table)
// //   const tableMaterials = useMemo(() => {
// //     const materials = {}
// //     for (let i = 1; i <= 4; i++) {
// //       materials[i] = new THREE.MeshStandardMaterial({
// //         map: textures[`baseColor${i}`],
// //         normalMap: textures[`normal${i}`],
// //         roughnessMap: textures[`specular${i}`],
// //         aoMap: textures[`ao${i}`],
// //         aoMapIntensity: 1,
// //         roughness: 0.98,
// //         metalness: 0.01,
// //         normalScale: new THREE.Vector2(1, 1),
// //       })
      
// //       // Set the second UV channel for AO map if available
// //       if (materials[i].aoMap) {
// //         materials[i].aoMap.channel = 1
// //       }
// //     }
// //     return materials
// //   }, [textures])

// //   // Light material with emissive properties (for Lightbase)
// //   const lightMaterial = useMemo(() => {
// //     return new THREE.MeshStandardMaterial({
// //       color: lightColor,
// //       emissive: lightColor,
// //       emissiveIntensity: lightIntensity,
// //       roughness: 0.1,
// //       metalness: 0.1,
// //       transparent: true,
// //       opacity: 0.9,
// //     })
// //   }, [lightColor, lightIntensity])

// //   // Update materials immediately when texture changes
// //   useEffect(() => {
// //     if (upbaseRef.current && tableMaterials[activeTexture]) {
// //       upbaseRef.current.material = tableMaterials[activeTexture]
// //       upbaseRef.current.material.needsUpdate = true
// //     }
// //   }, [activeTexture, tableMaterials])

// //   // Update Lightbase material when color/intensity changes
// //   useEffect(() => {
// //     if (lightbaseRef.current && lightMaterial) {
// //       lightbaseRef.current.material = lightMaterial
// //       lightbaseRef.current.material.needsUpdate = true
// //     }
// //   }, [lightMaterial])

// //   // Subtle breathing animation and light pulsing
// //   useFrame((state) => {
// //     if (groupRef.current) {
// //       groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
// //     }
    
// //     if (lightbaseRef.current && lightbaseRef.current.material) {
// //       const pulseFactor = Math.sin(state.clock.elapsedTime * 2) * 0.2
// //       lightbaseRef.current.material.emissiveIntensity = lightIntensity + pulseFactor
      
// //       // Add subtle color shift for warmth
// //       const time = state.clock.elapsedTime * 0.5
// //       const colorShift = Math.sin(time) * 0.05
// //       lightbaseRef.current.material.emissive.setHex(
// //         new THREE.Color(lightColor).offsetHSL(0, 0, colorShift).getHex()
// //       )
// //     }
// //   })

// //   return (
// //     <group ref={groupRef} {...props} dispose={null}>
// //       {/* Upbase - Table that receives texture changes */}
// //       <mesh
// //         ref={upbaseRef}
// //         castShadow
// //         receiveShadow
// //         geometry={nodes.Upbase.geometry}
// //         material={tableMaterials[activeTexture]}
// //       />
      
// //       {/* Lightbase - Light that glows and changes color */}
// //       <mesh
// //         ref={lightbaseRef}
// //         castShadow
// //         receiveShadow
// //         geometry={nodes.Lightbase.geometry}
// //         material={lightMaterial}
// //       />
// //     </group>
// //   )
// // }

// // // Enhanced UI Component with responsive design
// // function UI({ 
// //   activeTexture, 
// //   setActiveTexture, 
// //   lightColor, 
// //   setLightColor,
// //   lightIntensity,
// //   setLightIntensity,
// //   environmentPreset,
// //   setEnvironmentPreset,
// //   environmentRotation,
// //   setEnvironmentRotation,
// //   environmentIntensity,
// //   setEnvironmentIntensity,
// //   isMobile
// // }) {
// //   const [isCollapsed, setIsCollapsed] = useState(false)
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

// //   const textureNames = ['Wood1', 'Wood2', 'Wood3', 'Wood4']
  
// //   const environmentPresets = [
// //     { value: 'sunset', name: 'Sunset' },
// //     { value: 'dawn', name: 'Dawn' },
// //     { value: 'night', name: 'Night' },
// //     { value: 'warehouse', name: 'Warehouse' },
// //     { value: 'forest', name: 'Forest' },
// //     { value: 'apartment', name: 'Apartment' },
// //     { value: 'studio', name: 'Studio' },
// //     { value: 'city', name: 'City' },
// //     { value: 'park', name: 'Park' },
// //     { value: 'lobby', name: 'Lobby' }
// //   ]

// //   const presetColors = [
// //     '#ffffff', '#f0f0f0', '#d0d0d0', '#a0a0a0',
// //     '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'
// //   ]

// //   const handleTextureChange = (index) => {
// //     console.log('Texture changed to:', index)
// //     setActiveTexture(index)
// //   }

// //   const handleColorChange = (color) => {
// //     console.log('Light color changed to:', color)
// //     setLightColor(color)
// //   }

// //   const handleIntensityChange = (intensity) => {
// //     console.log('Light intensity changed to:', intensity)
// //     setLightIntensity(intensity)
// //   }

// //   const handleEnvironmentChange = (preset) => {
// //     console.log('Environment preset changed to:', preset)
// //     setEnvironmentPreset(preset)
// //   }

// //   const handleRotationChange = (rotation) => {
// //     console.log('Environment rotation changed to:', rotation)
// //     setEnvironmentRotation(rotation)
// //   }

// //   const handleEnvironmentIntensityChange = (intensity) => {
// //     console.log('Environment intensity changed to:', intensity)
// //     setEnvironmentIntensity(intensity)
// //   }

// //   // Mobile UI
// //   if (isMobile) {
// //     return (
// //       <>
// //         {/* Mobile Menu Toggle */}
// //         <div className="mobile-toggle">
// //           <button
// //             className="toggle-btn"
// //             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //           >
// //             <span className="toggle-icon">{mobileMenuOpen ? '✕' : '⚙️'}</span>
// //             <span className="toggle-text">Configure</span>
// //           </button>
// //         </div>

// //         {/* Mobile Menu Overlay */}
// //         {mobileMenuOpen && (
// //           <div className="mobile-overlay">
// //             <div className="mobile-panel">
// //               <div className="mobile-header">
// //                 <h2>Configurator</h2>
// //                 <button 
// //                   className="close-btn"
// //                   onClick={() => setMobileMenuOpen(false)}
// //                 >
// //                   ✕
// //                 </button>
// //               </div>

// //               <div className="mobile-content">
// //                 {/* Materials */}
// //                 <div className="mobile-section">
// //                   <h3>Material</h3>
// //                   <div className="mobile-texture-grid">
// //                     {[1, 2, 3, 4].map((index) => (
// //                       <button
// //                         key={index}
// //                         className={`mobile-texture-btn ${activeTexture === index ? 'active' : ''}`}
// //                         onClick={() => handleTextureChange(index)}
// //                       >
// //                         <span className="texture-number">{index}</span>
// //                         <span className="texture-name">{textureNames[index - 1]}</span>
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 {/* Environment */}
// //                 <div className="mobile-section">
// //                   <h3>Environment</h3>
// //                   <div className="mobile-control">
// //                     <label>Preset</label>
// //                     <select
// //                       value={environmentPreset}
// //                       onChange={(e) => handleEnvironmentChange(e.target.value)}
// //                       className="mobile-select"
// //                     >
// //                       {environmentPresets.map((preset) => (
// //                         <option key={preset.value} value={preset.value}>
// //                           {preset.name}
// //                         </option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div className="mobile-dual-control">
// //                     <div className="mobile-control">
// //                       <label>Rotation</label>
// //                       <div className="mobile-slider-container">
// //                         <input
// //                           type="range"
// //                           min="0"
// //                           max="360"
// //                           step="1"
// //                           value={environmentRotation}
// //                           onChange={(e) => handleRotationChange(parseInt(e.target.value))}
// //                           className="mobile-slider"
// //                         />
// //                         <span className="mobile-slider-value">{environmentRotation}°</span>
// //                       </div>
// //                     </div>
// //                     <div className="mobile-control">
// //                       <label>Intensity</label>
// //                       <div className="mobile-slider-container">
// //                         <input
// //                           type="range"
// //                           min="0.1"
// //                           max="2"
// //                           step="0.1"
// //                           value={environmentIntensity}
// //                           onChange={(e) => handleEnvironmentIntensityChange(parseFloat(e.target.value))}
// //                           className="mobile-slider"
// //                         />
// //                         <span className="mobile-slider-value">{environmentIntensity.toFixed(1)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Lighting */}
// //                 <div className="mobile-section">
// //                   <h3>Lighting</h3>
// //                   <div className="mobile-control">
// //                     <label>Color</label>
// //                     <div className="mobile-color-grid">
// //                       {presetColors.map((color, index) => (
// //                         <button
// //                           key={index}
// //                           className={`mobile-color-btn ${lightColor === color ? 'active' : ''}`}
// //                           style={{ backgroundColor: color }}
// //                           onClick={() => handleColorChange(color)}
// //                         />
// //                       ))}
// //                     </div>
// //                   </div>

// //                   <div className="mobile-dual-control">
// //                     <div className="mobile-control">
// //                       <label>Custom</label>
// //                       <input
// //                         type="color"
// //                         value={lightColor}
// //                         onChange={(e) => handleColorChange(e.target.value)}
// //                         className="mobile-color-input"
// //                       />
// //                     </div>
// //                     <div className="mobile-control">
// //                       <label>Intensity</label>
// //                       <div className="mobile-slider-container">
// //                         <input
// //                           type="range"
// //                           min="0.5"
// //                           max="5"
// //                           step="0.1"
// //                           value={lightIntensity}
// //                           onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
// //                           className="mobile-slider"
// //                         />
// //                         <span className="mobile-slider-value">{lightIntensity.toFixed(1)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         <style jsx>{`
// //           .mobile-toggle {
// //             position: fixed;
// //             bottom: 20px;
// //             left: 50%;
// //             transform: translateX(-50%);
// //             z-index: 1000;
// //           }

// //           .toggle-btn {
// //             background: rgba(0, 0, 0, 0.85);
// //             backdrop-filter: blur(20px);
// //             border: 1px solid rgba(255, 255, 255, 0.2);
// //             border-radius: 25px;
// //             padding: 12px 20px;
// //             color: white;
// //             cursor: pointer;
// //             transition: all 0.3s ease;
// //             display: flex;
// //             align-items: center;
// //             gap: 8px;
// //             font-size: 14px;
// //             font-weight: 500;
// //           }

// //           .toggle-btn:hover {
// //             background: rgba(0, 0, 0, 0.9);
// //             transform: scale(1.05);
// //           }

// //           .toggle-icon {
// //             font-size: 16px;
// //           }

// //           .mobile-overlay {
// //             position: fixed;
// //             top: 0;
// //             left: 0;
// //             right: 0;
// //             bottom: 0;
// //             background: rgba(0, 0, 0, 0.8);
// //             backdrop-filter: blur(10px);
// //             z-index: 1001;
// //             display: flex;
// //             align-items: flex-end;
// //           }

// //           .mobile-panel {
// //             width: 100%;
// //             max-height: 80vh;
// //             background: rgba(0, 0, 0, 0.95);
// //             border-radius: 20px 20px 0 0;
// //             color: white;
// //             overflow-y: auto;
// //           }

// //           .mobile-header {
// //             display: flex;
// //             justify-content: space-between;
// //             align-items: center;
// //             padding: 20px;
// //             border-bottom: 1px solid rgba(255, 255, 255, 0.1);
// //           }

// //           .mobile-header h2 {
// //             margin: 0;
// //             font-size: 20px;
// //             font-weight: 600;
// //           }

// //           .close-btn {
// //             background: rgba(255, 255, 255, 0.1);
// //             border: none;
// //             border-radius: 50%;
// //             width: 32px;
// //             height: 32px;
// //             color: white;
// //             cursor: pointer;
// //             font-size: 16px;
// //             display: flex;
// //             align-items: center;
// //             justify-content: center;
// //           }

// //           .mobile-content {
// //             padding: 20px;
// //             display: flex;
// //             flex-direction: column;
// //             gap: 24px;
// //           }

// //           .mobile-section {
// //             display: flex;
// //             flex-direction: column;
// //             gap: 12px;
// //           }

// //           .mobile-section h3 {
// //             margin: 0;
// //             font-size: 16px;
// //             font-weight: 600;
// //             color: rgba(255, 255, 255, 0.9);
// //             text-transform: uppercase;
// //             letter-spacing: 0.5px;
// //           }

// //           .mobile-texture-grid {
// //             display: grid;
// //             grid-template-columns: 1fr 1fr;
// //             gap: 12px;
// //           }

// //           .mobile-texture-btn {
// //             background: rgba(255, 255, 255, 0.05);
// //             border: 1px solid rgba(255, 255, 255, 0.1);
// //             border-radius: 12px;
// //             padding: 16px;
// //             color: rgba(255, 255, 255, 0.8);
// //             cursor: pointer;
// //             transition: all 0.2s ease;
// //             display: flex;
// //             flex-direction: column;
// //             align-items: center;
// //             gap: 4px;
// //           }

// //           .mobile-texture-btn:hover,
// //           .mobile-texture-btn.active {
// //             background: rgba(255, 255, 255, 0.15);
// //             border-color: rgba(255, 255, 255, 0.3);
// //             color: white;
// //           }

// //           .texture-number {
// //             font-weight: 600;
// //             font-size: 18px;
// //           }

// //           .texture-name {
// //             font-size: 12px;
// //             opacity: 0.8;
// //           }

// //           .mobile-control {
// //             display: flex;
// //             flex-direction: column;
// //             gap: 8px;
// //           }

// //           .mobile-control label {
// //             font-size: 12px;
// //             font-weight: 500;
// //             color: rgba(255, 255, 255, 0.7);
// //             text-transform: uppercase;
// //             letter-spacing: 0.5px;
// //           }

// //           .mobile-select {
// //             background: rgba(255, 255, 255, 0.1);
// //             border: 1px solid rgba(255, 255, 255, 0.2);
// //             border-radius: 8px;
// //             padding: 12px;
// //             color: white;
// //             font-size: 14px;
// //             cursor: pointer;
// //           }

// //           .mobile-dual-control {
// //             display: grid;
// //             grid-template-columns: 1fr 1fr;
// //             gap: 16px;
// //           }

// //           .mobile-color-grid {
// //             display: grid;
// //             grid-template-columns: repeat(4, 1fr);
// //             gap: 8px;
// //           }

// //           .mobile-color-btn {
// //             width: 40px;
// //             height: 40px;
// //             border: 2px solid rgba(255, 255, 255, 0.2);
// //             border-radius: 8px;
// //             cursor: pointer;
// //             transition: all 0.2s ease;
// //           }

// //           .mobile-color-btn:hover,
// //           .mobile-color-btn.active {
// //             border-color: white;
// //             transform: scale(1.1);
// //           }

// //           .mobile-color-input {
// //             width: 40px;
// //             height: 40px;
// //             border: 2px solid rgba(255, 255, 255, 0.2);
// //             border-radius: 8px;
// //             background: none;
// //             cursor: pointer;
// //           }

// //           .mobile-slider-container {
// //             display: flex;
// //             align-items: center;
// //             gap: 8px;
// //           }

// //           .mobile-slider {
// //             flex: 1;
// //             height: 6px;
// //             background: rgba(255, 255, 255, 0.2);
// //             border-radius: 3px;
// //             outline: none;
// //             cursor: pointer;
// //             -webkit-appearance: none;
// //             appearance: none;
// //           }

// //           .mobile-slider::-webkit-slider-thumb {
// //             -webkit-appearance: none;
// //             appearance: none;
// //             width: 20px;
// //             height: 20px;
// //             background: white;
// //             border-radius: 50%;
// //             cursor: pointer;
// //           }

// //           .mobile-slider-value {
// //             font-size: 12px;
// //             color: rgba(255, 255, 255, 0.8);
// //             font-family: monospace;
// //             min-width: 40px;
// //             text-align: right;
// //           }
// //         `}</style>
// //       </>
// //     )
// //   }

// //   // Desktop UI (existing code with minor adjustments)
// //   return (
// //     <>
// //       <div className="glass-panel">
// //         <div className="panel-header">
// //           <h2 className="panel-title">
// //             {isCollapsed ? 'FC' : 'Configurator'}
// //           </h2>
// //           <button 
// //             className="collapse-btn"
// //             onClick={() => setIsCollapsed(!isCollapsed)}
// //           >
// //             {isCollapsed ? '←' : '→'}
// //           </button>
// //         </div>
        
// //         {!isCollapsed && (
// //           <div className="panel-content">
// //             {/* Materials */}
// //             <div className="section">
// //               <h3 className="section-title">Material</h3>
// //               <div className="texture-grid">
// //                 {[1, 2, 3, 4].map((index) => (
// //                   <button
// //                     key={index}
// //                     className={`texture-btn ${activeTexture === index ? 'active' : ''}`}
// //                     onClick={() => handleTextureChange(index)}
// //                   >
// //                     <span className="texture-number">{index}</span>
// //                     <span className="texture-name">{textureNames[index - 1]}</span>
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Environment */}
// //             <div className="section">
// //               <h3 className="section-title">Environment</h3>
              
// //               <div className="control">
// //                 <label className="control-label">Preset</label>
// //                 <select
// //                   value={environmentPreset}
// //                   onChange={(e) => handleEnvironmentChange(e.target.value)}
// //                   className="select-input"
// //                 >
// //                   {environmentPresets.map((preset) => (
// //                     <option key={preset.value} value={preset.value}>
// //                       {preset.name}
// //                     </option>
// //                   ))}
// //                 </select>
// //               </div>

// //               <div className="dual-control">
// //                 <div className="control">
// //                   <label className="control-label">Rotation</label>
// //                   <div className="slider-container">
// //                     <input
// //                       type="range"
// //                       min="0"
// //                       max="360"
// //                       step="1"
// //                       value={environmentRotation}
// //                       onChange={(e) => handleRotationChange(parseInt(e.target.value))}
// //                       className="slider"
// //                     />
// //                     <span className="slider-value">{environmentRotation}°</span>
// //                   </div>
// //                 </div>
// //                 <div className="control">
// //                   <label className="control-label">Intensity</label>
// //                   <div className="slider-container">
// //                     <input
// //                       type="range"
// //                       min="0.1"
// //                       max="2"
// //                       step="0.1"
// //                       value={environmentIntensity}
// //                       onChange={(e) => handleEnvironmentIntensityChange(parseFloat(e.target.value))}
// //                       className="slider"
// //                     />
// //                     <span className="slider-value">{environmentIntensity.toFixed(1)}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Lighting */}
// //             <div className="section">
// //               <h3 className="section-title">Lighting</h3>
              
// //               <div className="control">
// //                 <label className="control-label">Color</label>
// //                 <div className="color-grid">
// //                   {presetColors.map((color, index) => (
// //                     <button
// //                       key={index}
// //                       className={`color-btn ${lightColor === color ? 'active' : ''}`}
// //                       style={{ backgroundColor: color }}
// //                       onClick={() => handleColorChange(color)}
// //                     />
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="dual-control">
// //                 <div className="control">
// //                   <label className="control-label">Custom</label>
// //                   <input
// //                     type="color"
// //                     value={lightColor}
// //                     onChange={(e) => handleColorChange(e.target.value)}
// //                     className="color-input"
// //                   />
// //                 </div>
// //                 <div className="control">
// //                   <label className="control-label">Intensity</label>
// //                   <div className="slider-container">
// //                     <input
// //                       type="range"
// //                       min="0.5"
// //                       max="5"
// //                       step="0.1"
// //                       value={lightIntensity}
// //                       onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
// //                       className="slider"
// //                     />
// //                     <span className="slider-value">{lightIntensity.toFixed(1)}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Actions */}
// //             <div className="actions">
// //               <button
// //                 className="action-btn"
// //                 onClick={() => {
// //                   console.log('Resetting to defaults')
// //                   setActiveTexture(1)
// //                   setLightColor('#ffffff')
// //                   setLightIntensity(2)
// //                   setEnvironmentPreset('warehouse')
// //                   setEnvironmentRotation(0)
// //                   setEnvironmentIntensity(0.58)
// //                 }}
// //               >
// //                 Reset
// //               </button>
// //               <button
// //                 className="action-btn primary"
// //                 onClick={() => {
// //                   const config = { 
// //                     activeTexture, 
// //                     lightColor, 
// //                     lightIntensity,
// //                     environmentPreset,
// //                     environmentRotation,
// //                     environmentIntensity
// //                   }
// //                   console.log('Configuration saved:', config)
// //                 }}
// //               >
// //                 Save
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       <style jsx>{`
// //         .glass-panel {
// //           position: fixed;
// //           top: 16px;
// //           right: 16px;
// //           width: ${isCollapsed ? '56px' : '280px'};
// //           max-height: 90vh;
// //           background: rgba(2, 0, 0, 0.85);
// //           backdrop-filter: blur(20px);
// //           border: 1px solid rgba(0, 0, 0, 0.56);
// //           border-radius: 16px;
// //           padding: 16px;
// //           color: white;
// //           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// //           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
// //           z-index: 1000;
// //           overflow-y: auto;
// //           scrollbar-width: none;
// //           -ms-overflow-style: none;
// //         }

// //         .glass-panel::-webkit-scrollbar {
// //           display: none;
// //         }

// //         .panel-header {
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: center;
// //           margin-bottom: ${isCollapsed ? '0' : '16px'};
// //         }

// //         .panel-title {
// //           margin: 0;
// //           font-size: 16px;
// //           font-weight: 600;
// //           color: white;
// //         }

// //         .collapse-btn {
// //           background: rgba(255, 255, 255, 0.1);
// //           border: 1px solid rgba(255, 255, 255, 0.2);
// //           border-radius: 8px;
// //           width: 24px;
// //           height: 24px;
// //           color: white;
// //           cursor: pointer;
// //           transition: all 0.2s ease;
// //           font-size: 12px;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //         }

// //         .collapse-btn:hover {
// //           background: rgba(255, 255, 255, 0.2);
// //           transform: scale(1.1);
// //         }

// //         .panel-content {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 16px;
// //         }

// //         .section {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 8px;
// //         }

// //         .section-title {
// //           margin: 0;
// //           font-size: 12px;
// //           font-weight: 600;
// //           color: rgba(255, 255, 255, 0.9);
// //           text-transform: uppercase;
// //           letter-spacing: 0.5px;
// //         }

// //         .texture-grid {
// //           display: grid;
// //           grid-template-columns: 1fr 1fr;
// //           gap: 6px;
// //         }

// //         .texture-btn {
// //           background: rgba(255, 255, 255, 0.05);
// //           border: 1px solid rgba(255, 255, 255, 0.1);
// //           border-radius: 8px;
// //           padding: 8px;
// //           color: rgba(255, 255, 255, 0.8);
// //           cursor: pointer;
// //           transition: all 0.2s ease;
// //           display: flex;
// //           flex-direction: column;
// //           align-items: center;
// //           gap: 2px;
// //           font-size: 11px;
// //         }

// //         .texture-btn:hover {
// //           background: rgba(255, 255, 255, 0.1);
// //           border-color: rgba(255, 255, 255, 0.3);
// //         }

// //         .texture-btn.active {
// //           background: rgba(255, 255, 255, 0.2);
// //           border-color: rgba(255, 255, 255, 0.4);
// //           color: white;
// //         }

// //         .texture-number {
// //           font-weight: 600;
// //           font-size: 12px;
// //         }

// //         .texture-name {
// //           font-size: 9px;
// //           opacity: 0.9;
// //         }

// //         .control {
// //           display: flex;
// //           flex-direction: column;
// //           gap: 6px;
// //         }

// //         .control-label {
// //           font-size: 10px;
// //           font-weight: 500;
// //           color: rgba(255, 255, 255, 0.7);
// //           text-transform: uppercase;
// //           letter-spacing: 0.5px;
// //         }

// //         .select-input {
// //           background: rgba(255, 255, 255, 0.1);
// //           border: 1px solid rgba(255, 255, 255, 0.2);
// //           border-radius: 6px;
// //           padding: 6px 8px;
// //           color: white;
// //           font-size: 11px;
// //           cursor: pointer;
// //           transition: all 0.2s ease;
// //         }

// //         .select-input:hover,
// //         .select-input:focus {
// //           background: rgba(255, 255, 255, 0.15);
// //           border-color: rgba(255, 255, 255, 0.3);
// //           outline: none;
// //         }

// //         .select-input option {
// //           background: #1a1a1a;
// //           color: white;
// //         }

// //         .color-grid {
// //           display: grid;
// //           grid-template-columns: repeat(4, 1fr);
// //           gap: 4px;
// //         }

// //         .color-btn {
// //           width: 24px;
// //           height: 24px;
// //           border: 1px solid rgba(255, 255, 255, 0.2);
// //           border-radius: 6px;
// //           cursor: pointer;
// //           transition: all 0.2s ease;
// //         }

// //         .color-btn:hover {
// //           transform: scale(1.1);
// //           border-color: rgba(255, 255, 255, 0.4);
// //         }

// //         .color-btn.active {
// //           border-width: 2px;
// //           border-color: white;
// //           transform: scale(1.05);
// //         }

// //         .dual-control {
// //           display: grid;
// //           grid-template-columns: 1fr 1fr;
// //           gap: 12px;
// //           align-items: end;
// //         }

// //         .color-input {
// //           width: 32px;
// //           height: 32px;
// //           border: 1px solid rgba(255, 255, 255, 0.2);
// //           border-radius: 6px;
// //           background: none;
// //           cursor: pointer;
// //         }

// //         .slider-container {
// //           display: flex;
// //           align-items: center;
// //           gap: 8px;
// //         }

// //         .slider {
// //           flex: 1;
// //           height: 4px;
// //           background: rgba(255, 255, 255, 0.2);
// //           border-radius: 2px;
// //           outline: none;
// //           cursor: pointer;
// //           -webkit-appearance: none;
// //           appearance: none;
// //         }

// //         .slider::-webkit-slider-thumb {
// //           -webkit-appearance: none;
// //           appearance: none;
// //           width: 16px;
// //           height: 16px;
// //           background: white;
// //           border-radius: 50%;
// //           cursor: pointer;
// //         }

// //         .slider::-moz-range-thumb {
// //           width: 16px;
// //           height: 16px;
// //           background: white;
// //           border-radius: 50%;
// //           cursor: pointer;
// //           border: none;
// //         }

// //         .slider-value {
// //           font-size: 10px;
// //           color: rgba(255, 255, 255, 0.8);
// //           font-family: monospace;
// //           min-width: 32px;
// //           text-align: right;
// //         }

// //         .actions {
// //           display: flex;
// //           gap: 6px;
// //         }

// //         .action-btn {
// //           flex: 1;
// //           background: rgba(255, 255, 255, 0.1);
// //           border: 1px solid rgba(255, 255, 255, 0.2);
// //           border-radius: 8px;
// //           padding: 8px 12px;
// //           color: white;
// //           cursor: pointer;
// //           transition: all 0.2s ease;
// //           font-size: 11px;
// //           font-weight: 500;
// //         }

// //         .action-btn:hover {
// //           background: rgba(255, 255, 255, 0.15);
// //           transform: translateY(-1px);
// //         }

// //         .action-btn.primary {
// //           background: rgba(255, 255, 255, 0.2);
// //           border-color: rgba(255, 255, 255, 0.3);
// //         }
// //       `}</style>
// //     </>
// //   )
// // }

// // // Hook to detect mobile devices
// // function useIsMobile() {
// //   const [isMobile, setIsMobile] = useState(false)

// //   useEffect(() => {
// //     const checkMobile = () => {
// //       setIsMobile(window.innerWidth <= 768)
// //     }
    
// //     checkMobile()
// //     window.addEventListener('resize', checkMobile)
    
// //     return () => window.removeEventListener('resize', checkMobile)
// //   }, [])

// //   return isMobile
// // }

// // export default function FurnitureConfigurator() {
// //   const [activeTexture, setActiveTexture] = useState(1)
// //   const [lightColor, setLightColor] = useState('#ffffff')
// //   const [lightIntensity, setLightIntensity] = useState(2)
// //   const [environmentPreset, setEnvironmentPreset] = useState('warehouse')
// //   const [environmentRotation, setEnvironmentRotation] = useState(0)
// //   const [environmentIntensity, setEnvironmentIntensity] = useState(0.58)
  
// //   const isMobile = useIsMobile()

// //   // Dynamic camera settings based on device
// //   const cameraPosition = isMobile ? [8, 8, 8] : [5, 5, 5]
// //   const cameraFov = isMobile ? 55 : 45

// //   return (
// //     <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
// //       <Canvas
// //         camera={{ position: cameraPosition, fov: cameraFov }}
// //         shadows
// //         gl={{
// //           antialias: true,
// //           alpha: false,
// //           powerPreference: "high-performance",
// //           preserveDrawingBuffer: true
// //         }}
// //         dpr={[1, 2]}
// //       >
// //         <color attach="background" args={['#ffffff']} />
        
// //         <Suspense fallback={<Loader />}>
// //           <ContactShadows position={[0, -1, 0]} opacity={0.64} scale={30} blur={0.7} />
       
// //           <Model
// //             activeTexture={activeTexture}
// //             lightColor={lightColor}
// //             lightIntensity={lightIntensity}
// //           />
     
// //           <Stage 
// //             adjustCamera={false} 
// //             environment={environmentPreset} 
// //             preset={'soft'} 
// //             intensity={environmentIntensity}
// //           />

// //           <Environment 
// //             preset={environmentPreset} 
// //             environmentRotation={[0, (environmentRotation * Math.PI) / 180, 0]}
// //             environmentIntensity={environmentIntensity}
// //           />
          
// //           <EffectComposer>
// //             <Bloom
// //               intensity={0.15}
// //               luminanceThreshold={0.9}
// //               luminanceSmoothing={15}
// //               height={90}
// //             />
// //           </EffectComposer>
  
// //         </Suspense>
        
// //         <OrbitControls
// //           enablePan={false}
// //           enableZoom={true}
// //           enableRotate={true}
// //           minDistance={isMobile ? 5 : 3}
// //           maxDistance={isMobile ? 20 : 15}
// //           minPolarAngle={Math.PI / 6}
// //           maxPolarAngle={Math.PI / 2}
// //           enableDamping={true}
// //           dampingFactor={0.05}
// //         />
// //       </Canvas>
      
// //       <UI
// //         activeTexture={activeTexture}
// //         setActiveTexture={setActiveTexture}
// //         lightColor={lightColor}
// //         setLightColor={setLightColor}
// //         lightIntensity={lightIntensity}
// //         setLightIntensity={setLightIntensity}
// //         environmentPreset={environmentPreset}
// //         setEnvironmentPreset={setEnvironmentPreset}
// //         environmentRotation={environmentRotation}
// //         setEnvironmentRotation={setEnvironmentRotation}
// //         environmentIntensity={environmentIntensity}
// //         setEnvironmentIntensity={setEnvironmentIntensity}
// //         isMobile={isMobile}
// //       />
// //     </div>
// //   )
// // }

// // // Preload the model
// // useGLTF.preload('/ramses.glb')

// import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import {
//   OrbitControls,
//   useProgress,
//   Html,
//   useGLTF,
//   useTexture,
//   ContactShadows
// } from '@react-three/drei'
// import * as THREE from 'three'
// import { EffectComposer, Bloom } from '@react-three/postprocessing'

// function Loader() {
//   const { progress } = useProgress()
//   return (
//     <Html center>
//       <div style={{
//         padding: '20px',
//         background: 'rgba(0,0,0,0.8)',
//         borderRadius: '10px',
//         color: 'white',
//         textAlign: 'center',
//         fontFamily: 'Arial, sans-serif'
//       }}>
//         <div style={{
//           width: '200px',
//           height: '4px',
//           background: '#333',
//           borderRadius: '2px',
//           overflow: 'hidden',
//           marginBottom: '10px'
//         }}>
//           <div 
//             style={{
//               width: `${progress}%`,
//               height: '100%',
//               background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
//               transition: 'width 0.3s ease'
//             }}
//           />
//         </div>
//         <p style={{ margin: 0, fontSize: '14px' }}>{progress.toFixed(0)}% loaded</p>
//       </div>
//     </Html>
//   )
// }

// // Enhanced Lighting Component with Three Directional Lights for Table
// function Lighting({ 
//   ambientIntensity, 
//   directional1Intensity, 
//   directional1Position, 
//   directional1Color,
//   directional2Intensity, 
//   directional2Position, 
//   directional2Color,
//   directional3Intensity, 
//   directional3Position, 
//   directional3Color
// }) {
//   const directional1Ref = useRef()
//   const directional2Ref = useRef()
//   const directional3Ref = useRef()

//   useEffect(() => {
//     console.log('Table Lighting Setup:', {
//       ambient: {
//         intensity: ambientIntensity
//       },
//       keyLight: {
//         intensity: directional1Intensity,
//         position: directional1Position,
//         color: directional1Color
//       },
//       fillLight: {
//         intensity: directional2Intensity,
//         position: directional2Position,
//         color: directional2Color
//       },
//       rimLight: {
//         intensity: directional3Intensity,
//         position: directional3Position,
//         color: directional3Color
//       }
//     })
//   }, [
//     ambientIntensity,
//     directional1Intensity,
//     directional1Position,
//     directional1Color,
//     directional2Intensity,
//     directional2Position,
//     directional2Color,
//     directional3Intensity,
//     directional3Position,
//     directional3Color
//   ])

//   return (
//     <>
//       {/* Ambient Light - Soft base illumination */}
//       <ambientLight intensity={ambientIntensity} color="#2c2c2c" />
      
//       {/* Key Light - Main directional light from top-front-right */}
//       <directionalLight
//         ref={directional1Ref}
//         position={directional1Position}
//         intensity={directional1Intensity}
//         color={directional1Color}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//         shadow-camera-far={50}
//         shadow-camera-left={-15}
//         shadow-camera-right={15}
//         shadow-camera-top={15}
//         shadow-camera-bottom={-15}
//         shadow-bias={-0.0001}
//       />
      
//       {/* Fill Light - Secondary light from top-front-left to fill shadows */}
//       <directionalLight
//         ref={directional2Ref}
//         position={directional2Position}
//         intensity={directional2Intensity}
//         color={directional2Color}
//         castShadow
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//         shadow-camera-far={50}
//         shadow-camera-left={-15}
//         shadow-camera-right={15}
//         shadow-camera-top={15}
//         shadow-camera-bottom={-15}
//       />
      
//       {/* Rim Light - Back light for edge definition and depth */}
//       <directionalLight
//         ref={directional3Ref}
//         position={directional3Position}
//         intensity={directional3Intensity}
//         color={directional3Color}
//         castShadow
//         shadow-mapSize-width={512}
//         shadow-mapSize-height={512}
//         shadow-camera-far={30}
//         shadow-camera-left={-10}
//         shadow-camera-right={10}
//         shadow-camera-top={10}
//         shadow-camera-bottom={-10}
//       />
//     </>
//   )
// }

// // Your Model component (unchanged)
// function Model({ activeTexture, lightColor, lightIntensity, ...props }) {
//   const { nodes, materials } = useGLTF('/ramses.glb')
//   const groupRef = useRef()
//   const upbaseRef = useRef()
//   const lightbaseRef = useRef()
  
//   // Load all texture sets
//   const textures = useTexture({
//     // Texture Set 1
//     baseColor1: '/textures/1base.jpg',
//     normal1: '/textures/1norm.jpg',
//     specular1: '/textures/1specular.jpg',
//     ao1: '/textures/1aomap.jpg',
    
//     // Texture Set 2
//     baseColor2: '/textures/2base.jpg',
//     normal2: '/textures/2norm.jpg',
//     specular2: '/textures/2specular.jpg',
//     ao2: '/textures/2aomap.jpg',
    
//     // Texture Set 3
//     baseColor3: '/textures/3base.jpg',
//     normal3: '/textures/3norm.jpg',
//     specular3: '/textures/3specular.jpg',
//     ao3: '/textures/3aomap.jpg',
    
//     // Texture Set 4
//     baseColor4: '/textures/4base.jpg',
//     normal4: '/textures/4norm.jpg',
//     specular4: '/textures/4specular.jpg',
//     ao4: '/textures/4aomap.jpg',
//   })

//   // Configure textures for better quality and scale them down 5x
//   Object.values(textures).forEach(texture => {
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping
//     texture.repeat.set(10, 10) // Scale down by 5x (textures repeat 5 times)
//     texture.flipY = false
//     texture.generateMipmaps = true
//     texture.minFilter = THREE.LinearMipmapLinearFilter
//     texture.magFilter = THREE.LinearFilter
//     texture.anisotropy = 16
//   })

//   // Create materials for each texture set (for Upbase/table)
//   const tableMaterials = useMemo(() => {
//     const materials = {}
//     for (let i = 1; i <= 4; i++) {
//       materials[i] = new THREE.MeshStandardMaterial({
//         map: textures[`baseColor${i}`],
//         normalMap: textures[`normal${i}`],
//         roughnessMap: textures[`specular${i}`],
//         aoMap: textures[`ao${i}`],
//         aoMapIntensity: 1,
//         roughness: 0.98,
//         metalness: 0.01,
//         normalScale: new THREE.Vector2(1, 1),
//       })
      
//       // Set the second UV channel for AO map if available
//       if (materials[i].aoMap) {
//         materials[i].aoMap.channel = 1
//       }
//     }
//     return materials
//   }, [textures])

//   // Light material with emissive properties (for Lightbase)
//   const lightMaterial = useMemo(() => {
//     return new THREE.MeshStandardMaterial({
//       color: lightColor,
//       emissive: lightColor,
//       emissiveIntensity: lightIntensity,
//       roughness: 0.1,
//       metalness: 0.1,
//       transparent: true,
//       opacity: 0.9,
//     })
//   }, [lightColor, lightIntensity])

//   // Update materials immediately when texture changes
//   useEffect(() => {
//     if (upbaseRef.current && tableMaterials[activeTexture]) {
//       upbaseRef.current.material = tableMaterials[activeTexture]
//       upbaseRef.current.material.needsUpdate = true
//     }
//   }, [activeTexture, tableMaterials])

//   // Update Lightbase material when color/intensity changes
//   useEffect(() => {
//     if (lightbaseRef.current && lightMaterial) {
//       lightbaseRef.current.material = lightMaterial
//       lightbaseRef.current.material.needsUpdate = true
//     }
//   }, [lightMaterial])

//   // Subtle breathing animation and light pulsing
//   useFrame((state) => {
//     if (groupRef.current) {
//       groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
//     }
    
//     if (lightbaseRef.current && lightbaseRef.current.material) {
//       const pulseFactor = Math.sin(state.clock.elapsedTime * 2) * 0.2
//       lightbaseRef.current.material.emissiveIntensity = lightIntensity + pulseFactor
      
//       // Add subtle color shift for warmth
//       const time = state.clock.elapsedTime * 0.5
//       const colorShift = Math.sin(time) * 0.05
//       lightbaseRef.current.material.emissive.setHex(
//         new THREE.Color(lightColor).offsetHSL(0, 0, colorShift).getHex()
//       )
//     }
//   })

//   return (
//     <group ref={groupRef} {...props} dispose={null}>
//       {/* Upbase - Table that receives texture changes */}
//       <mesh
//         ref={upbaseRef}
//         castShadow
//         receiveShadow
//         geometry={nodes.Upbase.geometry}
//         material={tableMaterials[activeTexture]}
//       />
      
//       {/* Lightbase - Light that glows and changes color */}
//       <mesh
//         ref={lightbaseRef}
//         castShadow
//         receiveShadow
//         geometry={nodes.Lightbase.geometry}
//         material={lightMaterial}
//       />
//     </group>
//   )
// }

// // Enhanced UI Component with three directional lights
// function UI({ 
//   activeTexture, 
//   setActiveTexture, 
//   lightColor, 
//   setLightColor,
//   lightIntensity,
//   setLightIntensity,
//   ambientIntensity,
//   setAmbientIntensity,
//   directional1Intensity,
//   setDirectional1Intensity,
//   directional1Position,
//   setDirectional1Position,
//   directional1Color,
//   setDirectional1Color,
//   directional2Intensity,
//   setDirectional2Intensity,
//   directional2Position,
//   setDirectional2Position,
//   directional2Color,
//   setDirectional2Color,
//   directional3Intensity,
//   setDirectional3Intensity,
//   directional3Position,
//   setDirectional3Position,
//   directional3Color,
//   setDirectional3Color,
//   isMobile
// }) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [activeTab, setActiveTab] = useState('materials') // materials, lighting

//   const textureNames = ['Wood1', 'Wood2', 'Wood3', 'Wood4']
//   const presetColors = [
//     '#ffffff', '#f0f0f0', '#d0d0d0', '#a0a0a0',
//     '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'
//   ]

//   const handleTextureChange = (index) => {
//     console.log('Texture changed to:', index)
//     setActiveTexture(index)
//   }

//   const handleColorChange = (color) => {
//     console.log('Light color changed to:', color)
//     setLightColor(color)
//   }

//   const handleIntensityChange = (intensity) => {
//     console.log('Light intensity changed to:', intensity)
//     setLightIntensity(intensity)
//   }

//   // Mobile UI
//   if (isMobile) {
//     return (
//       <>
//         {/* Mobile Menu Toggle */}
//         <div className="mobile-toggle">
//           <button
//             className="toggle-btn"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             <span className="toggle-icon">{mobileMenuOpen ? '✕' : '⚙️'}</span>
//             <span className="toggle-text">Configure</span>
//           </button>
//         </div>

//         {/* Mobile Menu Overlay */}
//         {mobileMenuOpen && (
//           <div className="mobile-overlay">
//             <div className="mobile-panel">
//               <div className="mobile-header">
//                 <h2>Table Configurator</h2>
//                 <button 
//                   className="close-btn"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Tab Navigation */}
//               <div className="mobile-tabs">
//                 <button
//                   className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
//                   onClick={() => setActiveTab('materials')}
//                 >
//                   Materials
//                 </button>
//                 <button
//                   className={`tab-btn ${activeTab === 'lighting' ? 'active' : ''}`}
//                   onClick={() => setActiveTab('lighting')}
//                 >
//                   Lighting
//                 </button>
//               </div>

//               <div className="mobile-content">
//                 {activeTab === 'materials' && (
//                   <>
//                     {/* Materials */}
//                     <div className="mobile-section">
//                       <h3>Table Material</h3>
//                       <div className="mobile-texture-grid">
//                         {[1, 2, 3, 4].map((index) => (
//                           <button
//                             key={index}
//                             className={`mobile-texture-btn ${activeTexture === index ? 'active' : ''}`}
//                             onClick={() => handleTextureChange(index)}
//                           >
//                             <span className="texture-number">{index}</span>
//                             <span className="texture-name">{textureNames[index - 1]}</span>
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Model Lighting */}
//                     <div className="mobile-section">
//                       <h3>Table Light</h3>
//                       <div className="mobile-control">
//                         <label>Color</label>
//                         <div className="mobile-color-grid">
//                           {presetColors.map((color, index) => (
//                             <button
//                               key={index}
//                               className={`mobile-color-btn ${lightColor === color ? 'active' : ''}`}
//                               style={{ backgroundColor: color }}
//                               onClick={() => handleColorChange(color)}
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       <div className="mobile-dual-control">
//                         <div className="mobile-control">
//                           <label>Custom</label>
//                           <input
//                             type="color"
//                             value={lightColor}
//                             onChange={(e) => handleColorChange(e.target.value)}
//                             className="mobile-color-input"
//                           />
//                         </div>
//                         <div className="mobile-control">
//                           <label>Intensity</label>
//                           <div className="mobile-slider-container">
//                             <input
//                               type="range"
//                               min="0.5"
//                               max="5"
//                               step="0.1"
//                               value={lightIntensity}
//                               onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
//                               className="mobile-slider"
//                             />
//                             <span className="mobile-slider-value">{lightIntensity.toFixed(1)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {activeTab === 'lighting' && (
//                   <>
//                     {/* Ambient Light */}
//                     <div className="mobile-section">
//                       <h3>Ambient Light</h3>
//                       <div className="mobile-control">
//                         <label>Intensity</label>
//                         <div className="mobile-slider-container">
//                           <input
//                             type="range"
//                             min="0"
//                             max="2"
//                             step="0.1"
//                             value={ambientIntensity}
//                             onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
//                             className="mobile-slider"
//                           />
//                           <span className="mobile-slider-value">{ambientIntensity.toFixed(1)}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Key Light */}
//                     <div className="mobile-section">
//                       <h3>Key Light</h3>
//                       <div className="mobile-dual-control">
//                         <div className="mobile-control">
//                           <label>Intensity</label>
//                           <div className="mobile-slider-container">
//                             <input
//                               type="range"
//                               min="0"
//                               max="3"
//                               step="0.1"
//                               value={directional1Intensity}
//                               onChange={(e) => setDirectional1Intensity(parseFloat(e.target.value))}
//                               className="mobile-slider"
//                             />
//                             <span className="mobile-slider-value">{directional1Intensity.toFixed(1)}</span>
//                           </div>
//                         </div>
//                         <div className="mobile-control">
//                           <label>Color</label>
//                           <input
//                             type="color"
//                             value={directional1Color}
//                             onChange={(e) => setDirectional1Color(e.target.value)}
//                             className="mobile-color-input"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Fill Light */}
//                     <div className="mobile-section">
//                       <h3>Fill Light</h3>
//                       <div className="mobile-dual-control">
//                         <div className="mobile-control">
//                           <label>Intensity</label>
//                           <div className="mobile-slider-container">
//                             <input
//                               type="range"
//                               min="0"
//                               max="3"
//                               step="0.1"
//                               value={directional2Intensity}
//                               onChange={(e) => setDirectional2Intensity(parseFloat(e.target.value))}
//                               className="mobile-slider"
//                             />
//                             <span className="mobile-slider-value">{directional2Intensity.toFixed(1)}</span>
//                           </div>
//                         </div>
//                         <div className="mobile-control">
//                           <label>Color</label>
//                           <input
//                             type="color"
//                             value={directional2Color}
//                             onChange={(e) => setDirectional2Color(e.target.value)}
//                             className="mobile-color-input"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Rim Light */}
//                     <div className="mobile-section">
//                       <h3>Rim Light</h3>
//                       <div className="mobile-dual-control">
//                         <div className="mobile-control">
//                           <label>Intensity</label>
//                           <div className="mobile-slider-container">
//                             <input
//                               type="range"
//                               min="0"
//                               max="3"
//                               step="0.1"
//                               value={directional3Intensity}
//                               onChange={(e) => setDirectional3Intensity(parseFloat(e.target.value))}
//                               className="mobile-slider"
//                             />
//                             <span className="mobile-slider-value">{directional3Intensity.toFixed(1)}</span>
//                           </div>
//                         </div>
//                         <div className="mobile-control">
//                           <label>Color</label>
//                           <input
//                             type="color"
//                             value={directional3Color}
//                             onChange={(e) => setDirectional3Color(e.target.value)}
//                             className="mobile-color-input"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         <style jsx>{`
//           .mobile-toggle {
//             position: fixed;
//             bottom: 20px;
//             left: 50%;
//             transform: translateX(-50%);
//             z-index: 1000;
//           }

//           .toggle-btn {
//             background: rgba(0, 0, 0, 0.85);
//             backdrop-filter: blur(20px);
//             border: 1px solid rgba(255, 255, 255, 0.2);
//             border-radius: 25px;
//             padding: 12px 20px;
//             color: white;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             font-size: 14px;
//             font-weight: 500;
//           }

//           .toggle-btn:hover {
//             background: rgba(0, 0, 0, 0.9);
//             transform: scale(1.05);
//           }

//           .toggle-icon {
//             font-size: 16px;
//           }

//           .mobile-overlay {
//             position: fixed;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background: rgba(0, 0, 0, 0.8);
//             backdrop-filter: blur(10px);
//             z-index: 1001;
//             display: flex;
//             align-items: flex-end;
//           }

//           .mobile-panel {
//             width: 100%;
//             max-height: 80vh;
//             background: rgba(0, 0, 0, 0.95);
//             border-radius: 20px 20px 0 0;
//             color: white;
//             overflow-y: auto;
//           }

//           .mobile-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 20px;
//             border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//           }

//           .mobile-header h2 {
//             margin: 0;
//             font-size: 20px;
//             font-weight: 600;
//           }

//           .close-btn {
//             background: rgba(255, 255, 255, 0.1);
//             border: none;
//             border-radius: 50%;
//             width: 32px;
//             height: 32px;
//             color: white;
//             cursor: pointer;
//             font-size: 16px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }

//           .mobile-tabs {
//             display: flex;
//             padding: 0 20px;
//             border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//           }

//           .tab-btn {
//             flex: 1;
//             background: none;
//             border: none;
//             padding: 12px;
//             color: rgba(255, 255, 255, 0.7);
//             cursor: pointer;
//             border-bottom: 2px solid transparent;
//             transition: all 0.3s ease;
//           }

//           .tab-btn.active {
//             color: white;
//             border-bottom-color: white;
//           }

//           .mobile-content {
//             padding: 20px;
//             display: flex;
//             flex-direction: column;
//             gap: 24px;
//           }

//           .mobile-section {
//             display: flex;
//             flex-direction: column;
//             gap: 12px;
//           }

//           .mobile-section h3 {
//             margin: 0;
//             font-size: 16px;
//             font-weight: 600;
//             color: rgba(255, 255, 255, 0.9);
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//           }

//           .mobile-texture-grid {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 12px;
//           }

//           .mobile-texture-btn {
//             background: rgba(255, 255, 255, 0.05);
//             border: 1px solid rgba(255, 255, 255, 0.1);
//             border-radius: 12px;
//             padding: 16px;
//             color: rgba(255, 255, 255, 0.8);
//             cursor: pointer;
//             transition: all 0.2s ease;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             gap: 4px;
//           }

//           .mobile-texture-btn:hover,
//           .mobile-texture-btn.active {
//             background: rgba(255, 255, 255, 0.15);
//             border-color: rgba(255, 255, 255, 0.3);
//             color: white;
//           }

//           .texture-number {
//             font-weight: 600;
//             font-size: 18px;
//           }

//           .texture-name {
//             font-size: 12px;
//             opacity: 0.8;
//           }

//           .mobile-control {
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//           }

//           .mobile-control label {
//             font-size: 12px;
//             font-weight: 500;
//             color: rgba(255, 255, 255, 0.7);
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//           }

//           .mobile-dual-control {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 16px;
//           }

//           .mobile-color-grid {
//             display: grid;
//             grid-template-columns: repeat(4, 1fr);
//             gap: 8px;
//           }

//           .mobile-color-btn {
//             width: 40px;
//             height: 40px;
//             border: 2px solid rgba(255, 255, 255, 0.2);
//             border-radius: 8px;
//             cursor: pointer;
//             transition: all 0.2s ease;
//           }

//           .mobile-color-btn:hover,
//           .mobile-color-btn.active {
//             border-color: white;
//             transform: scale(1.1);
//           }

//           .mobile-color-input {
//             width: 40px;
//             height: 40px;
//             border: 2px solid rgba(255, 255, 255, 0.2);
//             border-radius: 8px;
//             background: none;
//             cursor: pointer;
//           }

//           .mobile-slider-container {
//             display: flex;
//             align-items: center;
//             gap: 8px;
//           }

//           .mobile-slider {
//             flex: 1;
//             height: 6px;
//             background: rgba(255, 255, 255, 0.2);
//             border-radius: 3px;
//             outline: none;
//             cursor: pointer;
//             -webkit-appearance: none;
//             appearance: none;
//           }

//           .mobile-slider::-webkit-slider-thumb {
//             -webkit-appearance: none;
//             appearance: none;
//             width: 20px;
//             height: 20px;
//             background: white;
//             border-radius: 50%;
//             cursor: pointer;
//           }

//           .mobile-slider-value {
//             font-size: 12px;
//             color: rgba(255, 255, 255, 0.8);
//             font-family: monospace;
//             min-width: 40px;
//             text-align: right;
//           }
//         `}</style>
//       </>
//     )
//   }

//   // Desktop UI with three directional lights
//   return (
//     <>
//       <div className="glass-panel">
//         <div className="panel-header">
//           <h2 className="panel-title">
//             {isCollapsed ? 'TC' : 'Table Configurator'}
//           </h2>
//           <button 
//             className="collapse-btn"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//           >
//             {isCollapsed ? '←' : '→'}
//           </button>
//         </div>
        
//         {!isCollapsed && (
//           <div className="panel-content">
//             {/* Tab Navigation */}
//             <div className="tab-nav">
//               <button
//                 className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('materials')}
//               >
//                 Materials
//               </button>
//               <button
//                 className={`tab-btn ${activeTab === 'lighting' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('lighting')}
//               >
//                 Lighting
//               </button>
//             </div>

//             {activeTab === 'materials' && (
//               <>
//                 {/* Materials */}
//                 <div className="section">
//                   <h3 className="section-title">Table Material</h3>
//                   <div className="texture-grid">
//                     {[1, 2, 3, 4].map((index) => (
//                       <button
//                         key={index}
//                         className={`texture-btn ${activeTexture === index ? 'active' : ''}`}
//                         onClick={() => handleTextureChange(index)}
//                       >
//                         <span className="texture-number">{index}</span>
//                         <span className="texture-name">{textureNames[index - 1]}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Model Lighting */}
//                 <div className="section">
//                   <h3 className="section-title">Table Light</h3>
                  
//                   <div className="control">
//                     <label className="control-label">Color</label>
//                     <div className="color-grid">
//                       {presetColors.map((color, index) => (
//                         <button
//                           key={index}
//                           className={`color-btn ${lightColor === color ? 'active' : ''}`}
//                           style={{ backgroundColor: color }}
//                           onClick={() => handleColorChange(color)}
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   <div className="dual-control">
//                     <div className="control">
//                       <label className="control-label">Custom</label>
//                       <input
//                         type="color"
//                         value={lightColor}
//                         onChange={(e) => handleColorChange(e.target.value)}
//                         className="color-input"
//                       />
//                     </div>
//                     <div className="control">
//                       <label className="control-label">Intensity</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="0.5"
//                           max="5"
//                           step="0.1"
//                           value={lightIntensity}
//                           onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{lightIntensity.toFixed(1)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {activeTab === 'lighting' && (
//               <>
//                 {/* Ambient Light */}
//                 <div className="section">
//                   <h3 className="section-title">Ambient Light</h3>
//                   <div className="control">
//                     <label className="control-label">Intensity</label>
//                     <div className="slider-container">
//                       <input
//                         type="range"
//                         min="0"
//                         max="2"
//                         step="0.1"
//                         value={ambientIntensity}
//                         onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
//                         className="slider"
//                       />
//                       <span className="slider-value">{ambientIntensity.toFixed(1)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Key Light */}
//                 <div className="section">
//                   <h3 className="section-title">Key Light</h3>
                  
//                   <div className="dual-control">
//                     <div className="control">
//                       <label className="control-label">Intensity</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="0"
//                           max="4"
//                           step="0.1"
//                           value={directional1Intensity}
//                           onChange={(e) => setDirectional1Intensity(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{directional1Intensity.toFixed(1)}</span>
//                       </div>
//                     </div>
//                     <div className="control">
//                       <label className="control-label">Color</label>
//                       <input
//                         type="color"
//                         value={directional1Color}
//                         onChange={(e) => setDirectional1Color(e.target.value)}
//                         className="color-input"
//                       />
//                     </div>
//                   </div>

//                   {/* Position Controls */}
//                   <div className="control">
//                     <label className="control-label">Position</label>
//                     <div className="position-controls">
//                       <div className="position-axis">
//                         <label>X</label>
//                         <input
//                           type="range"
//                           min="-25"
//                           max="25"
//                           step="0.5"
//                           value={directional1Position[0]}
//                           onChange={(e) => setDirectional1Position([parseFloat(e.target.value), directional1Position[1], directional1Position[2]])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{directional1Position[0]}</span>
//                       </div>
//                       <div className="position-axis">
//                         <label>Y</label>
//                         <input
//                           type="range"
//                           min="5"
//                           max="25"
//                           step="0.5"
//                           value={directional1Position[1]}
//                           onChange={(e) => setDirectional1Position([directional1Position[0], parseFloat(e.target.value), directional1Position[2]])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{directional1Position[1]}</span>
//                       </div>
//                       <div className="position-axis">
//                         <label>Z</label>
//                         <input
//                           type="range"
//                           min="-25"
//                           max="25"
//                           step="0.5"
//                           value={directional1Position[2]}
//                           onChange={(e) => setDirectional1Position([directional1Position[0], directional1Position[1], parseFloat(e.target.value)])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{directional1Position[2]}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Fill Light */}
//                 <div className="section">
//                   <h3 className="section-title">Fill Light</h3>
                  
//                   <div className="dual-control">
//                     <div className="control">
//                       <label className="control-label">Intensity</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="0"
//                           max="3"
//                           step="0.1"
//                           value={directional2Intensity}
//                           onChange={(e) => setDirectional2Intensity(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{directional2Intensity.toFixed(1)}</span>
//                       </div>
//                     </div>
//                     <div className="control">
//                       <label className="control-label">Color</label>
//                       <input
//                         type="color"
//                         value={directional2Color}
//                         onChange={(e) => setDirectional2Color(e.target.value)}
//                         className="color-input"
//                       />
//                     </div>
//                   </div>

//                   {/* Position Controls */}
//                   <div className="control">
//                     <label className="control-label">Position</label>
//                     <div className="position-controls">
//                       <div className="position-axis">
//                         <label>X</label>
//                         <input
//                           type="range"
//                           min="-25"
//                           max="25"
//                           step="0.5"
//                           value={directional2Position[0]}
//                           onChange={(e) => setDirectional2Position([parseFloat(e.target.value), directional2Position[1], directional2Position[2]])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{directional2Position[0]}</span>
//                       </div>
//                       <div className="position-axis">
//                         <label>Y</label>
//                         <input
//                           type="range"
//                           min="3"
//                           max="20"
//                           step="0.5"
//                           value={directional2Position[1]}
//                           onChange={(e) => setDirectional2Position([directional2Position[0], parseFloat(e.target.value), directional2Position[2]])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{directional2Position[1]}</span>
//                       </div>
//                       <div className="position-axis">
//                         <label>Z</label>
//                         <input
//                           type="range"
//                           min="-25"
//                           max="25"
//                           step="0.5"
//                           value={directional2Position[2]}
//                           onChange={(e) => setDirectional2Position([directional2Position[0], directional2Position[1], parseFloat(e.target.value)])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{directional2Position[2]}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Rim Light */}
//                 <div className="section">
//                   <h3 className="section-title">Rim Light</h3>
                  
//                   <div className="dual-control">
//                     <div className="control">
//                       <label className="control-label">Intensity</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="0"
//                           max="2"
//                           step="0.1"
//                           value={directional3Intensity}
//                           onChange={(e) => setDirectional3Intensity(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{directional3Intensity.toFixed(1)}</span>
//                       </div>
//                     </div>
//                     <div className="control">
//                       <label className="control-label">Color</label>
//                       <input
//                         type="color"
//                         value={directional3Color}
//                         onChange={(e) => setDirectional3Color(e.target.value)}
//                         className="color-input"
//                       />
//                     </div>
//                   </div>

//                   {/* Position Controls */}
//                   <div className="control">
//                     <label className="control-label">Position</label>
//                     <div className="position-controls">
//                       <div className="position-axis">
//                         <label>X</label>
//                         <input
//                           type="range"
//                           min="-20"
//                           max="20"
//                           step="0.5"
//                           value={directional3Position[0]}
//                           onChange={(e) => setDirectional3Position([parseFloat(e.target.value), directional3Position[1], directional3Position[2]])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{directional3Position[0]}</span>
//                       </div>
//                       <div className="position-axis">
//                         <label>Y</label>
//                         <input
//                           type="range"
//                           min="2"
//                           max="15"
//                           step="0.5"
//                           value={directional3Position[1]}
//                           onChange={(e) => setDirectional3Position([directional3Position[0], parseFloat(e.target.value), directional3Position[2]])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{directional3Position[1]}</span>
//                       </div>
//                       <div className="position-axis">
//                         <label>Z</label>
//                         <input
//                           type="range"
//                           min="-20"
//                           max="20"
//                           step="0.5"
//                           value={directional3Position[2]}
//                           onChange={(e) => setDirectional3Position([directional3Position[0], directional3Position[1], parseFloat(e.target.value)])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{directional3Position[2]}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Actions */}
//             <div className="actions">
//               <button
//                 className="action-btn"
//                 onClick={() => {
//                   console.log('Resetting to table lighting defaults')
//                   setActiveTexture(1)
//                   setLightColor('#ffffff')
//                   setLightIntensity(2)
//                   setAmbientIntensity(0.4)
//                   setDirectional1Intensity(1.8) // Key light - stronger
//                   setDirectional1Position([12, 15, 8]) // Top-front-right
//                   setDirectional1Color('#ffffff')
//                   setDirectional2Intensity(1.2) // Fill light - moderate
//                   setDirectional2Position([-8, 12, 6]) // Top-front-left
//                   setDirectional2Color('#f0f8ff')
//                   setDirectional3Intensity(0.8) // Rim light - subtle
//                   setDirectional3Position([0, 8, -12]) // Behind for rim lighting
//                   setDirectional3Color('#fffacd')
//                 }}
//               >
//                 Reset
//               </button>
//               <button
//                 className="action-btn primary"
//                 onClick={() => {
//                   const config = { 
//                     activeTexture, 
//                     lightColor, 
//                     lightIntensity,
//                     ambientIntensity,
//                     keyLight: {
//                       intensity: directional1Intensity,
//                       position: directional1Position,
//                       color: directional1Color
//                     },
//                     fillLight: {
//                       intensity: directional2Intensity,
//                       position: directional2Position,
//                       color: directional2Color
//                     },
//                     rimLight: {
//                       intensity: directional3Intensity,
//                       position: directional3Position,
//                       color: directional3Color
//                     }
//                   }
//                   console.log('Table configuration saved:', config)
//                 }}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .glass-panel {
//           position: fixed;
//           top: 16px;
//           right: 16px;
//           width: ${isCollapsed ? '56px' : '320px'};
//           max-height: 90vh;
//           background: rgba(2, 0, 0, 0.85);
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(0, 0, 0, 0.56);
//           border-radius: 16px;
//           padding: 16px;
//           color: white;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           z-index: 1000;
//           overflow-y: auto;
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }

//         .glass-panel::-webkit-scrollbar {
//           display: none;
//         }

//         .panel-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: ${isCollapsed ? '0' : '16px'};
//         }

//         .panel-title {
//           margin: 0;
//           font-size: 16px;
//           font-weight: 600;
//           color: white;
//         }

//         .collapse-btn {
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 8px;
//           width: 24px;
//           height: 24px;
//           color: white;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           font-size: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .collapse-btn:hover {
//           background: rgba(255, 255, 255, 0.2);
//           transform: scale(1.1);
//         }

//         .panel-content {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//         }

//         .tab-nav {
//           display: flex;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//           margin-bottom: 8px;
//         }

//         .tab-btn {
//           flex: 1;
//           background: none;
//           border: none;
//           padding: 8px 12px;
//           color: rgba(255, 255, 255, 0.7);
//           cursor: pointer;
//           border-bottom: 2px solid transparent;
//           transition: all 0.3s ease;
//           font-size: 11px;
//           font-weight: 500;
//         }

//         .tab-btn.active {
//           color: white;
//           border-bottom-color: white;
//         }

//         .section {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .section-title {
//           margin: 0;
//           font-size: 12px;
//           font-weight: 600;
//           color: rgba(255, 255, 255, 0.9);
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .texture-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 6px;
//         }

//         .texture-btn {
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 8px;
//           padding: 8px;
//           color: rgba(255, 255, 255, 0.8);
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 2px;
//           font-size: 11px;
//         }

//         .texture-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//           border-color: rgba(255, 255, 255, 0.3);
//         }

//         .texture-btn.active {
//           background: rgba(255, 255, 255, 0.2);
//           border-color: rgba(255, 255, 255, 0.4);
//           color: white;
//         }

//         .texture-number {
//           font-weight: 600;
//           font-size: 12px;
//         }

//         .texture-name {
//           font-size: 9px;
//           opacity: 0.9;
//         }

//         .control {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .control-label {
//           font-size: 10px;
//           font-weight: 500;
//           color: rgba(255, 255, 255, 0.7);
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .color-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 4px;
//         }

//         .color-btn {
//           width: 24px;
//           height: 24px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 6px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .color-btn:hover {
//           transform: scale(1.1);
//           border-color: rgba(255, 255, 255, 0.4);
//         }

//         .color-btn.active {
//           border-width: 2px;
//           border-color: white;
//           transform: scale(1.05);
//         }

//         .dual-control {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//           align-items: end;
//         }

//         .color-input {
//           width: 32px;
//           height: 32px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 6px;
//           background: none;
//           cursor: pointer;
//         }

//         .slider-container {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .slider {
//           flex: 1;
//           height: 4px;
//           background: rgba(255, 255, 255, 0.2);
//           border-radius: 2px;
//           outline: none;
//           cursor: pointer;
//           -webkit-appearance: none;
//           appearance: none;
//         }

//         .slider.small {
//           height: 3px;
//         }

//         .slider::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           appearance: none;
//           width: 16px;
//           height: 16px;
//           background: white;
//           border-radius: 50%;
//           cursor: pointer;
//         }

//         .slider.small::-webkit-slider-thumb {
//           width: 12px;
//           height: 12px;
//         }

//         .slider::-moz-range-thumb {
//           width: 16px;
//           height: 16px;
//           background: white;
//           border-radius: 50%;
//           cursor: pointer;
//           border: none;
//         }

//         .slider-value {
//           font-size: 10px;
//           color: rgba(255, 255, 255, 0.8);
//           font-family: monospace;
//           min-width: 32px;
//           text-align: right;
//         }

//         .position-controls {
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }

//         .position-axis {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .position-axis label {
//           min-width: 12px;
//           font-size: 9px;
//           color: rgba(255, 255, 255, 0.6);
//         }

//         .axis-value {
//           font-size: 9px;
//           color: rgba(255, 255, 255, 0.8);
//           font-family: monospace;
//           min-width: 24px;
//           text-align: right;
//         }

//         .actions {
//           display: flex;
//           gap: 6px;
//         }

//         .action-btn {
//           flex: 1;
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 8px;
//           padding: 8px 12px;
//           color: white;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           font-size: 11px;
//           font-weight: 500;
//         }

//         .action-btn:hover {
//           background: rgba(255, 255, 255, 0.15);
//           transform: translateY(-1px);
//         }

//         .action-btn.primary {
//           background: rgba(255, 255, 255, 0.2);
//           border-color: rgba(255, 255, 255, 0.3);
//         }
//       `}</style>
//     </>
//   )
// }

// // Hook to detect mobile devices
// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768)
//     }
    
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
    
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   return isMobile
// }

// export default function FurnitureConfigurator() {
//   const [activeTexture, setActiveTexture] = useState(1)
//   const [lightColor, setLightColor] = useState('#ffffff')
//   const [lightIntensity, setLightIntensity] = useState(2)
  
//   // Lighting states - Optimized for table lighting
//   const [ambientIntensity, setAmbientIntensity] = useState(0.4)
  
//   // Key Light (Main light from top-front-right)
//   const [directional1Intensity, setDirectional1Intensity] = useState(1.8)
//   const [directional1Position, setDirectional1Position] = useState([12, 15, 8])
//   const [directional1Color, setDirectional1Color] = useState('#ffffff')
  
//   // Fill Light (Secondary light from top-front-left)
//   const [directional2Intensity, setDirectional2Intensity] = useState(1.2)
//   const [directional2Position, setDirectional2Position] = useState([-8, 12, 6])
//   const [directional2Color, setDirectional2Color] = useState('#f0f8ff')
  
//   // Rim Light (Back light for edge definition)
//   const [directional3Intensity, setDirectional3Intensity] = useState(0.8)
//   const [directional3Position, setDirectional3Position] = useState([0, 8, -12])
//   const [directional3Color, setDirectional3Color] = useState('#fffacd')
  
//   const isMobile = useIsMobile()

//   // Dynamic camera settings based on device
//   const cameraPosition = isMobile ? [8, 8, 8] : [5, 5, 5]
//   const cameraFov = isMobile ? 55 : 45

//   return (
//     <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
//       <Canvas
//         camera={{ position: cameraPosition, fov: cameraFov }}
//         shadows
//         gl={{
//           antialias: true,
//           alpha: false,
//           powerPreference: "high-performance",
//           preserveDrawingBuffer: true
//         }}
//         dpr={[1, 2]}
//       >
//         {/* Dark background for ambience */}
//         <color attach="background" args={['#0a0a0a']} />
        
//         <Suspense fallback={<Loader />}>
//           <ContactShadows position={[0, -1, 0]} opacity={0.8} scale={30} blur={1} />
       
//           <Model
//             activeTexture={activeTexture}
//             lightColor={lightColor}
//             lightIntensity={lightIntensity}
//           />

//           {/* Three-Point Lighting Setup for Table */}
//           <Lighting
//             ambientIntensity={ambientIntensity}
//             directional1Intensity={directional1Intensity}
//             directional1Position={directional1Position}
//             directional1Color={directional1Color}
//             directional2Intensity={directional2Intensity}
//             directional2Position={directional2Position}
//             directional2Color={directional2Color}
//             directional3Intensity={directional3Intensity}
//             directional3Position={directional3Position}
//             directional3Color={directional3Color}
//           />
          
//           <EffectComposer>
//             <Bloom
//               intensity={0.2}
//               luminanceThreshold={0.9}
//               luminanceSmoothing={15}
//               height={90}
//             />
//           </EffectComposer>
  
//         </Suspense>
        
//         <OrbitControls
//           enablePan={false}
//           enableZoom={true}
//           enableRotate={true}
//           minDistance={isMobile ? 5 : 3}
//           maxDistance={isMobile ? 20 : 15}
//           minPolarAngle={Math.PI / 6}
//           maxPolarAngle={Math.PI / 2}
//           enableDamping={true}
//           dampingFactor={0.05}
//         />
//       </Canvas>
      
//       <UI
//         activeTexture={activeTexture}
//         setActiveTexture={setActiveTexture}
//         lightColor={lightColor}
//         setLightColor={setLightColor}
//         lightIntensity={lightIntensity}
//         setLightIntensity={setLightIntensity}
//         ambientIntensity={ambientIntensity}
//         setAmbientIntensity={setAmbientIntensity}
//         directional1Intensity={directional1Intensity}
//         setDirectional1Intensity={setDirectional1Intensity}
//         directional1Position={directional1Position}
//         setDirectional1Position={setDirectional1Position}
//         directional1Color={directional1Color}
//         setDirectional1Color={setDirectional1Color}
//         directional2Intensity={directional2Intensity}
//         setDirectional2Intensity={setDirectional2Intensity}
//         directional2Position={directional2Position}
//         setDirectional2Position={setDirectional2Position}
//         directional2Color={directional2Color}
//         setDirectional2Color={setDirectional2Color}
//         directional3Intensity={directional3Intensity}
//         setDirectional3Intensity={setDirectional3Intensity}
//         directional3Position={directional3Position}
//         setDirectional3Position={setDirectional3Position}
//         directional3Color={directional3Color}
//         setDirectional3Color={setDirectional3Color}
//         isMobile={isMobile}
//       />
//     </div>
//   )
// }

// // Preload the model
// useGLTF.preload('/ramses.glb')

// import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import {
//   OrbitControls,
//   useProgress,
//   Html,
//   useGLTF,
//   useTexture,
//   ContactShadows,
//   Environment
// } from '@react-three/drei'
// import * as THREE from 'three'
// import { EffectComposer, Bloom } from '@react-three/postprocessing'

// function Loader() {
//   const { progress } = useProgress()
//   return (
//     <Html center>
//       <div style={{
//         padding: '20px',
//         background: 'rgba(0,0,0,0.8)',
//         borderRadius: '10px',
//         color: 'white',
//         textAlign: 'center',
//         fontFamily: 'Arial, sans-serif'
//       }}>
//         <div style={{
//           width: '200px',
//           height: '4px',
//           background: '#333',
//           borderRadius: '2px',
//           overflow: 'hidden',
//           marginBottom: '10px'
//         }}>
//           <div 
//             style={{
//               width: `${progress}%`,
//               height: '100%',
//               background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
//               transition: 'width 0.3s ease'
//             }}
//           />
//         </div>
//         <p style={{ margin: 0, fontSize: '14px' }}>{progress.toFixed(0)}% loaded</p>
//       </div>
//     </Html>
//   )
// }

// // Optimized Lighting Component with Fixed Values
// function Lighting() {
//   // Fixed optimal lighting values from your console output
//   const lightingConfig = {
//     ambient: {
//       intensity: 0.2
//     },
//     keyLight: {
//       intensity: 2.1,
//       position: [4.5, 25, 21.5],
//       color: '#ffffff'
//     },
//     fillLight: {
//       intensity: 1.1,
//       position: [-25, 3, -7.5],
//       color: '#f0f8ff'
//     },
//     rimLight: {
//       intensity: 1.7,
//       position: [7.5, 12.5, -17],
//       color: '#ffffff'
//     }
//   }

//   const directional1Ref = useRef()
//   const directional2Ref = useRef()
//   const directional3Ref = useRef()

//   useEffect(() => {
//     console.log('Optimized Table Lighting Applied:', lightingConfig)
//   }, [])

//   return (
//     <>
//       {/* Ambient Light - Soft base illumination */}
//       <ambientLight intensity={lightingConfig.ambient.intensity} color="#2c2c2c" />
//       {/* <Environment preset='studio' environmentIntensity={0.4}/> */}
//       {/* Key Light - Main directional light */}
//       <directionalLight
//         ref={directional1Ref}
//         position={lightingConfig.keyLight.position}
//         intensity={lightingConfig.keyLight.intensity}
//         color={lightingConfig.keyLight.color}
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//         shadow-camera-far={50}
//         shadow-camera-left={-15}
//         shadow-camera-right={15}
//         shadow-camera-top={15}
//         shadow-camera-bottom={-15}
//         shadow-bias={-0.0001}
//       />
      
//       {/* Fill Light - Secondary light to fill shadows */}
//       <directionalLight
//         ref={directional2Ref}
//         position={lightingConfig.fillLight.position}
//         intensity={lightingConfig.fillLight.intensity}
//         color={lightingConfig.fillLight.color}
//         castShadow
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//         shadow-camera-far={50}
//         shadow-camera-left={-15}
//         shadow-camera-right={15}
//         shadow-camera-top={15}
//         shadow-camera-bottom={-15}
//       />
      
//       {/* Rim Light - Back light for edge definition */}
//       <directionalLight
//         ref={directional3Ref}
//         position={lightingConfig.rimLight.position}
//         intensity={lightingConfig.rimLight.intensity}
//         color={lightingConfig.rimLight.color}
//         castShadow
//         shadow-mapSize-width={512}
//         shadow-mapSize-height={512}
//         shadow-camera-far={30}
//         shadow-camera-left={-10}
//         shadow-camera-right={10}
//         shadow-camera-top={10}
//         shadow-camera-bottom={-10}
//       />
//     </>
//   )
// }

// // Your Model component (unchanged)
// function Model({ activeTexture, lightColor, lightIntensity, ...props }) {
//   const { nodes, materials } = useGLTF('/ramses.glb')
//   const groupRef = useRef()
//   const upbaseRef = useRef()
//   const lightbaseRef = useRef()
  
//   // Load all texture sets
//   const textures = useTexture({
//     // Texture Set 1
//     baseColor1: '/textures/1base.jpg',
//     normal1: '/textures/1norm.jpg',
//     specular1: '/textures/1specular.jpg',
//     ao1: '/textures/1aomap.jpg',
    
//     // Texture Set 2
//     baseColor2: '/textures/2base.jpg',
//     normal2: '/textures/2norm.jpg',
//     specular2: '/textures/2specular.jpg',
//     ao2: '/textures/2aomap.jpg',
    
//     // Texture Set 3
//     baseColor3: '/textures/3base.jpg',
//     normal3: '/textures/3norm.jpg',
//     specular3: '/textures/3specular.jpg',
//     ao3: '/textures/3aomap.jpg',
    
//     // Texture Set 4
//     baseColor4: '/textures/4base.jpg',
//     normal4: '/textures/4norm.jpg',
//     specular4: '/textures/4specular.jpg',
//     ao4: '/textures/4aomap.jpg',
//   })

//   // Configure textures for better quality and scale them down 5x
//   Object.values(textures).forEach(texture => {
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping
//     texture.repeat.set(10, 10) // Scale down by 5x (textures repeat 5 times)
//     texture.flipY = false
//     texture.generateMipmaps = true
//     texture.minFilter = THREE.LinearMipmapLinearFilter
//     texture.magFilter = THREE.LinearFilter
//     texture.anisotropy = 16
//   })

//   // Create materials for each texture set (for Upbase/table)
//   const tableMaterials = useMemo(() => {
//     const materials = {}
//     for (let i = 1; i <= 4; i++) {
//       materials[i] = new THREE.MeshStandardMaterial({
//         map: textures[`baseColor${i}`],
//         normalMap: textures[`normal${i}`],
//         roughnessMap: textures[`specular${i}`],
//         aoMap: textures[`ao${i}`],
//         aoMapIntensity: 1,
//         roughness: 0.98,
//         metalness: 0.01,
//         normalScale: new THREE.Vector2(1, 1),
//       })
      
//       // Set the second UV channel for AO map if available
//       if (materials[i].aoMap) {
//         materials[i].aoMap.channel = 1
//       }
//     }
//     return materials
//   }, [textures])

//   // Light material with emissive properties (for Lightbase)
//   const lightMaterial = useMemo(() => {
//     return new THREE.MeshStandardMaterial({
//       color: lightColor,
//       emissive: lightColor,
//       emissiveIntensity: lightIntensity,
//       roughness: 0.1,
//       metalness: 0.1,
//       transparent: true,
//       opacity: 0.9,
//     })
//   }, [lightColor, lightIntensity])

//   // Update materials immediately when texture changes
//   useEffect(() => {
//     if (upbaseRef.current && tableMaterials[activeTexture]) {
//       upbaseRef.current.material = tableMaterials[activeTexture]
//       upbaseRef.current.material.needsUpdate = true
//     }
//   }, [activeTexture, tableMaterials])

//   // Update Lightbase material when color/intensity changes
//   useEffect(() => {
//     if (lightbaseRef.current && lightMaterial) {
//       lightbaseRef.current.material = lightMaterial
//       lightbaseRef.current.material.needsUpdate = true
//     }
//   }, [lightMaterial])

//   // Subtle breathing animation and light pulsing
//   useFrame((state) => {
//     if (groupRef.current) {
//       groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
//     }
    
//     if (lightbaseRef.current && lightbaseRef.current.material) {
//       const pulseFactor = Math.sin(state.clock.elapsedTime * 2) * 0.2
//       lightbaseRef.current.material.emissiveIntensity = lightIntensity + pulseFactor
      
//       // Add subtle color shift for warmth
//       const time = state.clock.elapsedTime * 0.5
//       const colorShift = Math.sin(time) * 0.05
//       lightbaseRef.current.material.emissive.setHex(
//         new THREE.Color(lightColor).offsetHSL(0, 0, colorShift).getHex()
//       )
//     }
//   })

//   return (
//     <group ref={groupRef} {...props} dispose={null}>
//       {/* Upbase - Table that receives texture changes */}
//       <mesh
//         ref={upbaseRef}
//         castShadow
//         receiveShadow
//         geometry={nodes.Upbase.geometry}
//         material={tableMaterials[activeTexture]}
//       />
      
//       {/* Lightbase - Light that glows and changes color */}
//       <mesh
//         ref={lightbaseRef}
//         castShadow
//         receiveShadow
//         geometry={nodes.Lightbase.geometry}
//         material={lightMaterial}
//       />
//     </group>
//   )
// }

// // Simplified UI Component (no lighting controls)
// function UI({ 
//   activeTexture, 
//   setActiveTexture, 
//   lightColor, 
//   setLightColor,
//   lightIntensity,
//   setLightIntensity,
//   isMobile
// }) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   const textureNames = ['Wood1', 'Wood2', 'Wood3', 'Wood4']
//   const presetColors = [
//     '#ffffff', '#f0f0f0', '#d0d0d0', '#a0a0a0',
//     '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'
//   ]

//   const handleTextureChange = (index) => {
//     console.log('Texture changed to:', index)
//     setActiveTexture(index)
//   }

//   const handleColorChange = (color) => {
//     console.log('Light color changed to:', color)
//     setLightColor(color)
//   }

//   const handleIntensityChange = (intensity) => {
//     console.log('Light intensity changed to:', intensity)
//     setLightIntensity(intensity)
//   }

//   // Mobile UI
//   if (isMobile) {
//     return (
//       <>
//         {/* Mobile Menu Toggle */}
//         <div className="mobile-toggle">
//           <button
//             className="toggle-btn"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             <span className="toggle-icon">{mobileMenuOpen ? '✕' : '⚙️'}</span>
//             <span className="toggle-text">Configure</span>
//           </button>
//         </div>

//         {/* Mobile Menu Overlay */}
//         {mobileMenuOpen && (
//           <div className="mobile-overlay">
//             <div className="mobile-panel">
//               <div className="mobile-header">
//                 <h2>Table Configurator</h2>
//                 <button 
//                   className="close-btn"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="mobile-content">
//                 {/* Materials */}
//                 <div className="mobile-section">
//                   <h3>Table Material</h3>
//                   <div className="mobile-texture-grid">
//                     {[1, 2, 3, 4].map((index) => (
//                       <button
//                         key={index}
//                         className={`mobile-texture-btn ${activeTexture === index ? 'active' : ''}`}
//                         onClick={() => handleTextureChange(index)}
//                       >
//                         <span className="texture-number">{index}</span>
//                         <span className="texture-name">{textureNames[index - 1]}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Model Lighting */}
//                 <div className="mobile-section">
//                   <h3>Table Light</h3>
//                   <div className="mobile-control">
//                     <label>Color</label>
//                     <div className="mobile-color-grid">
//                       {presetColors.map((color, index) => (
//                         <button
//                           key={index}
//                           className={`mobile-color-btn ${lightColor === color ? 'active' : ''}`}
//                           style={{ backgroundColor: color }}
//                           onClick={() => handleColorChange(color)}
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   <div className="mobile-dual-control">
//                     <div className="mobile-control">
//                       <label>Custom</label>
//                       <input
//                         type="color"
//                         value={lightColor}
//                         onChange={(e) => handleColorChange(e.target.value)}
//                         className="mobile-color-input"
//                       />
//                     </div>
//                     <div className="mobile-control">
//                       <label>Intensity</label>
//                       <div className="mobile-slider-container">
//                         <input
//                           type="range"
//                           min="0.5"
//                           max="5"
//                           step="0.1"
//                           value={lightIntensity}
//                           onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
//                           className="mobile-slider"
//                         />
//                         <span className="mobile-slider-value">{lightIntensity.toFixed(1)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <style jsx>{`
//           .mobile-toggle {
//             position: fixed;
//             bottom: 20px;
//             left: 50%;
//             transform: translateX(-50%);
//             z-index: 1000;
//           }

//           .toggle-btn {
//             background: rgba(0, 0, 0, 0.85);
//             backdrop-filter: blur(20px);
//             border: 1px solid rgba(255, 255, 255, 0.2);
//             border-radius: 25px;
//             padding: 12px 20px;
//             color: white;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             font-size: 14px;
//             font-weight: 500;
//           }

//           .toggle-btn:hover {
//             background: rgba(0, 0, 0, 0.9);
//             transform: scale(1.05);
//           }

//           .toggle-icon {
//             font-size: 16px;
//           }

//           .mobile-overlay {
//             position: fixed;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background: rgba(0, 0, 0, 0.8);
//             backdrop-filter: blur(10px);
//             z-index: 1001;
//             display: flex;
//             align-items: flex-end;
//           }

//           .mobile-panel {
//             width: 100%;
//             max-height: 80vh;
//             background: rgba(0, 0, 0, 0.95);
//             border-radius: 20px 20px 0 0;
//             color: white;
//             overflow-y: auto;
//           }

//           .mobile-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 20px;
//             border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//           }

//           .mobile-header h2 {
//             margin: 0;
//             font-size: 20px;
//             font-weight: 600;
//           }

//           .close-btn {
//             background: rgba(255, 255, 255, 0.1);
//             border: none;
//             border-radius: 50%;
//             width: 32px;
//             height: 32px;
//             color: white;
//             cursor: pointer;
//             font-size: 16px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }

//           .mobile-content {
//             padding: 20px;
//             display: flex;
//             flex-direction: column;
//             gap: 24px;
//           }

//           .mobile-section {
//             display: flex;
//             flex-direction: column;
//             gap: 12px;
//           }

//           .mobile-section h3 {
//             margin: 0;
//             font-size: 16px;
//             font-weight: 600;
//             color: rgba(255, 255, 255, 0.9);
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//           }

//           .mobile-texture-grid {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 12px;
//           }

//           .mobile-texture-btn {
//             background: rgba(255, 255, 255, 0.05);
//             border: 1px solid rgba(255, 255, 255, 0.1);
//             border-radius: 12px;
//             padding: 16px;
//             color: rgba(255, 255, 255, 0.8);
//             cursor: pointer;
//             transition: all 0.2s ease;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             gap: 4px;
//           }

//           .mobile-texture-btn:hover,
//           .mobile-texture-btn.active {
//             background: rgba(255, 255, 255, 0.15);
//             border-color: rgba(255, 255, 255, 0.3);
//             color: white;
//           }

//           .texture-number {
//             font-weight: 600;
//             font-size: 18px;
//           }

//           .texture-name {
//             font-size: 12px;
//             opacity: 0.8;
//           }

//           .mobile-control {
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//           }

//           .mobile-control label {
//             font-size: 12px;
//             font-weight: 500;
//             color: rgba(255, 255, 255, 0.7);
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//           }

//           .mobile-dual-control {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 16px;
//           }

//           .mobile-color-grid {
//             display: grid;
//             grid-template-columns: repeat(4, 1fr);
//             gap: 8px;
//           }

//           .mobile-color-btn {
//             width: 40px;
//             height: 40px;
//             border: 2px solid rgba(255, 255, 255, 0.2);
//             border-radius: 8px;
//             cursor: pointer;
//             transition: all 0.2s ease;
//           }

//           .mobile-color-btn:hover,
//           .mobile-color-btn.active {
//             border-color: white;
//             transform: scale(1.1);
//           }

//           .mobile-color-input {
//             width: 40px;
//             height: 40px;
//             border: 2px solid rgba(255, 255, 255, 0.2);
//             border-radius: 8px;
//             background: none;
//             cursor: pointer;
//           }

//           .mobile-slider-container {
//             display: flex;
//             align-items: center;
//             gap: 8px;
//           }

//           .mobile-slider {
//             flex: 1;
//             height: 6px;
//             background: rgba(255, 255, 255, 0.2);
//             border-radius: 3px;
//             outline: none;
//             cursor: pointer;
//             -webkit-appearance: none;
//             appearance: none;
//           }

//           .mobile-slider::-webkit-slider-thumb {
//             -webkit-appearance: none;
//             appearance: none;
//             width: 20px;
//             height: 20px;
//             background: white;
//             border-radius: 50%;
//             cursor: pointer;
//           }

//           .mobile-slider-value {
//             font-size: 12px;
//             color: rgba(255, 255, 255, 0.8);
//             font-family: monospace;
//             min-width: 40px;
//             text-align: right;
//           }
//         `}</style>
//       </>
//     )
//   }

//   // Desktop UI (simplified - no lighting tab)
//   return (
//     <>
//       <div className="glass-panel">
//         <div className="panel-header">
//           <h2 className="panel-title">
//             {isCollapsed ? 'TC' : 'Table Configurator'}
//           </h2>
//           <button 
//             className="collapse-btn"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//           >
//             {isCollapsed ? '←' : '→'}
//           </button>
//         </div>
        
//         {!isCollapsed && (
//           <div className="panel-content">
//             {/* Materials */}
//             <div className="section">
//               <h3 className="section-title">Table Material</h3>
//               <div className="texture-grid">
//                 {[1, 2, 3, 4].map((index) => (
//                   <button
//                     key={index}
//                     className={`texture-btn ${activeTexture === index ? 'active' : ''}`}
//                     onClick={() => handleTextureChange(index)}
//                   >
//                     <span className="texture-number">{index}</span>
//                     <span className="texture-name">{textureNames[index - 1]}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Model Lighting */}
//             <div className="section">
//               <h3 className="section-title">Table Light</h3>
              
//               <div className="control">
//                 <label className="control-label">Color</label>
//                 <div className="color-grid">
//                   {presetColors.map((color, index) => (
//                     <button
//                       key={index}
//                       className={`color-btn ${lightColor === color ? 'active' : ''}`}
//                       style={{ backgroundColor: color }}
//                       onClick={() => handleColorChange(color)}
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div className="dual-control">
//                 <div className="control">
//                   <label className="control-label">Custom</label>
//                   <input
//                     type="color"
//                     value={lightColor}
//                     onChange={(e) => handleColorChange(e.target.value)}
//                     className="color-input"
//                   />
//                 </div>
//                 <div className="control">
//                   <label className="control-label">Intensity</label>
//                   <div className="slider-container">
//                     <input
//                       type="range"
//                       min="0.5"
//                       max="5"
//                       step="0.1"
//                       value={lightIntensity}
//                       onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
//                       className="slider"
//                     />
//                     <span className="slider-value">{lightIntensity.toFixed(1)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="actions">
//               <button
//                 className="action-btn"
//                 onClick={() => {
//                   console.log('Resetting to defaults')
//                   setActiveTexture(1)
//                   setLightColor('#ffffff')
//                   setLightIntensity(2)
//                 }}
//               >
//                 Reset
//               </button>
//               <button
//                 className="action-btn primary"
//                 onClick={() => {
//                   const config = { 
//                     activeTexture, 
//                     lightColor, 
//                     lightIntensity
//                   }
//                   console.log('Table configuration saved:', config)
//                 }}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .glass-panel {
//           position: fixed;
//           top: 16px;
//           right: 16px;
//           width: ${isCollapsed ? '56px' : '280px'};
//           max-height: 90vh;
//           background: rgba(2, 0, 0, 0.85);
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(0, 0, 0, 0.56);
//           border-radius: 16px;
//           padding: 16px;
//           color: white;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           z-index: 1000;
//           overflow-y: auto;
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }

//         .glass-panel::-webkit-scrollbar {
//           display: none;
//         }

//         .panel-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: ${isCollapsed ? '0' : '16px'};
//         }

//         .panel-title {
//           margin: 0;
//           font-size: 16px;
//           font-weight: 600;
//           color: white;
//         }

//         .collapse-btn {
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 8px;
//           width: 24px;
//           height: 24px;
//           color: white;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           font-size: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .collapse-btn:hover {
//           background: rgba(255, 255, 255, 0.2);
//           transform: scale(1.1);
//         }

//         .panel-content {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//         }

//         .section {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .section-title {
//           margin: 0;
//           font-size: 12px;
//           font-weight: 600;
//           color: rgba(255, 255, 255, 0.9);
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .texture-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 6px;
//         }

//         .texture-btn {
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 8px;
//           padding: 8px;
//           color: rgba(255, 255, 255, 0.8);
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 2px;
//           font-size: 11px;
//         }

//         .texture-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//           border-color: rgba(255, 255, 255, 0.3);
//         }

//         .texture-btn.active {
//           background: rgba(255, 255, 255, 0.2);
//           border-color: rgba(255, 255, 255, 0.4);
//           color: white;
//         }

//         .texture-number {
//           font-weight: 600;
//           font-size: 12px;
//         }

//         .texture-name {
//           font-size: 9px;
//           opacity: 0.9;
//         }

//         .control {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .control-label {
//           font-size: 10px;
//           font-weight: 500;
//           color: rgba(255, 255, 255, 0.7);
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .color-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 4px;
//         }

//         .color-btn {
//           width: 24px;
//           height: 24px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 6px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .color-btn:hover {
//           transform: scale(1.1);
//           border-color: rgba(255, 255, 255, 0.4);
//         }

//         .color-btn.active {
//           border-width: 2px;
//           border-color: white;
//           transform: scale(1.05);
//         }

//         .dual-control {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//           align-items: end;
//         }

//         .color-input {
//           width: 32px;
//           height: 32px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 6px;
//           background: none;
//           cursor: pointer;
//         }

//         .slider-container {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .slider {
//           flex: 1;
//           height: 4px;
//           background: rgba(255, 255, 255, 0.2);
//           border-radius: 2px;
//           outline: none;
//           cursor: pointer;
//           -webkit-appearance: none;
//           appearance: none;
//         }

//         .slider::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           appearance: none;
//           width: 16px;
//           height: 16px;
//           background: white;
//           border-radius: 50%;
//           cursor: pointer;
//         }

//         .slider::-moz-range-thumb {
//           width: 16px;
//           height: 16px;
//           background: white;
//           border-radius: 50%;
//           cursor: pointer;
//           border: none;
//         }

//         .slider-value {
//           font-size: 10px;
//           color: rgba(255, 255, 255, 0.8);
//           font-family: monospace;
//           min-width: 32px;
//           text-align: right;
//         }

//         .actions {
//           display: flex;
//           gap: 6px;
//         }

//         .action-btn {
//           flex: 1;
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 8px;
//           padding: 8px 12px;
//           color: white;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           font-size: 11px;
//           font-weight: 500;
//         }

//         .action-btn:hover {
//           background: rgba(255, 255, 255, 0.15);
//           transform: translateY(-1px);
//         }

//         .action-btn.primary {
//           background: rgba(255, 255, 255, 0.2);
//           border-color: rgba(255, 255, 255, 0.3);
//         }
//       `}</style>
//     </>
//   )
// }

// // Hook to detect mobile devices
// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768)
//     }
    
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
    
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   return isMobile
// }

// export default function FurnitureConfigurator() {
//   const [activeTexture, setActiveTexture] = useState(1)
//   const [lightColor, setLightColor] = useState('#ffffff')
//   const [lightIntensity, setLightIntensity] = useState(2)
  
//   const isMobile = useIsMobile()

//   // Dynamic camera settings based on device
//   const cameraPosition = isMobile ? [8, 8, 8] : [5, 5, 5]
//   const cameraFov = isMobile ? 55 : 45

//   return (
//     <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
//       <Canvas
//         camera={{ position: cameraPosition, fov: cameraFov }}
//         shadows
//         gl={{
//           antialias: true,
//           alpha: false,
//           powerPreference: "high-performance",
//           preserveDrawingBuffer: true
//         }}
//         dpr={[1, 2]}
//       >
//         {/* Dark background for ambience */}
//         <color attach="background" args={['#0a0a0a']} />
        
//         <Suspense fallback={<Loader />}>
//           <ContactShadows position={[0, -1, 0]} opacity={0.8} scale={30} blur={1} />
       
//           <Model
//             activeTexture={activeTexture}
//             lightColor={lightColor}
//             lightIntensity={lightIntensity}
//           />

//           {/* Optimized Fixed Lighting Setup */}
//           <Lighting />
          
//           <EffectComposer>
//             <Bloom
//               intensity={0.2}
//               luminanceThreshold={0.9}
//               luminanceSmoothing={15}
//               height={90}
//             />
//           </EffectComposer>
  
//         </Suspense>
        
//         <OrbitControls
//           enablePan={false}
//           enableZoom={true}
//           enableRotate={true}
//           minDistance={isMobile ? 5 : 3}
//           maxDistance={isMobile ? 20 : 15}
//           minPolarAngle={Math.PI / 6}
//           maxPolarAngle={Math.PI / 2}
//           enableDamping={true}
//           dampingFactor={0.05}
//         />
//       </Canvas>
      
//       <UI
//         activeTexture={activeTexture}
//         setActiveTexture={setActiveTexture}
//         lightColor={lightColor}
//         setLightColor={setLightColor}
//         lightIntensity={lightIntensity}
//         setLightIntensity={setLightIntensity}
//         isMobile={isMobile}
//       />
//     </div>
//   )
// }

// // Preload the model
// useGLTF.preload('/ramses.glb')


// import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import {
//   OrbitControls,
//   useProgress,
//   Html,
//   useGLTF,
//   useTexture,
//   MeshReflectorMaterial
// } from '@react-three/drei'
// import * as THREE from 'three'
// import { EffectComposer, Bloom } from '@react-three/postprocessing'
// import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

// // Initialize RectAreaLight uniforms
// RectAreaLightUniformsLib.init()

// function Loader() {
//   const { progress } = useProgress()
//   return (
//     <Html center>
//       <div style={{
//         padding: '20px',
//         background: 'rgba(0,0,0,0.8)',
//         borderRadius: '10px',
//         color: 'white',
//         textAlign: 'center',
//         fontFamily: 'Arial, sans-serif'
//       }}>
//         <div style={{
//           width: '200px',
//           height: '4px',
//           background: '#333',
//           borderRadius: '2px',
//           overflow: 'hidden',
//           marginBottom: '10px'
//         }}>
//           <div 
//             style={{
//               width: `${progress}%`,
//               height: '100%',
//               background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
//               transition: 'width 0.3s ease'
//             }}
//           />
//         </div>
//         <p style={{ margin: 0, fontSize: '14px' }}>{progress.toFixed(0)}% loaded</p>
//       </div>
//     </Html>
//   )
// }

// // Modern Under-Table Lighting Component using THREE.RectAreaLight directly
// function ModernLighting({ 
//   rectIntensity,
//   rectColor,
//   spotlightIntensity,
//   spotlightPosition,
//   spotlightAngle,
//   spotlightPenumbra,
//   spotlightDistance,
//   spotlightDecay
// }) {
//   const spotlightRef = useRef()
//   const rectLight1Ref = useRef()
//   const rectLight2Ref = useRef()
//   const rectLight3Ref = useRef()
//   const rectLight4Ref = useRef()
  
//   useEffect(() => {
//     console.log('Modern Lighting Setup:', {
//       rectLights: {
//         intensity: rectIntensity,
//         color: rectColor
//       },
//       spotlight: {
//         intensity: spotlightIntensity,
//         position: spotlightPosition,
//         angle: spotlightAngle,
//         penumbra: spotlightPenumbra,
//         distance: spotlightDistance,
//         decay: spotlightDecay
//       }
//     })
//   }, [rectIntensity, rectColor, spotlightIntensity, spotlightPosition, spotlightAngle, spotlightPenumbra, spotlightDistance, spotlightDecay])

//   return (
//     <>
//       {/* Ambient Light for general illumination */}
//       <ambientLight intensity={0.1} color="#1a1a1a" />
      
//       {/* Rect Light 1 - Right side */}
//       <rectAreaLight
//         ref={rectLight1Ref}
//         width={4.78}
//         height={0.844}
//         intensity={rectIntensity}
//         color={rectColor}
//         position={[2.367, -0.875, 0.001]}
//         rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
//       />
      
//       {/* Rect Light 2 - Left side */}
//       <rectAreaLight
//         ref={rectLight2Ref}
//         width={4.78}
//         height={0.844}
//         intensity={rectIntensity}
//         color={rectColor}
//         position={[-2.382, -0.875, 0.001]}
//         rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
//       />
      
//       {/* Rect Light 3 - Back */}
//       <rectAreaLight
//         ref={rectLight3Ref}
//         width={4.78}
//         height={0.844}
//         intensity={rectIntensity}
//         color={rectColor}
//         position={[0.012, -0.875, 2.385]}
//         rotation={[-Math.PI / 2, 0, Math.PI]}
//       />
      
//       {/* Rect Light 4 - Front */}
//       <rectAreaLight
//         ref={rectLight4Ref}
//         width={4.78}
//         height={0.844}
//         intensity={rectIntensity}
//         color={rectColor}
//         position={[0.012, -0.875, -2.364]}
//         rotation={[-Math.PI / 2, 0, Math.PI]}
//       />
      
//       {/* Main Spotlight from front */}
//       <spotLight
//         ref={spotlightRef}
//         position={spotlightPosition}
//         intensity={spotlightIntensity}
//         angle={spotlightAngle}
//         penumbra={spotlightPenumbra}
//         distance={spotlightDistance}
//         decay={spotlightDecay}
//         color="#ffffff"
//         castShadow
//         shadow-mapSize-width={2048}
//         shadow-mapSize-height={2048}
//         shadow-camera-near={0.5}
//         shadow-camera-far={50}
//         shadow-bias={-0.0001}
//         target-position={[0, 0, 0]}
//       />
//     </>
//   )
// }

// // Reflective Floor Component using MeshReflectorMaterial
// function ReflectiveFloor() {
//   return (
//     <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//       <planeGeometry args={[80, 80]} />
//       <MeshReflectorMaterial
//         blur={[100, 100]}
//         resolution={1024}
//         mixBlur={1}
//         mixStrength={0.8}
//         roughness={1}
//         depthScale={1.2}
//         minDepthThreshold={0.4}
//         maxDepthThreshold={1.4}
//         color="#151515"
//         metalness={0.8}
//         mirror={0.6}
//       />
//     </mesh>
//   )
// }

// // Your Model component (unchanged for lightbase behavior)
// function Model({ activeTexture, lightColor, lightIntensity, ...props }) {
//   const { nodes, materials } = useGLTF('/ramses.glb')
//   const groupRef = useRef()
//   const upbaseRef = useRef()
//   const lightbaseRef = useRef()
  
//   // Load all texture sets
//   const textures = useTexture({
//     // Texture Set 1
//     baseColor1: '/textures/1base.jpg',
//     normal1: '/textures/1norm.jpg',
//     specular1: '/textures/1specular.jpg',
//     ao1: '/textures/1aomap.jpg',
    
//     // Texture Set 2
//     baseColor2: '/textures/2base.jpg',
//     normal2: '/textures/2norm.jpg',
//     specular2: '/textures/2specular.jpg',
//     ao2: '/textures/2aomap.jpg',
    
//     // Texture Set 3
//     baseColor3: '/textures/3base.jpg',
//     normal3: '/textures/3norm.jpg',
//     specular3: '/textures/3specular.jpg',
//     ao3: '/textures/3aomap.jpg',
    
//     // Texture Set 4
//     baseColor4: '/textures/4base.jpg',
//     normal4: '/textures/4norm.jpg',
//     specular4: '/textures/4specular.jpg',
//     ao4: '/textures/4aomap.jpg',
//   })

//   // Configure textures for better quality and scale them down 5x
//   Object.values(textures).forEach(texture => {
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping
//     texture.repeat.set(10, 10) // Scale down by 5x (textures repeat 5 times)
//     texture.flipY = false
//     texture.generateMipmaps = true
//     texture.minFilter = THREE.LinearMipmapLinearFilter
//     texture.magFilter = THREE.LinearFilter
//     texture.anisotropy = 16
//   })

//   // Create materials for each texture set (for Upbase/table)
//   const tableMaterials = useMemo(() => {
//     const materials = {}
//     for (let i = 1; i <= 4; i++) {
//       materials[i] = new THREE.MeshStandardMaterial({
//         map: textures[`baseColor${i}`],
//         normalMap: textures[`normal${i}`],
//         roughnessMap: textures[`specular${i}`],
//         aoMap: textures[`ao${i}`],
//         aoMapIntensity: 1,
//         roughness: 0.98,
//         metalness: 0.01,
//         normalScale: new THREE.Vector2(1, 1),
//       })
      
//       // Set the second UV channel for AO map if available
//       if (materials[i].aoMap) {
//         materials[i].aoMap.channel = 1
//       }
//     }
//     return materials
//   }, [textures])

//   // Light material with emissive properties (for Lightbase)
//   const lightMaterial = useMemo(() => {
//     return new THREE.MeshStandardMaterial({
//       color: lightColor,
//       emissive: lightColor,
//       emissiveIntensity: lightIntensity,
//       roughness: 0.1,
//       metalness: 0.1,
//       transparent: true,
//       opacity: 0.9,
//     })
//   }, [lightColor, lightIntensity])

//   // Update materials immediately when texture changes
//   useEffect(() => {
//     if (upbaseRef.current && tableMaterials[activeTexture]) {
//       upbaseRef.current.material = tableMaterials[activeTexture]
//       upbaseRef.current.material.needsUpdate = true
//     }
//   }, [activeTexture, tableMaterials])

//   // Update Lightbase material when color/intensity changes
//   useEffect(() => {
//     if (lightbaseRef.current && lightMaterial) {
//       lightbaseRef.current.material = lightMaterial
//       lightbaseRef.current.material.needsUpdate = true
//     }
//   }, [lightMaterial])

//   // Subtle breathing animation and light pulsing
//   useFrame((state) => {
//     if (groupRef.current) {
//       groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
//     }
    
//     if (lightbaseRef.current && lightbaseRef.current.material) {
//       const pulseFactor = Math.sin(state.clock.elapsedTime * 2) * 0.2
//       lightbaseRef.current.material.emissiveIntensity = lightIntensity + pulseFactor
      
//       // Add subtle color shift for warmth
//       const time = state.clock.elapsedTime * 0.5
//       const colorShift = Math.sin(time) * 0.05
//       lightbaseRef.current.material.emissive.setHex(
//         new THREE.Color(lightColor).offsetHSL(0, 0, colorShift).getHex()
//       )
//     }
//   })

//   return (
//     <group ref={groupRef} {...props} dispose={null}>
//       {/* Upbase - Table that receives texture changes */}
//       <mesh
//         ref={upbaseRef}
//         castShadow
//         receiveShadow
//         geometry={nodes.Upbase.geometry}
//         material={tableMaterials[activeTexture]}
//       />
      
//       {/* Lightbase - Light that glows and changes color */}
//       <mesh
//         ref={lightbaseRef}
//         castShadow
//         receiveShadow
//         geometry={nodes.Lightbase.geometry}
//         material={lightMaterial}
//       />
//     </group>
//   )
// }

// // Enhanced UI Component with modern lighting controls
// function UI({ 
//   activeTexture, 
//   setActiveTexture, 
//   lightColor, 
//   setLightColor,
//   lightIntensity,
//   setLightIntensity,
//   rectIntensity,
//   setRectIntensity,
//   rectColor,
//   setRectColor,
//   spotlightIntensity,
//   setSpotlightIntensity,
//   spotlightPosition,
//   setSpotlightPosition,
//   spotlightAngle,
//   setSpotlightAngle,
//   spotlightPenumbra,
//   setSpotlightPenumbra,
//   spotlightDistance,
//   setSpotlightDistance,
//   spotlightDecay,
//   setSpotlightDecay,
//   isMobile
// }) {
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const [activeTab, setActiveTab] = useState('materials')

//   const textureNames = ['Wood1', 'Wood2', 'Wood3', 'Wood4']
//   const presetColors = [
//     '#ffffff', '#f0f0f0', '#d0d0d0', '#a0a0a0',
//     '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1'
//   ]
  
//   const warmColors = [
//     '#ffb366', '#ff9933', '#ff7f00', '#ff6600',
//     '#ff4500', '#ff3300', '#ff6666', '#ff9999'
//   ]

//   const handleTextureChange = (index) => {
//     console.log('Texture changed to:', index)
//     setActiveTexture(index)
//   }

//   const handleColorChange = (color) => {
//     console.log('Light color changed to:', color)
//     setLightColor(color)
//   }

//   const handleIntensityChange = (intensity) => {
//     console.log('Light intensity changed to:', intensity)
//     setLightIntensity(intensity)
//   }

//   // Mobile UI
//   if (isMobile) {
//     return (
//       <>
//         {/* Mobile Menu Toggle */}
//         <div className="mobile-toggle">
//           <button
//             className="toggle-btn"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             <span className="toggle-icon">{mobileMenuOpen ? '✕' : '⚙️'}</span>
//             <span className="toggle-text">Configure</span>
//           </button>
//         </div>

//         {/* Mobile Menu Overlay */}
//         {mobileMenuOpen && (
//           <div className="mobile-overlay">
//             <div className="mobile-panel">
//               <div className="mobile-header">
//                 <h2>Modern Table</h2>
//                 <button 
//                   className="close-btn"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   ✕
//                 </button>
//               </div>

//               {/* Tab Navigation */}
//               <div className="mobile-tabs">
//                 <button
//                   className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
//                   onClick={() => setActiveTab('materials')}
//                 >
//                   Materials
//                 </button>
//                 <button
//                   className={`tab-btn ${activeTab === 'lighting' ? 'active' : ''}`}
//                   onClick={() => setActiveTab('lighting')}
//                 >
//                   Lighting
//                 </button>
//               </div>

//               <div className="mobile-content">
//                 {activeTab === 'materials' && (
//                   <>
//                     {/* Materials */}
//                     <div className="mobile-section">
//                       <h3>Table Material</h3>
//                       <div className="mobile-texture-grid">
//                         {[1, 2, 3, 4].map((index) => (
//                           <button
//                             key={index}
//                             className={`mobile-texture-btn ${activeTexture === index ? 'active' : ''}`}
//                             onClick={() => handleTextureChange(index)}
//                           >
//                             <span className="texture-number">{index}</span>
//                             <span className="texture-name">{textureNames[index - 1]}</span>
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Table Light */}
//                     <div className="mobile-section">
//                       <h3>Table Light</h3>
//                       <div className="mobile-control">
//                         <label>Color</label>
//                         <div className="mobile-color-grid">
//                           {presetColors.map((color, index) => (
//                             <button
//                               key={index}
//                               className={`mobile-color-btn ${lightColor === color ? 'active' : ''}`}
//                               style={{ backgroundColor: color }}
//                               onClick={() => handleColorChange(color)}
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       <div className="mobile-dual-control">
//                         <div className="mobile-control">
//                           <label>Custom</label>
//                           <input
//                             type="color"
//                             value={lightColor}
//                             onChange={(e) => handleColorChange(e.target.value)}
//                             className="mobile-color-input"
//                           />
//                         </div>
//                         <div className="mobile-control">
//                           <label>Intensity</label>
//                           <div className="mobile-slider-container">
//                             <input
//                               type="range"
//                               min="0.5"
//                               max="5"
//                               step="0.1"
//                               value={lightIntensity}
//                               onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
//                               className="mobile-slider"
//                             />
//                             <span className="mobile-slider-value">{lightIntensity.toFixed(1)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {activeTab === 'lighting' && (
//                   <>
//                     {/* Under-Table Lights */}
//                     <div className="mobile-section">
//                       <h3>Under-Table Lights</h3>
//                       <div className="mobile-control">
//                         <label>Warm Colors</label>
//                         <div className="mobile-color-grid">
//                           {warmColors.map((color, index) => (
//                             <button
//                               key={index}
//                               className={`mobile-color-btn ${rectColor === color ? 'active' : ''}`}
//                               style={{ backgroundColor: color }}
//                               onClick={() => setRectColor(color)}
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       <div className="mobile-dual-control">
//                         <div className="mobile-control">
//                           <label>Custom</label>
//                           <input
//                             type="color"
//                             value={rectColor}
//                             onChange={(e) => setRectColor(e.target.value)}
//                             className="mobile-color-input"
//                           />
//                         </div>
//                         <div className="mobile-control">
//                           <label>Intensity</label>
//                           <div className="mobile-slider-container">
//                             <input
//                               type="range"
//                               min="0"
//                               max="20"
//                               step="0.5"
//                               value={rectIntensity}
//                               onChange={(e) => setRectIntensity(parseFloat(e.target.value))}
//                               className="mobile-slider"
//                             />
//                             <span className="mobile-slider-value">{rectIntensity.toFixed(1)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Spotlight */}
//                     <div className="mobile-section">
//                       <h3>Main Spotlight</h3>
//                       <div className="mobile-control">
//                         <label>Intensity</label>
//                         <div className="mobile-slider-container">
//                           <input
//                             type="range"
//                             min="0"
//                             max="100"
//                             step="1"
//                             value={spotlightIntensity}
//                             onChange={(e) => setSpotlightIntensity(parseFloat(e.target.value))}
//                             className="mobile-slider"
//                           />
//                           <span className="mobile-slider-value">{spotlightIntensity.toFixed(0)}</span>
//                         </div>
//                       </div>

//                       <div className="mobile-dual-control">
//                         <div className="mobile-control">
//                           <label>Angle</label>
//                           <div className="mobile-slider-container">
//                             <input
//                               type="range"
//                               min="0.1"
//                               max="1.5"
//                               step="0.05"
//                               value={spotlightAngle}
//                               onChange={(e) => setSpotlightAngle(parseFloat(e.target.value))}
//                               className="mobile-slider"
//                             />
//                             <span className="mobile-slider-value">{spotlightAngle.toFixed(2)}</span>
//                           </div>
//                         </div>
//                         <div className="mobile-control">
//                           <label>Distance</label>
//                           <div className="mobile-slider-container">
//                             <input
//                               type="range"
//                               min="5"
//                               max="100"
//                               step="1"
//                               value={spotlightDistance}
//                               onChange={(e) => setSpotlightDistance(parseFloat(e.target.value))}
//                               className="mobile-slider"
//                             />
//                             <span className="mobile-slider-value">{spotlightDistance.toFixed(0)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         <style jsx>{`
//           .mobile-toggle {
//             position: fixed;
//             bottom: 20px;
//             left: 50%;
//             transform: translateX(-50%);
//             z-index: 1000;
//           }

//           .toggle-btn {
//             background: rgba(0, 0, 0, 0.85);
//             backdrop-filter: blur(20px);
//             border: 1px solid rgba(255, 255, 255, 0.2);
//             border-radius: 25px;
//             padding: 12px 20px;
//             color: white;
//             cursor: pointer;
//             transition: all 0.3s ease;
//             display: flex;
//             align-items: center;
//             gap: 8px;
//             font-size: 14px;
//             font-weight: 500;
//           }

//           .toggle-btn:hover {
//             background: rgba(0, 0, 0, 0.9);
//             transform: scale(1.05);
//           }

//           .toggle-icon {
//             font-size: 16px;
//           }

//           .mobile-overlay {
//             position: fixed;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background: rgba(0, 0, 0, 0.8);
//             backdrop-filter: blur(10px);
//             z-index: 1001;
//             display: flex;
//             align-items: flex-end;
//           }

//           .mobile-panel {
//             width: 100%;
//             max-height: 80vh;
//             background: rgba(0, 0, 0, 0.95);
//             border-radius: 20px 20px 0 0;
//             color: white;
//             overflow-y: auto;
//           }

//           .mobile-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 20px;
//             border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//           }

//           .mobile-header h2 {
//             margin: 0;
//             font-size: 20px;
//             font-weight: 600;
//           }

//           .close-btn {
//             background: rgba(255, 255, 255, 0.1);
//             border: none;
//             border-radius: 50%;
//             width: 32px;
//             height: 32px;
//             color: white;
//             cursor: pointer;
//             font-size: 16px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }

//           .mobile-tabs {
//             display: flex;
//             padding: 0 20px;
//             border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//           }

//           .tab-btn {
//             flex: 1;
//             background: none;
//             border: none;
//             padding: 12px;
//             color: rgba(255, 255, 255, 0.7);
//             cursor: pointer;
//             border-bottom: 2px solid transparent;
//             transition: all 0.3s ease;
//           }

//           .tab-btn.active {
//             color: white;
//             border-bottom-color: white;
//           }

//           .mobile-content {
//             padding: 20px;
//             display: flex;
//             flex-direction: column;
//             gap: 24px;
//           }

//           .mobile-section {
//             display: flex;
//             flex-direction: column;
//             gap: 12px;
//           }

//           .mobile-section h3 {
//             margin: 0;
//             font-size: 16px;
//             font-weight: 600;
//             color: rgba(255, 255, 255, 0.9);
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//           }

//           .mobile-texture-grid {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 12px;
//           }

//           .mobile-texture-btn {
//             background: rgba(255, 255, 255, 0.05);
//             border: 1px solid rgba(255, 255, 255, 0.1);
//             border-radius: 12px;
//             padding: 16px;
//             color: rgba(255, 255, 255, 0.8);
//             cursor: pointer;
//             transition: all 0.2s ease;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             gap: 4px;
//           }

//           .mobile-texture-btn:hover,
//           .mobile-texture-btn.active {
//             background: rgba(255, 255, 255, 0.15);
//             border-color: rgba(255, 255, 255, 0.3);
//             color: white;
//           }

//           .texture-number {
//             font-weight: 600;
//             font-size: 18px;
//           }

//           .texture-name {
//             font-size: 12px;
//             opacity: 0.8;
//           }

//           .mobile-control {
//             display: flex;
//             flex-direction: column;
//             gap: 8px;
//           }

//           .mobile-control label {
//             font-size: 12px;
//             font-weight: 500;
//             color: rgba(255, 255, 255, 0.7);
//             text-transform: uppercase;
//             letter-spacing: 0.5px;
//           }

//           .mobile-dual-control {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//             gap: 16px;
//           }

//           .mobile-color-grid {
//             display: grid;
//             grid-template-columns: repeat(4, 1fr);
//             gap: 8px;
//           }

//           .mobile-color-btn {
//             width: 40px;
//             height: 40px;
//             border: 2px solid rgba(255, 255, 255, 0.2);
//             border-radius: 8px;
//             cursor: pointer;
//             transition: all 0.2s ease;
//           }

//           .mobile-color-btn:hover,
//           .mobile-color-btn.active {
//             border-color: white;
//             transform: scale(1.1);
//           }

//           .mobile-color-input {
//             width: 40px;
//             height: 40px;
//             border: 2px solid rgba(255, 255, 255, 0.2);
//             border-radius: 8px;
//             background: none;
//             cursor: pointer;
//           }

//           .mobile-slider-container {
//             display: flex;
//             align-items: center;
//             gap: 8px;
//           }

//           .mobile-slider {
//             flex: 1;
//             height: 6px;
//             background: rgba(255, 255, 255, 0.2);
//             border-radius: 3px;
//             outline: none;
//             cursor: pointer;
//             -webkit-appearance: none;
//             appearance: none;
//           }

//           .mobile-slider::-webkit-slider-thumb {
//             -webkit-appearance: none;
//             appearance: none;
//             width: 20px;
//             height: 20px;
//             background: white;
//             border-radius: 50%;
//             cursor: pointer;
//           }

//           .mobile-slider-value {
//             font-size: 12px;
//             color: rgba(255, 255, 255, 0.8);
//             font-family: monospace;
//             min-width: 40px;
//             text-align: right;
//           }
//         `}</style>
//       </>
//     )
//   }

//   // Desktop UI
//   return (
//     <>
//       <div className="glass-panel">
//         <div className="panel-header">
//           <h2 className="panel-title">
//             {isCollapsed ? 'MT' : 'Modern Table'}
//           </h2>
//           <button 
//             className="collapse-btn"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//           >
//             {isCollapsed ? '←' : '→'}
//           </button>
//         </div>
        
//         {!isCollapsed && (
//           <div className="panel-content">
//             {/* Tab Navigation */}
//             <div className="tab-nav">
//               <button
//                 className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('materials')}
//               >
//                 Materials
//               </button>
//               <button
//                 className={`tab-btn ${activeTab === 'lighting' ? 'active' : ''}`}
//                 onClick={() => setActiveTab('lighting')}
//               >
//                 Lighting
//               </button>
//             </div>

//             {activeTab === 'materials' && (
//               <>
//                 {/* Materials */}
//                 <div className="section">
//                   <h3 className="section-title">Table Material</h3>
//                   <div className="texture-grid">
//                     {[1, 2, 3, 4].map((index) => (
//                       <button
//                         key={index}
//                         className={`texture-btn ${activeTexture === index ? 'active' : ''}`}
//                         onClick={() => handleTextureChange(index)}
//                       >
//                         <span className="texture-number">{index}</span>
//                         <span className="texture-name">{textureNames[index - 1]}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Table Light */}
//                 <div className="section">
//                   <h3 className="section-title">Table Light</h3>
                  
//                   <div className="control">
//                     <label className="control-label">Color</label>
//                     <div className="color-grid">
//                       {presetColors.map((color, index) => (
//                         <button
//                           key={index}
//                           className={`color-btn ${lightColor === color ? 'active' : ''}`}
//                           style={{ backgroundColor: color }}
//                           onClick={() => handleColorChange(color)}
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   <div className="dual-control">
//                     <div className="control">
//                       <label className="control-label">Custom</label>
//                       <input
//                         type="color"
//                         value={lightColor}
//                         onChange={(e) => handleColorChange(e.target.value)}
//                         className="color-input"
//                       />
//                     </div>
//                     <div className="control">
//                       <label className="control-label">Intensity</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="0.5"
//                           max="5"
//                           step="0.1"
//                           value={lightIntensity}
//                           onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{lightIntensity.toFixed(1)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {activeTab === 'lighting' && (
//               <>
//                 {/* Under-Table Lights */}
//                 <div className="section">
//                   <h3 className="section-title">Under-Table Lights</h3>
                  
//                   <div className="control">
//                     <label className="control-label">Warm Colors</label>
//                     <div className="color-grid">
//                       {warmColors.map((color, index) => (
//                         <button
//                           key={index}
//                           className={`color-btn ${rectColor === color ? 'active' : ''}`}
//                           style={{ backgroundColor: color }}
//                           onClick={() => setRectColor(color)}
//                         />
//                       ))}
//                     </div>
//                   </div>

//                   <div className="dual-control">
//                     <div className="control">
//                       <label className="control-label">Custom</label>
//                       <input
//                         type="color"
//                         value={rectColor}
//                         onChange={(e) => setRectColor(e.target.value)}
//                         className="color-input"
//                       />
//                     </div>
//                     <div className="control">
//                       <label className="control-label">Intensity</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="0"
//                           max="20"
//                           step="0.5"
//                           value={rectIntensity}
//                           onChange={(e) => setRectIntensity(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{rectIntensity.toFixed(1)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Spotlight Controls */}
//                 <div className="section">
//                   <h3 className="section-title">Main Spotlight</h3>
                  
//                   <div className="control">
//                     <label className="control-label">Intensity</label>
//                     <div className="slider-container">
//                       <input
//                         type="range"
//                         min="0"
//                         max="100"
//                         step="1"
//                         value={spotlightIntensity}
//                         onChange={(e) => setSpotlightIntensity(parseFloat(e.target.value))}
//                         className="slider"
//                       />
//                       <span className="slider-value">{spotlightIntensity.toFixed(0)}</span>
//                     </div>
//                   </div>

//                   <div className="dual-control">
//                     <div className="control">
//                       <label className="control-label">Angle</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="0.1"
//                           max="1.5"
//                           step="0.05"
//                           value={spotlightAngle}
//                           onChange={(e) => setSpotlightAngle(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{spotlightAngle.toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <div className="control">
//                       <label className="control-label">Penumbra</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="0"
//                           max="1"
//                           step="0.05"
//                           value={spotlightPenumbra}
//                           onChange={(e) => setSpotlightPenumbra(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{spotlightPenumbra.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="dual-control">
//                     <div className="control">
//                       <label className="control-label">Distance</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="5"
//                           max="100"
//                           step="1"
//                           value={spotlightDistance}
//                           onChange={(e) => setSpotlightDistance(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{spotlightDistance.toFixed(0)}</span>
//                       </div>
//                     </div>
//                     <div className="control">
//                       <label className="control-label">Decay</label>
//                       <div className="slider-container">
//                         <input
//                           type="range"
//                           min="0"
//                           max="5"
//                           step="0.1"
//                           value={spotlightDecay}
//                           onChange={(e) => setSpotlightDecay(parseFloat(e.target.value))}
//                           className="slider"
//                         />
//                         <span className="slider-value">{spotlightDecay.toFixed(1)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Position Controls */}
//                   <div className="control">
//                     <label className="control-label">Position</label>
//                     <div className="position-controls">
//                       <div className="position-axis">
//                         <label>X</label>
//                         <input
//                           type="range"
//                           min="-20"
//                           max="20"
//                           step="0.5"
//                           value={spotlightPosition[0]}
//                           onChange={(e) => setSpotlightPosition([parseFloat(e.target.value), spotlightPosition[1], spotlightPosition[2]])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{spotlightPosition[0]}</span>
//                       </div>
//                       <div className="position-axis">
//                         <label>Y</label>
//                         <input
//                           type="range"
//                           min="5"
//                           max="30"
//                           step="0.5"
//                           value={spotlightPosition[1]}
//                           onChange={(e) => setSpotlightPosition([spotlightPosition[0], parseFloat(e.target.value), spotlightPosition[2]])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{spotlightPosition[1]}</span>
//                       </div>
//                       <div className="position-axis">
//                         <label>Z</label>
//                         <input
//                           type="range"
//                           min="-20"
//                           max="20"
//                           step="0.5"
//                           value={spotlightPosition[2]}
//                           onChange={(e) => setSpotlightPosition([spotlightPosition[0], spotlightPosition[1], parseFloat(e.target.value)])}
//                           className="slider small"
//                         />
//                         <span className="axis-value">{spotlightPosition[2]}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Actions */}
//             <div className="actions">
//               <button
//                 className="action-btn"
//                 onClick={() => {
//                   console.log('Resetting to modern defaults')
//                   setActiveTexture(1)
//                   setLightColor('#ffffff')
//                   setLightIntensity(2)
//                   setRectIntensity(8)
//                   setRectColor('#ff9933')
//                   setSpotlightIntensity(30)
//                   setSpotlightPosition([0, 15, -10])
//                   setSpotlightAngle(0.8)
//                   setSpotlightPenumbra(0.3)
//                   setSpotlightDistance(50)
//                   setSpotlightDecay(1.0)
//                 }}
//               >
//                 Reset
//               </button>
//               <button
//                 className="action-btn primary"
//                 onClick={() => {
//                   const config = { 
//                     activeTexture, 
//                     lightColor, 
//                     lightIntensity,
//                     rectIntensity,
//                     rectColor,
//                     spotlight: {
//                       intensity: spotlightIntensity,
//                       position: spotlightPosition,
//                       angle: spotlightAngle,
//                       penumbra: spotlightPenumbra,
//                       distance: spotlightDistance,
//                       decay: spotlightDecay
//                     }
//                   }
//                   console.log('Modern table configuration saved:', config)
//                 }}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         .glass-panel {
//           position: fixed;
//           top: 16px;
//           right: 16px;
//           width: ${isCollapsed ? '56px' : '320px'};
//           max-height: 90vh;
//           background: rgba(2, 0, 0, 0.85);
//           backdrop-filter: blur(20px);
//           border: 1px solid rgba(0, 0, 0, 0.56);
//           border-radius: 16px;
//           padding: 16px;
//           color: white;
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           z-index: 1000;
//           overflow-y: auto;
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }

//         .glass-panel::-webkit-scrollbar {
//           display: none;
//         }

//         .panel-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: ${isCollapsed ? '0' : '16px'};
//         }

//         .panel-title {
//           margin: 0;
//           font-size: 16px;
//           font-weight: 600;
//           color: white;
//         }

//         .collapse-btn {
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 8px;
//           width: 24px;
//           height: 24px;
//           color: white;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           font-size: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .collapse-btn:hover {
//           background: rgba(255, 255, 255, 0.2);
//           transform: scale(1.1);
//         }

//         .panel-content {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//         }

//         .tab-nav {
//           display: flex;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//           margin-bottom: 8px;
//         }

//         .tab-btn {
//           flex: 1;
//           background: none;
//           border: none;
//           padding: 8px 12px;
//           color: rgba(255, 255, 255, 0.7);
//           cursor: pointer;
//           border-bottom: 2px solid transparent;
//           transition: all 0.3s ease;
//           font-size: 11px;
//           font-weight: 500;
//         }

//         .tab-btn.active {
//           color: white;
//           border-bottom-color: white;
//         }

//         .section {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .section-title {
//           margin: 0;
//           font-size: 12px;
//           font-weight: 600;
//           color: rgba(255, 255, 255, 0.9);
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .texture-grid {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 6px;
//         }

//         .texture-btn {
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 8px;
//           padding: 8px;
//           color: rgba(255, 255, 255, 0.8);
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 2px;
//           font-size: 11px;
//         }

//         .texture-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//           border-color: rgba(255, 255, 255, 0.3);
//         }

//         .texture-btn.active {
//           background: rgba(255, 255, 255, 0.2);
//           border-color: rgba(255, 255, 255, 0.4);
//           color: white;
//         }

//         .texture-number {
//           font-weight: 600;
//           font-size: 12px;
//         }

//         .texture-name {
//           font-size: 9px;
//           opacity: 0.9;
//         }

//         .control {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .control-label {
//           font-size: 10px;
//           font-weight: 500;
//           color: rgba(255, 255, 255, 0.7);
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .color-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 4px;
//         }

//         .color-btn {
//           width: 24px;
//           height: 24px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 6px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .color-btn:hover {
//           transform: scale(1.1);
//           border-color: rgba(255, 255, 255, 0.4);
//         }

//         .color-btn.active {
//           border-width: 2px;
//           border-color: white;
//           transform: scale(1.05);
//         }

//         .dual-control {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 12px;
//           align-items: end;
//         }

//         .color-input {
//           width: 32px;
//           height: 32px;
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 6px;
//           background: none;
//           cursor: pointer;
//         }

//         .slider-container {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .slider {
//           flex: 1;
//           height: 4px;
//           background: rgba(255, 255, 255, 0.2);
//           border-radius: 2px;
//           outline: none;
//           cursor: pointer;
//           -webkit-appearance: none;
//           appearance: none;
//         }

//         .slider.small {
//           height: 3px;
//         }

//         .slider::-webkit-slider-thumb {
//           -webkit-appearance: none;
//           appearance: none;
//           width: 16px;
//           height: 16px;
//           background: white;
//           border-radius: 50%;
//           cursor: pointer;
//         }

//         .slider.small::-webkit-slider-thumb {
//           width: 12px;
//           height: 12px;
//         }

//         .slider::-moz-range-thumb {
//           width: 16px;
//           height: 16px;
//           background: white;
//           border-radius: 50%;
//           cursor: pointer;
//           border: none;
//         }

//         .slider-value {
//           font-size: 10px;
//           color: rgba(255, 255, 255, 0.8);
//           font-family: monospace;
//           min-width: 32px;
//           text-align: right;
//         }

//         .position-controls {
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }

//         .position-axis {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .position-axis label {
//           min-width: 12px;
//           font-size: 9px;
//           color: rgba(255, 255, 255, 0.6);
//         }

//         .axis-value {
//           font-size: 9px;
//           color: rgba(255, 255, 255, 0.8);
//           font-family: monospace;
//           min-width: 24px;
//           text-align: right;
//         }

//         .actions {
//           display: flex;
//           gap: 6px;
//         }

//         .action-btn {
//           flex: 1;
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           border-radius: 8px;
//           padding: 8px 12px;
//           color: white;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           font-size: 11px;
//           font-weight: 500;
//         }

//         .action-btn:hover {
//           background: rgba(255, 255, 255, 0.15);
//           transform: translateY(-1px);
//         }

//         .action-btn.primary {
//           background: rgba(255, 255, 255, 0.2);
//           border-color: rgba(255, 255, 255, 0.3);
//         }
//       `}</style>
//     </>
//   )
// }

// // Hook to detect mobile devices
// function useIsMobile() {
//   const [isMobile, setIsMobile] = useState(false)

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768)
//     }
    
//     checkMobile()
//     window.addEventListener('resize', checkMobile)
    
//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   return isMobile
// }

// export default function FurnitureConfigurator() {
//   const [activeTexture, setActiveTexture] = useState(1)
//   const [lightColor, setLightColor] = useState('#ffffff')
//   const [lightIntensity, setLightIntensity] = useState(2)
  
//   // Modern lighting states
//   const [rectIntensity, setRectIntensity] = useState(8)
//   const [rectColor, setRectColor] = useState('#ff9933') // Warm orange
  
//   // Spotlight states with large values for experimentation
//   const [spotlightIntensity, setSpotlightIntensity] = useState(30)
//   const [spotlightPosition, setSpotlightPosition] = useState([0, 15, -10])
//   const [spotlightAngle, setSpotlightAngle] = useState(0.8)
//   const [spotlightPenumbra, setSpotlightPenumbra] = useState(0.3)
//   const [spotlightDistance, setSpotlightDistance] = useState(50)
//   const [spotlightDecay, setSpotlightDecay] = useState(1.0)
  
//   const isMobile = useIsMobile()

//   // Dynamic camera settings based on device
//   const cameraPosition = isMobile ? [8, 8, 8] : [5, 5, 5]
//   const cameraFov = isMobile ? 55 : 45

//   return (
//     <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
//       <Canvas
//         camera={{ position: cameraPosition, fov: cameraFov }}
//         shadows
//         gl={{
//           antialias: true,
//           alpha: false,
//           powerPreference: "high-performance",
//           preserveDrawingBuffer: true
//         }}
//         dpr={[1, 2]}
//       >
//         {/* Dark background for modern ambience */}
//         <color attach="background" args={['#050505']} />
        
//         <Suspense fallback={<Loader />}>
//           {/* Reflective Floor */}
//           <ReflectiveFloor />
       
//           <Model
//             activeTexture={activeTexture}
//             lightColor={lightColor}
//             lightIntensity={lightIntensity}
//           />

//           {/* Modern Under-Table Lighting Setup */}
//           <ModernLighting
//             rectIntensity={rectIntensity}
//             rectColor={rectColor}
//             spotlightIntensity={spotlightIntensity}
//             spotlightPosition={spotlightPosition}
//             spotlightAngle={spotlightAngle}
//             spotlightPenumbra={spotlightPenumbra}
//             spotlightDistance={spotlightDistance}
//             spotlightDecay={spotlightDecay}
//           />
          
//           <EffectComposer>
//             {/* <Bloom
//               intensity={2.3}
//               luminanceThreshold={0.8}
//               luminanceSmoothing={20}
//               height={100}
//             /> */}
//           </EffectComposer>
  
//         </Suspense>
        
//         <OrbitControls
//           enablePan={false}
//           enableZoom={true}
//           enableRotate={true}
//           minDistance={isMobile ? 5 : 3}
//           maxDistance={isMobile ? 20 : 15}
//           minPolarAngle={Math.PI / 6}
//           maxPolarAngle={Math.PI / 2}
//           enableDamping={true}
//           dampingFactor={0.05}
//         />
//       </Canvas>
      
//       <UI
//         activeTexture={activeTexture}
//         setActiveTexture={setActiveTexture}
//         lightColor={lightColor}
//         setLightColor={setLightColor}
//         lightIntensity={lightIntensity}
//         setLightIntensity={setLightIntensity}
//         rectIntensity={rectIntensity}
//         setRectIntensity={setRectIntensity}
//         rectColor={rectColor}
//         setRectColor={setRectColor}
//         spotlightIntensity={spotlightIntensity}
//         setSpotlightIntensity={setSpotlightIntensity}
//         spotlightPosition={spotlightPosition}
//         setSpotlightPosition={setSpotlightPosition}
//         spotlightAngle={spotlightAngle}
//         setSpotlightAngle={setSpotlightAngle}
//         spotlightPenumbra={spotlightPenumbra}
//         setSpotlightPenumbra={setSpotlightPenumbra}
//         spotlightDistance={spotlightDistance}
//         setSpotlightDistance={setSpotlightDistance}
//         spotlightDecay={spotlightDecay}
//         setSpotlightDecay={setSpotlightDecay}
//         isMobile={isMobile}
//       />
//     </div>
//   )
// }

// // Preload the model
// useGLTF.preload('/ramses.glb')












import React, { Suspense, useState, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  useProgress,
  Html,
  useGLTF,
  useTexture,
  MeshReflectorMaterial
} from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

// Initialize RectAreaLight uniforms
RectAreaLightUniformsLib.init()

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

// Modern Under-Table Lighting Component with dual spotlights
function ModernLighting({ 
  rectIntensity,
  rectColor,
  spotlight1Intensity,
  spotlight1Position,
  spotlight2Intensity,
  spotlight2Position,
  spotlightAngle,
  spotlightPenumbra
}) {
  const spotlight1Ref = useRef()
  const spotlight2Ref = useRef()
  const rectLight1Ref = useRef()
  const rectLight2Ref = useRef()
  const rectLight3Ref = useRef()
  const rectLight4Ref = useRef()
  
  useEffect(() => {
    console.log('Modern Lighting Setup:', {
      rectLights: {
        intensity: rectIntensity,
        color: rectColor
      },
      spotlight1: {
        intensity: spotlight1Intensity,
        position: spotlight1Position
      },
      spotlight2: {
        intensity: spotlight2Intensity,
        position: spotlight2Position
      }
    })
  }, [rectIntensity, rectColor, spotlight1Intensity, spotlight1Position, spotlight2Intensity, spotlight2Position])

  return (
    <>
      {/* Ambient Light for general illumination */}
      <ambientLight intensity={0.1} color="#1a1a1a" />
      
      {/* Rect Light 1 - Right side (light pointing left towards center) */}
      <rectAreaLight
        ref={rectLight1Ref}
        width={4.6}
        height={0.24}
        intensity={rectIntensity}
        color={rectColor}
        position={[2.367, -1, 0.00]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      
      {/* Rect Light 2 - Left side (light pointing right towards center) */}
      <rectAreaLight
        ref={rectLight2Ref}
        width={4.6}
        height={0.24}
        intensity={rectIntensity}
        color={rectColor}
        position={[-2.367, -1, 0.00]}
        rotation={[0, Math.PI / 2, 0]}
      />
      
      {/* Rect Light 3 - Back (light pointing forward towards center) */}
      <rectAreaLight
        ref={rectLight3Ref}
        width={4.6}
        height={0.24}
        intensity={rectIntensity}
        color={rectColor}
        position={[0.0, -1, 2.385]}
        rotation={[0, Math.PI, 0]}
      />
      
      {/* Rect Light 4 - Front (light pointing backward towards center) */}
      <rectAreaLight
        ref={rectLight4Ref}
        width={4.6}
        height={0.24}
        intensity={rectIntensity}
        color={rectColor}
        position={[0.0, -1, -2.385]}
        rotation={[0, 0, 0]}
      />
      
      {/* Main Spotlight 1 from front */}
      <spotLight
        ref={spotlight1Ref}
        position={spotlight1Position}
        intensity={spotlight1Intensity}
        angle={spotlightAngle}
        penumbra={spotlightPenumbra}
        distance={50}
        decay={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
        target-position={[0, 0, 0]}
      />
      
      {/* Secondary Spotlight 2 from opposite side */}
      <spotLight
        ref={spotlight2Ref}
        position={spotlight2Position}
        intensity={spotlight2Intensity}
        angle={spotlightAngle}
        penumbra={spotlightPenumbra}
        distance={50}
        decay={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
        target-position={[0, 0, 0]}
      />
    </>
  )
}

// Enhanced Reflective Floor Component
function ReflectiveFloor() {
  return (
    <mesh position={[0, -1.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        blur={[400, 200]}
        resolution={2048}
        mixBlur={0.8}
        mixStrength={1.2}
        roughness={0.8}
        depthScale={1.5}
        minDepthThreshold={0.2}
        maxDepthThreshold={1.8}
        color="#0a0a0a"
        metalness={0.9}
        mirror={0.85}
        distortion={0.1}
        distortionScale={0.5}
      />
    </mesh>
  )
}

// Your Model component with lightbase matching rectColor
function Model({ activeTexture, rectColor, lightIntensity, ...props }) {
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

  // Light material with emissive properties matching rectColor
  const lightMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: rectColor,
      emissive: rectColor,
      emissiveIntensity: lightIntensity,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    })
  }, [rectColor, lightIntensity])

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

  // Enhanced breathing animation and light pulsing
  // useFrame((state) => {
  //   if (groupRef.current) {
  //     groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
  //   }
    
  //   if (lightbaseRef.current && lightbaseRef.current.material) {
  //     const pulseFactor = Math.sin(state.clock.elapsedTime * 2) * 0.3
  //     lightbaseRef.current.material.emissiveIntensity = lightIntensity + pulseFactor
      
  //     // Add subtle color shift for warmth
  //     const time = state.clock.elapsedTime * 0.5
  //     const colorShift = Math.sin(time) * 0.1
  //     lightbaseRef.current.material.emissive.setHex(
  //       new THREE.Color(rectColor).offsetHSL(0, 0, colorShift).getHex()
  //     )
  //   }
  // })

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
      
      {/* Lightbase - Light that glows and changes color matching rectColor */}
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

// Enhanced UI Component with updated default values and 2x intensity ranges
function UI({ 
  activeTexture, 
  setActiveTexture, 
  rectIntensity,
  setRectIntensity,
  rectColor,
  setRectColor,
  lightIntensity,
  setLightIntensity,
  spotlight1Intensity,
  setSpotlight1Intensity,
  spotlight1Position,
  setSpotlight1Position,
  spotlight2Intensity,
  setSpotlight2Intensity,
  spotlight2Position,
  setSpotlight2Position,
  spotlightAngle,
  setSpotlightAngle,
  spotlightPenumbra,
  setSpotlightPenumbra,
  isMobile
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('materials')

  const textureNames = ['Wood1', 'Wood2', 'Wood3', 'Wood4']
  
  const warmColors = [
    '#ffb366', '#ff9933', '#ff7f00', '#ff6600',
    '#ff4500', '#ff3300', '#ff6666', '#ff9999'
  ]

  const handleTextureChange = (index) => {
    console.log('Texture changed to:', index)
    setActiveTexture(index)
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
                <h2>Modern Table</h2>
                <button 
                  className="close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="mobile-tabs">
                <button
                  className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
                  onClick={() => setActiveTab('materials')}
                >
                  Materials
                </button>
                <button
                  className={`tab-btn ${activeTab === 'lighting' ? 'active' : ''}`}
                  onClick={() => setActiveTab('lighting')}
                >
                  Lighting
                </button>
              </div>

              <div className="mobile-content">
                {activeTab === 'materials' && (
                  <>
                    {/* Materials */}
                    <div className="mobile-section">
                      <h3>Table Material</h3>
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
                  </>
                )}

                {activeTab === 'lighting' && (
                  <>
                    {/* Under-Table & Model Lights */}
                    <div className="mobile-section">
                      <h3>Under-Table & Model Lights</h3>
                      <div className="mobile-control">
                        <label>Warm Colors</label>
                        <div className="mobile-color-grid">
                          {warmColors.map((color, index) => (
                            <button
                              key={index}
                              className={`mobile-color-btn ${rectColor === color ? 'active' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setRectColor(color)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mobile-dual-control">
                        <div className="mobile-control">
                          <label>Custom</label>
                          <input
                            type="color"
                            value={rectColor}
                            onChange={(e) => setRectColor(e.target.value)}
                            className="mobile-color-input"
                          />
                        </div>
                        <div className="mobile-control">
                          <label>Under-Table</label>
                          <div className="mobile-slider-container">
                            <input
                              type="range"
                              min="0"
                              max="60"
                              step="1"
                              value={rectIntensity}
                              onChange={(e) => setRectIntensity(parseFloat(e.target.value))}
                              className="mobile-slider"
                            />
                            <span className="mobile-slider-value">{rectIntensity.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mobile-control">
                        <label>Model Light</label>
                        <div className="mobile-slider-container">
                          <input
                            type="range"
                            min="1"
                            max="16"
                            step="0.1"
                            value={lightIntensity}
                            onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                            className="mobile-slider"
                          />
                          <span className="mobile-slider-value">{lightIntensity.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Spotlights */}
                    <div className="mobile-section">
                      <h3>Scene Lights</h3>
                      <div className="mobile-dual-control">
                        <div className="mobile-control">
                          <label>Light 1</label>
                          <div className="mobile-slider-container">
                            <input
                              type="range"
                              min="0"
                              max="50"
                              step="1"
                              value={spotlight1Intensity}
                              onChange={(e) => setSpotlight1Intensity(parseFloat(e.target.value))}
                              className="mobile-slider"
                            />
                            <span className="mobile-slider-value">{spotlight1Intensity.toFixed(0)}</span>
                          </div>
                        </div>
                        <div className="mobile-control">
                          <label>Light 2</label>
                          <div className="mobile-slider-container">
                            <input
                              type="range"
                              min="0"
                              max="50"
                              step="1"
                              value={spotlight2Intensity}
                              onChange={(e) => setSpotlight2Intensity(parseFloat(e.target.value))}
                              className="mobile-slider"
                            />
                            <span className="mobile-slider-value">{spotlight2Intensity.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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

          .mobile-tabs {
            display: flex;
            padding: 0 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .tab-btn {
            flex: 1;
            background: none;
            border: none;
            padding: 12px;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: all 0.3s ease;
          }

          .tab-btn.active {
            color: white;
            border-bottom-color: white;
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

  // Desktop UI
  return (
    <>
      <div className="glass-panel">
        <div className="panel-header">
          <h2 className="panel-title">
            {isCollapsed ? 'MT' : 'Modern Table'}
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
            {/* Tab Navigation */}
            <div className="tab-nav">
              <button
                className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
                onClick={() => setActiveTab('materials')}
              >
                Materials
              </button>
              <button
                className={`tab-btn ${activeTab === 'lighting' ? 'active' : ''}`}
                onClick={() => setActiveTab('lighting')}
              >
                Lighting
              </button>
            </div>

            {activeTab === 'materials' && (
              <>
                {/* Materials */}
                <div className="section">
                  <h3 className="section-title">Table Material</h3>
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
              </>
            )}

            {activeTab === 'lighting' && (
              <>
                {/* Under-Table & Model Lights */}
                <div className="section">
                  <h3 className="section-title">Under-Table & Model</h3>
                  
                  <div className="control">
                    <label className="control-label">Warm Colors</label>
                    <div className="color-grid">
                      {warmColors.map((color, index) => (
                        <button
                          key={index}
                          className={`color-btn ${rectColor === color ? 'active' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setRectColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="triple-control">
                    <div className="control">
                      <label className="control-label">Custom</label>
                      <input
                        type="color"
                        value={rectColor}
                        onChange={(e) => setRectColor(e.target.value)}
                        className="color-input"
                      />
                    </div>
                    <div className="control">
                      <label className="control-label">Under-Table</label>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="0"
                          max="60"
                          step="1"
                          value={rectIntensity}
                          onChange={(e) => setRectIntensity(parseFloat(e.target.value))}
                          className="slider"
                        />
                        <span className="slider-value">{rectIntensity.toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="control">
                      <label className="control-label">Model Light</label>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="1"
                          max="16"
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

                {/* Spotlights Controls */}
                <div className="section">
                  <h3 className="section-title">Scene Lights</h3>
                  
                  <div className="dual-control">
                    <div className="control">
                      <label className="control-label">Light 1 Intensity</label>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={spotlight1Intensity}
                          onChange={(e) => setSpotlight1Intensity(parseFloat(e.target.value))}
                          className="slider"
                        />
                        <span className="slider-value">{spotlight1Intensity.toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="control">
                      <label className="control-label">Light 2 Intensity</label>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={spotlight2Intensity}
                          onChange={(e) => setSpotlight2Intensity(parseFloat(e.target.value))}
                          className="slider"
                        />
                        <span className="slider-value">{spotlight2Intensity.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="dual-control">
                    <div className="control">
                      <label className="control-label">Angle</label>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="0.1"
                          max="1.5"
                          step="0.05"
                          value={spotlightAngle}
                          onChange={(e) => setSpotlightAngle(parseFloat(e.target.value))}
                          className="slider"
                        />
                        <span className="slider-value">{spotlightAngle.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="control">
                      <label className="control-label">Penumbra</label>
                      <div className="slider-container">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={spotlightPenumbra}
                          onChange={(e) => setSpotlightPenumbra(parseFloat(e.target.value))}
                          className="slider"
                        />
                        <span className="slider-value">{spotlightPenumbra.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Position Controls for Spotlight 1 */}
                  <div className="control">
                    <label className="control-label">Light 1 Position</label>
                    <div className="position-controls">
                      <div className="position-axis">
                        <label>X</label>
                        <input
                          type="range"
                          min="-30"
                          max="30"
                          step="0.5"
                          value={spotlight1Position[0]}
                          onChange={(e) => setSpotlight1Position([parseFloat(e.target.value), spotlight1Position[1], spotlight1Position[2]])}
                          className="slider small"
                        />
                        <span className="axis-value">{spotlight1Position[0]}</span>
                      </div>
                      <div className="position-axis">
                        <label>Y</label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          step="0.5"
                          value={spotlight1Position[1]}
                          onChange={(e) => setSpotlight1Position([spotlight1Position[0], parseFloat(e.target.value), spotlight1Position[2]])}
                          className="slider small"
                        />
                        <span className="axis-value">{spotlight1Position[1]}</span>
                      </div>
                      <div className="position-axis">
                        <label>Z</label>
                        <input
                          type="range"
                          min="-30"
                          max="30"
                          step="0.5"
                          value={spotlight1Position[2]}
                          onChange={(e) => setSpotlight1Position([spotlight1Position[0], spotlight1Position[1], parseFloat(e.target.value)])}
                          className="slider small"
                        />
                        <span className="axis-value">{spotlight1Position[2]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Position Controls for Spotlight 2 */}
                  <div className="control">
                    <label className="control-label">Light 2 Position</label>
                    <div className="position-controls">
                      <div className="position-axis">
                        <label>X</label>
                        <input
                          type="range"
                          min="-30"
                          max="30"
                          step="0.5"
                          value={spotlight2Position[0]}
                          onChange={(e) => setSpotlight2Position([parseFloat(e.target.value), spotlight2Position[1], spotlight2Position[2]])}
                          className="slider small"
                        />
                        <span className="axis-value">{spotlight2Position[0]}</span>
                      </div>
                      <div className="position-axis">
                        <label>Y</label>
                        <input
                          type="range"
                          min="5"
                          max="30"
                          step="0.5"
                          value={spotlight2Position[1]}
                          onChange={(e) => setSpotlight2Position([spotlight2Position[0], parseFloat(e.target.value), spotlight2Position[2]])}
                          className="slider small"
                        />
                        <span className="axis-value">{spotlight2Position[1]}</span>
                      </div>
                      <div className="position-axis">
                        <label>Z</label>
                        <input
                          type="range"
                          min="-30"
                          max="30"
                          step="0.5"
                          value={spotlight2Position[2]}
                          onChange={(e) => setSpotlight2Position([spotlight2Position[0], spotlight2Position[1], parseFloat(e.target.value)])}
                          className="slider small"
                        />
                        <span className="axis-value">{spotlight2Position[2]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="actions">
              <button
                className="action-btn"
                onClick={() => {
                  console.log('Resetting to optimized defaults')
                  setActiveTexture(1)
                  setRectIntensity(30) // Your optimized value as default (mid-range of 0-60)
                  setRectColor('#ffb366') // Your optimized color as default
                  setLightIntensity(5.9) // Your optimized value as default (mid-range of 1-16)
                  setSpotlight1Intensity(11) // Your optimized value as default
                  setSpotlight1Position([-17, 16.5, -8]) // Your optimized position as default
                  setSpotlight2Intensity(21) // Your optimized value as default
                  setSpotlight2Position([15.5, 16.5, -20]) // Your optimized position as default
                  setSpotlightAngle(1) // Your optimized value as default
                  setSpotlightPenumbra(0.3) // Your optimized value as default
                }}
              >
                Reset
              </button>
              <button
                className="action-btn primary"
                onClick={() => {
                  const config = { 
                    activeTexture, 
                    rectIntensity,
                    rectColor,
                    lightIntensity,
                    spotlight1: {
                      intensity: spotlight1Intensity,
                      position: spotlight1Position
                    },
                    spotlight2: {
                      intensity: spotlight2Intensity,
                      position: spotlight2Position
                    },
                    spotlightAngle,
                    spotlightPenumbra
                  }
                  console.log('Modern table configuration saved:', config)
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
          width: ${isCollapsed ? '56px' : '320px'};
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

        .tab-nav {
          display: flex;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 8px;
        }

        .tab-btn {
          flex: 1;
          background: none;
          border: none;
          padding: 8px 12px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
          font-size: 11px;
          font-weight: 500;
        }

        .tab-btn.active {
          color: white;
          border-bottom-color: white;
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
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          align-items: end;
        }

        .triple-control {
          display: grid;
          grid-template-columns: auto 1fr 1fr;
          gap: 8px;
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

        .slider.small {
          height: 3px;
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

        .slider.small::-webkit-slider-thumb {
          width: 12px;
          height: 12px;
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

        .position-controls {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .position-axis {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .position-axis label {
          min-width: 12px;
          font-size: 9px;
          color: rgba(255, 255, 255, 0.6);
        }

        .axis-value {
          font-size: 9px;
          color: rgba(255, 255, 255, 0.8);
          font-family: monospace;
          min-width: 24px;
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
  
  // Your optimized values as defaults (mid-range of sliders)
  const [rectColor, setRectColor] = useState('#ffb366') // Your optimized color
  const [lightIntensity, setLightIntensity] = useState(5.9) // Your optimized value (mid-range of 1-16)
  const [rectIntensity, setRectIntensity] = useState(30) // Your optimized value (mid-range of 0-60)
  
  // Dual spotlight states with your optimized values
  const [spotlight1Intensity, setSpotlight1Intensity] = useState(11) // Your optimized value
  const [spotlight1Position, setSpotlight1Position] = useState([-17, 16.5, -8]) // Your optimized position
  const [spotlight2Intensity, setSpotlight2Intensity] = useState(21) // Your optimized value
  const [spotlight2Position, setSpotlight2Position] = useState([15.5, 16.5, -20]) // Your optimized position
  const [spotlightAngle, setSpotlightAngle] = useState(1) // Your optimized value
  const [spotlightPenumbra, setSpotlightPenumbra] = useState(0.3) // Your optimized value
  
  const isMobile = useIsMobile()

  // Dynamic camera settings based on device
  const cameraPosition = isMobile ? [8, 8, 8] : [-5, 2.5, 8.5]
  const cameraFov = isMobile ? 85 : 55

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
        {/* Dark background for modern ambience */}
        <color attach="background" args={['#050505']} />
        
        <Suspense fallback={<Loader />}>
          {/* Enhanced Reflective Floor */}
          <ReflectiveFloor />
       
          <Model
            activeTexture={activeTexture}
            rectColor={rectColor} // Pass rectColor instead of lightColor
            lightIntensity={lightIntensity}
          />

          {/* Modern Under-Table Lighting Setup with dual spotlights */}
          <ModernLighting
            rectIntensity={rectIntensity}
            rectColor={rectColor}
            spotlight1Intensity={spotlight1Intensity}
            spotlight1Position={spotlight1Position}
            spotlight2Intensity={spotlight2Intensity}
            spotlight2Position={spotlight2Position}
            spotlightAngle={spotlightAngle}
            spotlightPenumbra={spotlightPenumbra}
          />
          
          <EffectComposer>
            <Bloom
              intensity={6.4}
              luminanceThreshold={1.37}
              luminanceSmoothing={25}
              height={820}
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
        rectIntensity={rectIntensity}
        setRectIntensity={setRectIntensity}
        rectColor={rectColor}
        setRectColor={setRectColor}
        lightIntensity={lightIntensity}
        setLightIntensity={setLightIntensity}
        spotlight1Intensity={spotlight1Intensity}
        setSpotlight1Intensity={setSpotlight1Intensity}
        spotlight1Position={spotlight1Position}
        setSpotlight1Position={setSpotlight1Position}
        spotlight2Intensity={spotlight2Intensity}
        setSpotlight2Intensity={setSpotlight2Intensity}
        spotlight2Position={spotlight2Position}
        setSpotlight2Position={setSpotlight2Position}
        spotlightAngle={spotlightAngle}
        setSpotlightAngle={setSpotlightAngle}
        spotlightPenumbra={spotlightPenumbra}
        setSpotlightPenumbra={setSpotlightPenumbra}
        isMobile={isMobile}
      />
    </div>
  )
}

// Preload the model
useGLTF.preload('/ramses.glb')