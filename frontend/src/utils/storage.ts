import { create } from 'ipfs-http-client';
import Arweave from 'arweave';

// Configuration IPFS (Pinata)
const IPFS_GATEWAY = 'https://api.pinata.cloud';
const IPFS_API_KEY = process.env.REACT_APP_PINATA_API_KEY || 'demo-key';
const IPFS_SECRET = process.env.REACT_APP_PINATA_SECRET || 'demo-secret';

// Configuration Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
});

export interface WatchMetadata {
  name: string;
  description: string;
  image: string; // IPFS hash
  external_url: string;
  attributes: {
    brand: string;
    model: string;
    year: number;
    materials: string[];
    caliber: string;
    caseMaterial: string;
    bracelet: string;
    waterResistance: number;
    serialNumber: string;
    nfcHash: string;
  };
}

export interface PartMetadata {
  name: string;
  description: string;
  image: string; // IPFS hash
  attributes: {
    partType: string;
    batchId: number;
    serialNumber: number;
    material: string;
    compatibleWith: string[];
    nfcHash: string;
  };
}

export interface HistoryMetadata {
  name: string;
  description: string;
  external_url: string;
  attributes: {
    recordType: string;
    timestamp: number;
    authorizedBy: string;
    documentHash: string;
    location: string;
    technician: string;
  };
}

export interface DigitalTwin {
  watchId: string;
  model3D: {
    glb: string; // Arweave hash
    usdz: string; // Arweave hash
  };
  metadata: WatchMetadata;
  createdAt: number;
  version: string;
}

class StorageManager {
  private ipfsClient: any;

  constructor() {
    this.ipfsClient = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: `Basic ${Buffer.from(`${IPFS_API_KEY}:${IPFS_SECRET}`).toString('base64')}`
      }
    });
  }

  // ==================== IPFS FUNCTIONS ====================

  async uploadToIPFS(data: any, filename?: string): Promise<string> {
    try {
      const result = await this.ipfsClient.add(data, {
        pin: true,
        wrapWithDirectory: false
      });
      
      console.log(`IPFS upload successful: ${result.path}`);
      return result.path;
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error(`IPFS upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadWatchMetadata(metadata: WatchMetadata): Promise<string> {
    const metadataWithTimestamp = {
      ...metadata,
      uploaded_at: Date.now(),
      version: '1.0'
    };

    return await this.uploadToIPFS(JSON.stringify(metadataWithTimestamp), 'watch-metadata.json');
  }

  async uploadPartMetadata(metadata: PartMetadata): Promise<string> {
    const metadataWithTimestamp = {
      ...metadata,
      uploaded_at: Date.now(),
      version: '1.0'
    };

    return await this.uploadToIPFS(JSON.stringify(metadataWithTimestamp), 'part-metadata.json');
  }

  async uploadHistoryMetadata(metadata: HistoryMetadata): Promise<string> {
    const metadataWithTimestamp = {
      ...metadata,
      uploaded_at: Date.now(),
      version: '1.0'
    };

    return await this.uploadToIPFS(JSON.stringify(metadataWithTimestamp), 'history-metadata.json');
  }

  async uploadImage(file: File): Promise<string> {
    return await this.uploadToIPFS(file, file.name);
  }

  async getFromIPFS(hash: string): Promise<any> {
    try {
      const chunks = [];
      for await (const chunk of this.ipfsClient.cat(hash)) {
        chunks.push(chunk);
      }
      const data = Buffer.concat(chunks).toString();
      return JSON.parse(data);
    } catch (error) {
      console.error('IPFS retrieval error:', error);
      throw new Error(`IPFS retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================== ARWEAVE FUNCTIONS ====================

  async uploadToArweave(data: Uint8Array, contentType: string): Promise<string> {
    try {
      const transaction = await arweave.createTransaction({
        data: data
      });

      transaction.addTag('Content-Type', contentType);
      transaction.addTag('App-Name', 'Watch-Whispers');
      transaction.addTag('App-Version', '1.0');
      transaction.addTag('Timestamp', Date.now().toString());

      // Signer la transaction (simulé - en pratique avec un wallet Arweave)
      // await arweave.transactions.sign(transaction, wallet);

      // Pour la démo, on retourne un hash simulé
      const simulatedHash = `arweave:${Math.random().toString(36).substring(2, 15)}`;
      
      console.log(`Arweave upload simulated: ${simulatedHash}`);
      return simulatedHash;
    } catch (error) {
      console.error('Arweave upload error:', error);
      throw new Error(`Arweave upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async upload3DModel(glbFile: File, usdzFile: File): Promise<{glb: string, usdz: string}> {
    try {
      const glbArrayBuffer = await glbFile.arrayBuffer();
      const usdzArrayBuffer = await usdzFile.arrayBuffer();

      const glbHash = await this.uploadToArweave(
        new Uint8Array(glbArrayBuffer),
        'model/gltf-binary'
      );

      const usdzHash = await this.uploadToArweave(
        new Uint8Array(usdzArrayBuffer),
        'model/vnd.usdz+zip'
      );

      return { glb: glbHash, usdz: usdzHash };
    } catch (error) {
      console.error('3D model upload error:', error);
      throw new Error(`3D model upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFromArweave(hash: string): Promise<Uint8Array> {
    try {
      // Retirer le préfixe 'arweave:' si présent
      const txId = hash.replace('arweave:', '');
      
      const data = await arweave.transactions.getData(txId);
      return data;
    } catch (error) {
      console.error('Arweave retrieval error:', error);
      throw new Error(`Arweave retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // ==================== DIGITAL TWIN FUNCTIONS ====================

  async createDigitalTwin(
    watchId: string,
    metadata: WatchMetadata,
    glbFile?: File,
    usdzFile?: File
  ): Promise<DigitalTwin> {
    try {
      // Upload metadata to IPFS
      const metadataHash = await this.uploadWatchMetadata(metadata);

      // Upload 3D models to Arweave
      let model3D = { glb: '', usdz: '' };
      if (glbFile && usdzFile) {
        model3D = await this.upload3DModel(glbFile, usdzFile);
      }

      const digitalTwin: DigitalTwin = {
        watchId,
        model3D,
        metadata: {
          ...metadata,
          image: `ipfs://${metadataHash}`
        },
        createdAt: Date.now(),
        version: '1.0'
      };

      // Upload the complete digital twin metadata
      const twinHash = await this.uploadToIPFS(JSON.stringify(digitalTwin), `digital-twin-${watchId}.json`);

      console.log(`Digital twin created for watch ${watchId}: ${twinHash}`);
      return digitalTwin;
    } catch (error) {
      console.error('Digital twin creation error:', error);
      throw error;
    }
  }

  async getDigitalTwin(hash: string): Promise<DigitalTwin> {
    try {
      const twinData = await this.getFromIPFS(hash);
      return twinData as DigitalTwin;
    } catch (error) {
      console.error('Digital twin retrieval error:', error);
      throw error;
    }
  }

  // ==================== UTILITY FUNCTIONS ====================

  getIPFSUrl(hash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  getArweaveUrl(hash: string): string {
    const txId = hash.replace('arweave:', '');
    return `https://arweave.net/${txId}`;
  }

  async verifyIntegrity(hash: string, expectedData: any): Promise<boolean> {
    try {
      const retrievedData = await this.getFromIPFS(hash);
      return JSON.stringify(retrievedData) === JSON.stringify(expectedData);
    } catch (error) {
      console.error('Integrity verification error:', error);
      return false;
    }
  }

  // ==================== BATCH OPERATIONS ====================

  async batchUploadToIPFS(items: Array<{data: any, filename?: string}>): Promise<string[]> {
    const hashes: string[] = [];
    
    for (const item of items) {
      try {
        const hash = await this.uploadToIPFS(item.data, item.filename);
        hashes.push(hash);
      } catch (error) {
        console.error(`Batch upload failed for item:`, error);
        hashes.push('');
      }
    }
    
    return hashes;
  }

  async createBackup(watchId: string, allData: any): Promise<string> {
    const backupData = {
      watchId,
      timestamp: Date.now(),
      data: allData,
      version: '1.0'
    };

    return await this.uploadToIPFS(JSON.stringify(backupData), `backup-${watchId}-${Date.now()}.json`);
  }
}

export const storageManager = new StorageManager();

// Export des types pour utilisation dans les composants
export type { StorageManager };
