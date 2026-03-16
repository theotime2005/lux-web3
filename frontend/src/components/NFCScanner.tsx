import { useNFC } from '@/hooks/useNFC';
import { useWatchPassport } from '@/hooks/useWatchPassport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';

export function NFCScanner() {
  const { isScanning, lastScan, error, startScan, isSupported } = useNFC();
  const { isConnected, useGetTokenByNFC } = useWatchPassport();

  const { data: tokenId, isLoading: isChecking } = useGetTokenByNFC(lastScan?.hash);

  const handleScan = async () => {
    await startScan();
  };

  const isVerified = tokenId && tokenId > 0n;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Vérifier votre montre
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupported && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            Mode simulation NFC (Web NFC non disponible)
          </div>
        )}

        <Button 
          onClick={handleScan} 
          disabled={isScanning || isChecking}
          className="w-full"
          size="lg"
        >
          {isScanning || isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scan en cours...
            </>
          ) : (
            'Tap NFC'
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {lastScan && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Numéro de série</span>
              <span className="font-mono text-sm">{lastScan.serialNumber}</span>
            </div>
            
            {isVerified ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Authentifiée</p>
                  <p className="text-sm">Certificat #{tokenId.toString()}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Non enregistrée</p>
                  <p className="text-sm">Cette montre n'est pas encore associée</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
