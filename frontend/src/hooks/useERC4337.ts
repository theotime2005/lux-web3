import { useState } from 'react';
import { createPublicClient, createWalletClient, http, Chain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createSmartAccountClient } from 'permissionless';
import { pimlicoBundler, pimlicoPaymaster } from 'permissionless/accounts/pimlico';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { sepolia } from 'viem/chains';

// Configuration ERC-4337
const CHAIN = sepolia;
const BUNDLER_URL = 'https://api.pimlico.io/v2/sepolia/rpc';
const PAYMASTER_URL = 'https://api.pimlico.io/v2/sepolia/paymaster';

export interface ERC4337Config {
  chain: Chain;
  bundlerUrl: string;
  paymasterUrl: string;
}

export class ERC4337Manager {
  private publicClient: ReturnType<typeof createPublicClient>;
  private pimlicoClient: ReturnType<typeof createPimlicoClient>;
  private smartAccountClient: any;
  private config: ERC4337Config;

  constructor(config?: Partial<ERC4337Config>) {
    this.config = {
      chain: config?.chain || CHAIN,
      bundlerUrl: config?.bundlerUrl || BUNDLER_URL,
      paymasterUrl: config?.paymasterUrl || PAYMASTER_URL,
    };

    this.publicClient = createPublicClient({
      chain: this.config.chain,
      transport: http(),
    });

    this.pimlicoClient = createPimlicoClient({
      transport: http(this.config.bundlerUrl),
    });
  }

  // Crée un Smart Account avec ERC-4337
  async createSmartAccount(ownerPrivateKey: string) {
    const owner = privateKeyToAccount(ownerPrivateKey as `0x${string}`);

    this.smartAccountClient = createSmartAccountClient({
      account: await pimlicoBundler({
        owner,
        chain: this.config.chain,
        bundlerClient: this.pimlicoClient,
        paymasterClient: pimlicoPaymaster({
          chain: this.config.chain,
          transport: http(this.config.paymasterUrl),
        }),
      }),
      chain: this.config.chain,
      bundlerTransport: http(this.config.bundlerUrl),
    });

    return this.smartAccountClient;
  }

  // Envoie une transaction avec gas sponsorisé
  async sendSponsoredTransaction(to: string, data: string, value?: bigint) {
    if (!this.smartAccountClient) {
      throw new Error('Smart account not initialized');
    }

    try {
      const userOperationHash = await this.smartAccountClient.sendUserOperation({
        calls: [{
          to: to as `0x${string}`,
          data: data as `0x${string}`,
          value: value || 0n,
        }],
        paymaster: true, // Active le sponsorisation du gas
      });

      console.log('User Operation Hash:', userOperationHash);

      // Attendre la confirmation
      const receipt = await this.smartAccountClient.waitForUserOperationReceipt({
        hash: userOperationHash,
      });

      console.log('Transaction Receipt:', receipt);
      return receipt;
    } catch (error) {
      console.error('ERC-4337 Transaction Error:', error);
      throw error;
    }
  }

  // Vérifie si le support ERC-4337 est actif
  async checkERC4337Support(): Promise<boolean> {
    try {
      const userOperation = await this.smartAccountClient?.getUserOperationByHash('0x1234567890abcdef');
      return !!this.smartAccountClient;
    } catch (error) {
      return false;
    }
  }

  // Get le solde du smart account
  async getBalance(): Promise<bigint> {
    if (!this.smartAccountClient) {
      throw new Error('Smart account not initialized');
    }

    return await this.publicClient.getBalance({
      address: this.smartAccountClient.account.address,
    });
  }

  // Get l'adresse du smart account
  getSmartAccountAddress(): string {
    return this.smartAccountClient?.account?.address || '0x0000000000000000000000000000000000000000000';
  }
}

// Hook React pour ERC-4337
export const useERC4337 = () => {
  const [erc4337Manager, setErc4337Manager] = useState<ERC4337Manager | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string>('');

  const createSmartAccount = async (ownerPrivateKey: string) => {
    setIsCreating(true);
    try {
      const manager = new ERC4337Manager();
      await manager.createSmartAccount(ownerPrivateKey);
      
      setErc4337Manager(manager);
      setSmartAccountAddress(manager.getSmartAccountAddress());
      
      return manager;
    } catch (error) {
      console.error('Failed to create smart account:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const sendSponsoredTransaction = async (to: string, data: string, value?: bigint) => {
    if (!erc4337Manager) {
      throw new Error('Smart account not created');
    }

    return await erc4337Manager.sendSponsoredTransaction(to, data, value);
  };

  return {
    erc4337Manager,
    isCreating,
    smartAccountAddress,
    createSmartAccount,
    sendSponsoredTransaction,
  };
};
