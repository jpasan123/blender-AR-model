import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import CameraView from './CameraView';

const ARViewer = () => {
  const [isCameraSupported, setIsCameraSupported] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera API is not supported in this browser');
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');
        setIsCameraSupported(hasCamera);
      } catch (error) {
        console.error('Error checking camera support:', error);
        setIsCameraSupported(false);
        setCameraError('Camera API is not supported in this browser');
      } finally {
        setIsLoading(false);
      }
    };

    checkCameraSupport();
  }, []);

  const requestCameraPermission = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(true);
      setCameraError(null);
    } catch (error) {
      console.error('Camera permission error:', error);
      setCameraError('Camera access denied. Please grant camera permissions and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-custom">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!isCameraSupported) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-custom p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Camera Not Supported</h2>
          <p className="text-gray-600">
            Your device or browser doesn't support camera access. Please try using a different device or browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen relative bg-gradient-custom">
      {!cameraActive ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">
              AR Model Viewer
            </h2>
            
            {cameraError && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg">
                <p className="text-red-600 text-sm">{cameraError}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={requestCameraPermission}
                disabled={isLoading}
                className="w-full bg-primary text-white px-6 py-4 rounded-xl shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-5 h-5" />
                <span>{isLoading ? 'Initializing...' : 'Enable Camera'}</span>
              </button>

              {cameraError && (
                <button
                  onClick={() => {
                    setCameraError(null);
                    requestCameraPermission();
                  }}
                  disabled={isLoading}
                  className="w-full border border-primary/20 text-primary px-6 py-4 rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>

            <p className="mt-6 text-sm text-gray-600 text-center">
              Camera access is required to use the AR viewer
            </p>
          </div>
        </div>
      ) : (
        <CameraView 
          onError={(error) => {
            setCameraError(error);
            setCameraActive(false);
          }}
        />
      )}
    </div>
  );
};

export default ARViewer;