import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Nfc, CheckCircle, XCircle } from "lucide-react";

// Simple Components
const Button = ({ children, onClick, disabled, className = "" }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardHeader = ({ children }: any) => (
  <div className="p-6 pb-2">{children}</div>
);

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardDescription = ({ children }: any) => (
  <p className="text-gray-600 text-sm">{children}</p>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 pt-2 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "default", className = "" }: any) => {
  const baseClasses = "px-2 py-1 rounded text-xs font-medium";
  const variantClasses = variant === "destructive" 
    ? "bg-red-100 text-red-800" 
    : "bg-green-100 text-green-800";
  return <span className={`${baseClasses} ${variantClasses} ${className}`}>{children}</span>;
};

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
      className="min-h-screen bg-gray-50 p-8"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Watch Whispers
          </h1>
          <p className="text-gray-600">
            Passeport Numérique de Montre de Luxe
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Nfc className="h-5 w-5" />
              Scan NFC
            </CardTitle>
            <CardDescription>
              Approchez votre téléphone de la montre pour vérifier son authenticité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleScan} 
              disabled={isScanning}
              className="w-full"
            >
              <Smartphone className="mr-2 h-4 w-4" />
              {isScanning ? "Scan en cours..." : "Tap NFC"}
            </Button>
            
            {scanResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {scanResult.success ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <Badge variant="default">
                        Authentifiée
                      </Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      <Badge variant="destructive">
                        Non enregistrée
                      </Badge>
                    </>
                  )}
                </div>
                
                {scanResult.success && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <p><strong>Token ID:</strong> #{scanResult.data.tokenId}</p>
                        <p><strong>NFC Hash:</strong> {scanResult.data.nfcHash.slice(0, 10)}...</p>
                        <p><strong>Propriétaire:</strong> {scanResult.data.owner.slice(0, 6)}...{scanResult.data.owner.slice(-4)}</p>
                        <p><strong>Métadonnées:</strong> {scanResult.data.metadata}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Index;
