import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Vortex({ intensity = 0.5, color = '#00f0ff' }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const count = 5000;
  
  const [positions, scales] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Golden spiral / vortex distribution
      const r = Math.pow(Math.random(), 1.5) * 5;
      const theta = r * 5 + Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.5 * (1 - r/5); // Tapering
      
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(theta);
      
      scales[i] = Math.random();
    }
    return [positions, scales];
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [positions, scales]);

  // Adjust visualization based on intensity
  // high intensity = faster, darker/redder
  // low intensity = slower, cyan/green
  
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.05,
      color: baseColor,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [baseColor]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Rotate the whole vortex based on intensity
    pointsRef.current.rotation.y = time * (0.2 + intensity * 1.5);
    
    // Pulsate scales slightly
    const scaleAttr = geometry.attributes.scale as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const originalScale = scales[i];
      scaleAttr.setX(i, originalScale * (1 + Math.sin(time * 3 + i) * 0.2));
    }
    scaleAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
