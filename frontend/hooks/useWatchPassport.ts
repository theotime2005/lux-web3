import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_CONFIG } from '../config/wagmi';
import { useState, useEffect } from 'react';

export function useWatchPassport() {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Hook pour lire les données du contrat
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

  const useIsResaleLocked = (tokenId: bigint | undefined) => {
    return useReadContract({
      ...CONTRACT_CONFIG,
      functionName: 'isResaleLocked',
      args: tokenId ? [tokenId] : undefined,
      query: {
        enabled: !!tokenId && isConnected,
      },
    });
  };

  // Hook pour écrire (mint, etc.)
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
    useIsResaleLocked,
    mintWatch,
  };
}
