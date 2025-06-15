// components/Model.js
import React, { useRef, useMemo, useEffect } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

export function Model({ activeTexture, lightColor, lightIntensity, ...props }) {
  const { nodes, materials } = useGLTF('/ramses.glb')
  const groupRef = useRef()
  const upbaseRef = useRef()
  const lightbaseRef = useRef()
  
  // Load all texture sets
  const textures = useTexture({
    // Texture Set 1
    baseColor1: '/textures/1base.jpg',
    normal1: '/textures/1norm.jpg',
    displacement1: '/textures/1displacement.jpg',
    specular1: '/textures/1specular.jpg',
    ao1: '/textures/1aomap.jpg',
    
    // Texture Set 2
    baseColor2: '/textures/2base.jpg',
    normal2: '/textures/2norm.jpg',
    displacement2: '/textures/2displacement.jpg',
    specular2: '/textures/2specular.jpg',
    ao2: '/textures/2aomap.jpg',
    
    // Texture Set 3
    baseColor3: '/textures/3base.jpg',
    normal3: '/textures/3norm.jpg',
    displacement3: '/textures/3displacement.jpg',
    specular3: '/textures/3specular.jpg',
    ao3: '/textures/3aomap.jpg',
    
    // Texture Set 4
    baseColor4: '/textures/4base.jpg',
    normal4: '/textures/4norm.jpg',
    displacement4: '/textures/4displacement.jpg',
    specular4: '/textures/4specular.jpg',
    ao4: '/textures/4aomap.jpg',
  })

  // Configure textures for better quality
  Object.values(textures).forEach(texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(0.5, 0.5)
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
        displacementMap: textures[`displacement${i}`],
        displacementScale: 0.1,
        roughnessMap: textures[`specular${i}`],
        aoMap: textures[`ao${i}`],
        aoMapIntensity: 1,
        roughness: 0.8,
        metalness: 0.1,
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

  // Animate texture transitions with GSAP
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

useGLTF.preload('/ramses.glb')