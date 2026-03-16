import React from 'react';
import { useNFC } from '../hooks/useNFC';
import { useWatchPassport } from '../hooks/useWatchPassport';

export const NFCScanner: React.FC = () => {
  const { isScanning, lastScan, error, startScan, isSupported } = useNFC();
  const { isConnected, useGetTokenByNFC } = useWatchPassport();

  const { data: tokenId } = useGetTokenByNFC(lastScan?.hash);

  const handleScan = async () => {
    await startScan();
  };

  return (
    <div className="nfc-scanner">
      <h2>Vérifier votre montre</h2>
      
      {!isSupported && (
        <div className="warning">
          Mode simulation NFC activé (Web NFC non disponible sur ce navigateur)
        </div>
      )}

      <button 
        onClick={handleScan} 
        disabled={isScanning}
        className="scan-button"
      >
        {isScanning ? 'Scan en cours...' : 'Tap NFC'}
      </button>

      {error && <div className="error">{error}</div>}

      {lastScan && (
        <div className="scan-result">
          <h3>Montre détectée</h3>
          <p>Numéro de série: {lastScan.serialNumber}</p>
          
          {tokenId && tokenId > 0n ? (
            <div className="verified">
              <span className="badge">✓ Authentifiée</span>
              <p>Certificat #{tokenId.toString()}</p>
              <p>Propriétaire: {isConnected ? 'Connecté' : 'Non connecté'}</p>
            </div>
          ) : (
            <div className="not-found">
              <span className="badge-warning">⚠ Non enregistrée</span>
              <p>Cette montre n'est pas encore associée à un passeport numérique.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
