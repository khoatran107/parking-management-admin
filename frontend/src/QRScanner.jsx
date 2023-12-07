import React, { useEffect } from 'react';
import Html5Qrcode from 'html5-qrcode';

const QRScanner = () => {
  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode('qr-reader');

    qrCodeScanner.start(
      (decodedText) => {
        console.log('Scanned Data:', decodedText); // Log the scanned data
        // Handle the scanned data as needed
      },
      (errorMessage) => {
        console.error(errorMessage);
        // Handle errors while scanning
      },
      (videoError) => {
        console.error(videoError);
        // Handle video stream errors
      }
    );

    // Cleanup: Stop the scanner when component unmounts
    return () => {
      qrCodeScanner.stop().then(() => {
        console.log('QR Code scanner stopped.');
      }).catch((err) => {
        console.error('Error stopping QR Code scanner:', err);
      });
    };
  }, []);

  return (
    <div id="qr-reader"></div>
  );
};

export default QRScanner;