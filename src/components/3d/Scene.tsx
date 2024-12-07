import React from 'react';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { ModelLoader } from './ModelLoader';
import { isMobile } from '../../utils/deviceDetection';

export const Scene = () => {
  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[0, 0, isMobile() ? 8 : 6]} // Adjusted camera distance
        fov={isMobile() ? 65 : 60} // Adjusted field of view
        near={0.1}
        far={1000}
      />
      
      <ModelLoader />
      
      <Environment preset="sunset" />
      
      <ambientLight intensity={1.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={2} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={1}
      />
      <directionalLight 
        position={[0, -5, 0]} 
        intensity={0.5}
      />
      
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        minDistance={isMobile() ? 3 : 2} // Adjusted min distance
        maxDistance={isMobile() ? 15 : 12} // Adjusted max distance
        enablePan={false}
        autoRotate={false}
        rotateSpeed={isMobile() ? 0.5 : 1}
        target={[0, 0, 0]} // Centered target
        makeDefault
      />
    </>
  );
};