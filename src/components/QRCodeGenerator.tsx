import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Share2, Download } from 'lucide-react';

const QRCodeGenerator = () => {
  const [qrUrl, setQrUrl] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const baseUrl = window.location.origin;
    setQrUrl(`${baseUrl}/viewer`);
  }, []);

  const downloadQRCode = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ar-viewer-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AR Model Viewer',
          text: 'Check out this AR Model Viewer!',
          url: qrUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        setShowShareMenu(true);
      }
    } else {
      setShowShareMenu(true);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-primary">Scan to View in AR</h2>
          <p className="text-sm text-gray-600">Use your mobile device to experience the AR model</p>
        </div>

        <div id="qr-code" className="bg-white p-4 rounded-lg shadow-inner mx-auto w-fit">
          <QRCode
            value={qrUrl}
            size={256}
            level="H"
            includeMargin={true}
            className="rounded-lg"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={downloadQRCode}
            className="flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Download size={20} />
            <span>Download</span>
          </button>
          <button
            onClick={shareQRCode}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {showShareMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareMenu(false)}>
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Share AR Viewer</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={qrUrl}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(qrUrl);
                  setShowShareMenu(false);
                }}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;