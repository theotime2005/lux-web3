import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '@/config/wagmi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useWatchPassport() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const useVerifyNFC = (tokenId: bigint | undefined, nfcHash: string | undefined) => {
    return useReadContract({
      ...CONTRACT_CONFIG,
      functionName: 'verifyNFC',
      args: tokenId && nfcHash ? [tokenId, nfcHash as `0x${string}`] : undefined,
      query: {
        enabled: !!tokenId && !!nfcHash && isConnected,
      },
    });
  };

  const useGetTokenByNFC = (nfcHash: string | undefined) => {
    return useReadContract({
      ...CONTRACT_CONFIG,
      functionName: 'getTokenIdByNFC',
      args: nfcHash ? [nfcHash as `0x${string}`] : undefined,
      query: {
        enabled: !!nfcHash && isConnected,
      },
    });
  };

  const useTokenURI = (tokenId: bigint | undefined) => {
    return useReadContract({
      ...CONTRACT_CONFIG,
      functionName: 'tokenURI',
      args: tokenId ? [tokenId] : undefined,
      query: {
        enabled: !!tokenId && isConnected,
      },
    });
  };

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintWatch = async (nfcHash: string, metadataURI: string) => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      writeContract({
        ...CONTRACT_CONFIG,
        functionName: 'mintWithNFC',
        args: [address, nfcHash as `0x${string}`, metadataURI],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyWatch = async (tokenId: string, nfcHash: string) => {
    if (!isClient || !isConnected) {
      throw new Error('Wallet non connecté');
    }

    setIsLoading(true);
    try {
      // Simulation pour la démo - en pratique utiliserait le contrat réel
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler une vérification réussie
      const isValid = true; // Toujours true pour la démo
      
      if (isValid) {
        toast.success('Montre authentifiée avec succès!');
        return true;
      } else {
        toast.error('Montre non authentifiée');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la vérification';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    address,
    isConnected,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    transactionHash: hash,
    error,
    useVerifyNFC,
    useGetTokenByNFC,
    useTokenURI,
    mintWatch,
    verifyWatch,
    isClient
  };
}
