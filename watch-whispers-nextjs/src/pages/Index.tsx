import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Nfc, CheckCircle, XCircle } from "lucide-react";

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResult({
        success: true,
        data: {
          tokenId: 1,
          nfcHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          metadata: "ipfs://QmTestWatch001"
        }
      });
      setIsScanning(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen fade-up"
    >
      <div className="container">
        <div className="nfc-scanner">
          <h1>Watch Whispers</h1>
          <p>Passeport Numérique de Montre de Luxe</p>
          
          <div className="card">
            <div className="card-header">
              <div className="nfc-icon">
                <Nfc size={32} color="var(--obsidian)" />
              </div>
              <h2 className="card-title">Scan NFC</h2>
              <p className="card-description">
                Approchez votre téléphone de la montre pour vérifier son authenticité
              </p>
            </div>
            
            <div className="card-content">
              <button 
                onClick={handleScan} 
                disabled={isScanning}
                className="btn btn-primary btn-full scan-button"
              >
                <Smartphone size={20} />
                {isScanning ? "Scan en cours..." : "Tap NFC"}
              </button>
              
              {scanResult && (
                <div className="result-section">
                  <div className="result-badge badge-success">
                    <CheckCircle size={16} />
                    Authentifiée
                  </div>
                  
                  <div className="result-details">
                    <p>
                      <strong>Token ID:</strong>
                      <span>#{scanResult.data.tokenId}</span>
                    </p>
                    <p>
                      <strong>NFC Hash:</strong>
                      <span>{scanResult.data.nfcHash.slice(0, 10)}...</span>
                    </p>
                    <p>
                      <strong>Propriétaire:</strong>
                      <span>{scanResult.data.owner.slice(0, 6)}...{scanResult.data.owner.slice(-4)}</span>
                    </p>
                    <p>
                      <strong>Métadonnées:</strong>
                      <span>{scanResult.data.metadata}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Index;
