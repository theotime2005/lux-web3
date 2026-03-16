import { useState, useCallback } from 'react';

interface NFCData {
  serialNumber: string;
  hash: string;
  isValid: boolean;
}

export function useNFC() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<NFCData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startScan = useCallback(async (): Promise<NFCData | null> => {
    setIsScanning(true);
    setError(null);

    try {
      if ('NDEFReader' in window) {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();

        return new Promise((resolve) => {
          ndef.addEventListener('reading', (event: any) => {
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
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockData: NFCData = {
          serialNumber: '04:XX:XX:XX:XX:XX:XX',
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
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
  }, []);

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
    isSupported: typeof window !== 'undefined' && 'NDEFReader' in window,
  };
}
