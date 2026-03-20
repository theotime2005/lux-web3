import { useState } from 'react';
import { storageManager, WatchMetadata, PartMetadata, HistoryMetadata, DigitalTwin } from '../utils/storage';

export function useStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Upload watch metadata to IPFS
  const uploadWatchMetadata = async (metadata: WatchMetadata): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      setUploadProgress(25);
      const hash = await storageManager.uploadWatchMetadata(metadata);
      setUploadProgress(100);
      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Upload part metadata to IPFS
  const uploadPartMetadata = async (metadata: PartMetadata): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      setUploadProgress(25);
      const hash = await storageManager.uploadPartMetadata(metadata);
      setUploadProgress(100);
      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Upload history metadata to IPFS
  const uploadHistoryMetadata = async (metadata: HistoryMetadata): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      setUploadProgress(25);
      const hash = await storageManager.uploadHistoryMetadata(metadata);
      setUploadProgress(100);
      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Upload image to IPFS
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      setUploadProgress(25);
      const hash = await storageManager.uploadImage(file);
      setUploadProgress(100);
      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Image upload failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Create digital twin with 3D models
  const createDigitalTwin = async (
    watchId: string,
    metadata: WatchMetadata,
    glbFile?: File,
    usdzFile?: File
  ): Promise<DigitalTwin> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      setUploadProgress(20);
      
      // Upload metadata
      const metadataHash = await storageManager.uploadWatchMetadata(metadata);
      setUploadProgress(40);

      // Upload 3D models if provided
      let model3D = { glb: '', usdz: '' };
      if (glbFile && usdzFile) {
        setUploadProgress(50);
        model3D = await storageManager.upload3DModel(glbFile, usdzFile);
        setUploadProgress(80);
      }

      const digitalTwin: DigitalTwin = {
        watchId,
        model3D,
        metadata: {
          ...metadata,
          image: storageManager.getIPFSUrl(metadataHash)
        },
        createdAt: Date.now(),
        version: '1.0'
      };

      setUploadProgress(90);
      
      // Upload complete digital twin
      const twinHash = await storageManager.uploadWatchMetadata({
        ...metadata,
        digitalTwin: twinHash
      });
      
      setUploadProgress(100);
      return digitalTwin;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Digital twin creation failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Get data from IPFS
  const getFromIPFS = async (hash: string): Promise<any> => {
    try {
      return await storageManager.getFromIPFS(hash);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Retrieval failed';
      setError(errorMsg);
      throw err;
    }
  };

  // Get digital twin
  const getDigitalTwin = async (hash: string): Promise<DigitalTwin> => {
    try {
      return await storageManager.getDigitalTwin(hash);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Digital twin retrieval failed';
      setError(errorMsg);
      throw err;
    }
  };

  // Verify data integrity
  const verifyIntegrity = async (hash: string, expectedData: any): Promise<boolean> => {
    try {
      return await storageManager.verifyIntegrity(hash, expectedData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Integrity verification failed';
      setError(errorMsg);
      return false;
    }
  };

  // Get IPFS URL
  const getIPFSUrl = (hash: string): string => {
    return storageManager.getIPFSUrl(hash);
  };

  // Get Arweave URL
  const getArweaveUrl = (hash: string): string => {
    return storageManager.getArweaveUrl(hash);
  };

  // Create backup
  const createBackup = async (watchId: string, allData: any): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      setUploadProgress(50);
      const hash = await storageManager.createBackup(watchId, allData);
      setUploadProgress(100);
      return hash;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Backup creation failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    isUploading,
    uploadProgress,
    error,
    uploadWatchMetadata,
    uploadPartMetadata,
    uploadHistoryMetadata,
    uploadImage,
    createDigitalTwin,
    getFromIPFS,
    getDigitalTwin,
    verifyIntegrity,
    getIPFSUrl,
    getArweaveUrl,
    createBackup
  };
}
