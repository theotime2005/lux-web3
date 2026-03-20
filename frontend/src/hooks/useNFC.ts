import { useState, useCallback, useEffect } from 'react';

interface NFCData {
  data: {
    tokenId: string;
    nfcHash: string;
    owner: string;
  };
  serialNumber: string;
  hash: string;
  isValid: boolean;
}

export function useNFC() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<NFCData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const startScan = useCallback(async (): Promise<NFCData | null> => {
    if (!isClient) return null;
    
    setIsScanning(true);
    setError(null);

    try {
      if ('NDEFReader' in window) {
        const ndef = new (window as any).NDEFReader();
        
        try {
          await ndef.scan();
          
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Scan timeout'));
            }, 10000);

            ndef.addEventListener('reading', (event: any) => {
              clearTimeout(timeout);
              const serialNumber = event.serialNumber;
              const hash = `0x${Array.from(new TextEncoder().encode(serialNumber))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
                .padStart(64, '0')}`;
              
              const data: NFCData = {
                serialNumber,
                hash,
                isValid: true,
              };
              
              setLastScan(data);
              setIsScanning(false);
              resolve(data);
            });

            ndef.addEventListener('error', (err: any) => {
              clearTimeout(timeout);
              setError(err.message);
              setIsScanning(false);
              reject(err);
            });
          });
        } catch (scanErr) {
          throw new Error(`NFC scan failed: ${scanErr instanceof Error ? scanErr.message : 'Unknown error'}`);
        }
      } else {
        // Simulation mode
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockData: NFCData = {
          data: {
            tokenId: '1268',
            nfcHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef',
            owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
          },
          serialNumber: '04:XX:XX:XX:XX:XX:XX:XX',
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef',
          isValid: true,
        };
        
        setLastScan(mockData);
        setIsScanning(false);
        return mockData;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur NFC inconnue';
      setError(errorMsg);
      setIsScanning(false);
      return null;
    }
  }, [isClient]);

  const stopScan = useCallback(() => {
    setIsScanning(false);
    setError(null);
  }, []);

  return {
    isScanning,
    lastScan,
    error,
    startScan,
    stopScan,
    isSupported: isClient && typeof window !== 'undefined' && 'NDEFReader' in window,
    isClient
  };
}
