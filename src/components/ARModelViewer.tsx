import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './3d/Scene';
import { ErrorBoundary } from './ErrorBoundary';
import LoadingScreen from './LoadingScreen';
import { useNavigate } from 'react-router-dom';

const ARModelViewer: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to thank you page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/thank-you');
    }, 22000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="absolute inset-0 z-10 pointer-events-auto touch-none select-none">
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Canvas
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%',
              width: '100%', 
              height: '100%',
              transform: 'translate(-50%, -50%)',
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
            camera={{ 
              position: [0, 0, 5],
              fov: 85, // Further increased FOV
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