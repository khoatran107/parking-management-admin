// QRCodeScanner.jsx

import React, { useState, useEffect } from 'react';
import {QrReader} from 'react-qr-reader';
import PropTypes from 'prop-types';

const QRCodeScanner = ({ onScan }) => {
  const [scannedResult, setScannedResult] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isPaused) {
      // Reset isPaused after a delay (e.g., 3000 milliseconds)
      timeoutId = setTimeout(() => {
        setIsPaused(false);
      }, 3000);
    }

    // Cleanup the timeout to prevent memory leaks
    return () => clearTimeout(timeoutId);
  }, [isPaused]);


  const handleScan = (data) => {
    if (isPaused) return;
    if (data) {
      setScannedResult(data.text);
      if (onScan) {
        onScan(data.text);
      }
      setIsPaused(true);
    }
  };

  

  const handleError = (err) => {
    console.error('QR Code Scanner Error:', err);
  };

  return (
      <QrReader
        scanDelay={1000}
        onResult={handleScan}
        style={{ width: '100%', marginTop: '-100%', marginBottom: 0, paddingTop: 0, paddingBottom: '-100%' }}
      />
  );
};


QrReader.propTypes = {
  onResult: PropTypes.func.isRequired,
};

export default QRCodeScanner;
