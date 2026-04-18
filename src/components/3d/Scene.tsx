import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { Vortex } from './Vortex';

class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("WebGL Canvas Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export function Scene({ intensity = 0.5, vortexColor = '#00f0ff' }) {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  const fallbackUI = (
    <div className="absolute inset-0 flex items-center justify-center">
       <div className="w-64 h-64 rounded-full opacity-60" style={{ 
         background: `radial-gradient(circle, ${vortexColor} 0%, transparent 70%)`,
         filter: 'blur(30px)',
         transform: `scale(${0.5 + intensity})`
       }} />
    </div>
  );

  return (
    <div className="absolute inset-0 -z-10 bg-space-navy">
      {webGLSupported ? (
        <CanvasErrorBoundary fallback={fallbackUI}>
          <Canvas gl={{ powerPreference: "default", failIfMajorPerformanceCaveat: false }}>
            <PerspectiveCamera makeDefault position={[0, 4, 8]} fov={60} />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              autoRotate 
              autoRotateSpeed={0.5} 
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
            
            <ambientLight intensity={0.5} />
            
            {/* Futuristic Starry Background */}
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            
            <Vortex intensity={intensity} color={vortexColor} />
            
            {/* Post-processing could be added here for bloom, but keeping it light for now */}
          </Canvas>
        </CanvasErrorBoundary>
      ) : (
        fallbackUI
      )}
      
      {/* HUD overlay elements to give it a cyberpunk feel */}
      <div 
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-20"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0, 210, 255, 0.1) 0%, transparent 60%)' }}
      ></div>
    </div>
  );
}
