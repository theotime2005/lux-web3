import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Nfc, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function NfcScanScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate NFC scan
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
      className="max-w-2xl mx-auto space-y-6"
    >
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
            size="lg"
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
                    <Badge variant="default" className="bg-green-500">
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
    </motion.div>
  );
}
