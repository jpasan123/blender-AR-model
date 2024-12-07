import React, { useEffect, useRef, useState } from 'react';
import ARModelViewer from './ARModelViewer';

interface CameraViewProps {
  onError: (error: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const stopCurrentStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const initializeCamera = async (mode: 'user' | 'environment') => {
    try {
      stopCurrentStream();
      setIsVideoReady(false);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current!.play()
                .then(() => {
                  setIsVideoReady(true);
                  resolve();
                })
                .catch((error) => {
                  console.error('Video play error:', error);
                  onError('Failed to start video stream');
                });
            };
          }
        });
      }
    } catch (error) {
      console.error('Camera access error:', error);
      onError('Failed to access camera. Please ensure camera permissions are granted.');
    } finally {
      setIsInitializing(false);
    }
  };

  const switchCamera = async () => {
    setIsInitializing(true);
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    await initializeCamera(newMode);
  };

  useEffect(() => {
    initializeCamera(facingMode);
    return () => {
      stopCurrentStream();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {isInitializing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        muted
        onContextMenu={(e) => e.preventDefault()}
      />
      {isVideoReady && <ARModelViewer />}
      <button
        onClick={switchCamera}
        disabled={isInitializing}
        className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full shadow-lg z-20 hover:bg-white/100 transition-colors disabled:opacity-50"
        aria-label="Switch camera"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
};

export default CameraView;