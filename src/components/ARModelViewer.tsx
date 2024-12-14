import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './3d/Scene';
import { ErrorBoundary } from './ErrorBoundary';
import LoadingScreen from './LoadingScreen';
import { useNavigate } from 'react-router-dom';
import { isMobile } from '../utils/deviceDetection';

const ARModelViewer: React.FC = () => {
  const navigate = useNavigate();
  const startTime = Date.now(); // Moved out of state to avoid re-renders
  const [modelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (modelLoaded) {
      const loadTime = Date.now() - startTime;
      const baseDelay = 20000; // 20 seconds base delay
      const mobileDelay = isMobile() ? 10000 : baseDelay; // 30 seconds for mobile
      const totalDelay = Math.max(mobileDelay - loadTime, 10000); // Ensure minimum 10s viewing time

      console.log(`Setting thank you page timer for: ${totalDelay}ms`);
      
      timer = setTimeout(() => {
        navigate('/thank-you');
      }, totalDelay);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [modelLoaded, navigate, startTime]);

  const handleModelLoaded = () => {
    console.log('Model loaded at:', Date.now() - startTime, 'ms');
    // Add a small delay before setting modelLoaded to ensure initialization is complete
    setTimeout(() => {
      setModelLoaded(true);
    }, 0);
  };

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
              fov: 85,
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
            <Scene onLoaded={handleModelLoaded} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default ARModelViewer;