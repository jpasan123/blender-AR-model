import React from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { Smartphone, Camera } from 'lucide-react';

const QRLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-custom py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center text-white space-y-6 mb-12">
          <h1 className="text-4xl font-bold">AR Model Viewer</h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <Smartphone size={20} />
              <span>Mobile Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Camera size={20} />
              <span>AR Enabled</span>
            </div>
          </div>
        </div>

        <QRCodeGenerator />
        
        <div className="mt-12 bg-white/10 backdrop-blur-sm p-6 rounded-xl text-white">
          <h3 className="text-xl font-semibold mb-6">Direct Access Options:</h3>
          <div className="space-y-4">
            <a 
              href="/viewer"
              className="block w-full bg-white/20 hover:bg-white/30 transition-colors p-4 rounded-lg text-center"
            >
              Open AR Viewer Directly
            </a>
            <p className="text-sm text-white/80 text-center">
              Choose this if you're already on a mobile device
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRLanding;