import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './3d/Scene';
import { ErrorBoundary } from './ErrorBoundary';
import LoadingScreen from './LoadingScreen';

const ARModelViewer: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-auto touch-none select-none">
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Canvas
            style={{ 
              position: 'absolute', 
              top: '55%', 
              left: '55%', 
              right: '50%',
              width: '450%', 
              height: '450%',
              transform: 'translate(-50%, -50%)',
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
            camera={{ 
              position: [0, 0, 9],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            gl={{ 
              antialias: true,
              alpha: true,
              preserveDrawingBuffer: true,
              powerPreference: 'high-performance',
              logarithmicDepthBuffer: true
            }}
            shadows
            dpr={[1, 2]}
            performance={{ min: 0.5 }}
            touch-action="none"
            eventSource={document.documentElement}
            eventPrefix="client"
          >
            <Scene />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default ARModelViewer;