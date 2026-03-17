const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('WatchParts', function () {
  let watchParts;
  let owner, user1, user2, partner;
  
  const BATCH_SUPPLY = 100;
  const METADATA_URI = 'ipfs://QmParts001';
  const NFC_HASH_1 = ethers.keccak256(ethers.toUtf8Bytes('PART_TAG_001'));
  const NFC_HASH_2 = ethers.keccak256(ethers.toUtf8Bytes('PART_TAG_002'));
  
  beforeEach(async function () {
    [owner, user1, user2, partner] = await ethers.getSigners();
    
    const WatchParts = await ethers.getContractFactory('WatchParts');
    watchParts = await WatchParts.deploy();
    await watchParts.waitForDeployment();
  });

  describe('Batch Management', function () {
    it('Should create a batch of parts', async function () {
      const batchId = await watchParts.createBatch(0, BATCH_SUPPLY, METADATA_URI);
      
      const [partType, totalSupply, minted, metadataURI, createdAt, isActive] = 
        await watchParts.getBatchInfo(1);
      
      expect(partType).to.equal(0);
      expect(totalSupply).to.equal(BATCH_SUPPLY);
      expect(minted).to.equal(0);
      expect(metadataURI).to.equal(METADATA_URI);
      expect(isActive).to.be.true;
    });

    it('Should reject invalid part type', async function () {
      await expect(
        watchParts.createBatch(99, BATCH_SUPPLY, METADATA_URI)
      ).to.be.revertedWithCustomError(watchParts, 'InvalidPartType');
    });

    it('Should reject insufficient batch size', async function () {
      await expect(
        watchParts.createBatch(0, 5, METADATA_URI)
      ).to.be.revertedWithCustomError(watchParts, 'InsufficientBatch');
    });

    it('Should emit BatchCreated event', async function () {
      await expect(watchParts.createBatch(1, BATCH_SUPPLY, METADATA_URI))
        .to.emit(watchParts, 'BatchCreated')
        .withArgs(1, 1, BATCH_SUPPLY, METADATA_URI);
    });
  });

  describe('Part Minting', function () {
    beforeEach(async function () {
      await watchParts.createBatch(0, BATCH_SUPPLY, METADATA_URI);
    });

    it('Should mint a part with NFC', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['MINT_PART', 1, 999, NFC_HASH_1, user1.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await owner.signMessage(ethers.getBytes(messageHash));
      
      await watchParts.connect(user1).mintPart(1, 999, NFC_HASH_1, signature);
      
      expect(await watchParts.balanceOf(user1.address, 1)).to.equal(1);
      expect(await watchParts.getPartByNFC(NFC_HASH_1)).to.equal(1);
      
      const [batchId, serialNumber, watchTokenId, nfcHash, mintedAt, isAuthentic] = 
        await watchParts.getPartInfo(1);
      
      expect(batchId).to.equal(1);
      expect(serialNumber).to.equal(1);
      expect(watchTokenId).to.equal(999);
      expect(nfcHash).to.equal(NFC_HASH_1);
      expect(isAuthentic).to.be.true;
    });

    it('Should reject mint with invalid signature', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['MINT_PART', 1, 999, NFC_HASH_1, user1.address]);
      const messageHash = ethers.keccak256(message);
      const invalidSignature = await user1.signMessage(ethers.getBytes(messageHash));
      
      await expect(
        watchParts.connect(user1).mintPart(1, 999, NFC_HASH_1, invalidSignature)
      ).to.be.revertedWith("Invalid signature");
    });

    it('Should reject duplicate NFC hash', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['MINT_PART', 1, 999, NFC_HASH_1, user1.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await owner.signMessage(ethers.getBytes(messageHash));
      
      await watchParts.connect(user1).mintPart(1, 999, NFC_HASH_1, signature);
      
      await expect(
        watchParts.connect(user2).mintPart(1, 888, NFC_HASH_1, signature)
      ).to.be.reverted;
    });

    it('Should batch mint multiple parts', async function () {
      await watchParts.createBatch(1, BATCH_SUPPLY, METADATA_URI);
      
      const batchIds = [1, 2];
      const watchTokenIds = [999, 888];
      const nfcHashes = [NFC_HASH_1, NFC_HASH_2];
      
      const signatures = [];
      for (let i = 0; i < 2; i++) {
        const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
          ['MINT_PART', batchIds[i], watchTokenIds[i], nfcHashes[i], user1.address]);
        const messageHash = ethers.keccak256(message);
        signatures.push(await owner.signMessage(ethers.getBytes(messageHash)));
      }
      
      await watchParts.connect(user1).batchMintParts(batchIds, watchTokenIds, nfcHashes, signatures);
      
      expect(await watchParts.balanceOf(user1.address, 1)).to.equal(1);
      expect(await watchParts.balanceOf(user1.address, 2)).to.equal(1);
    });
  });

  describe('Part Verification', function () {
    beforeEach(async function () {
      await watchParts.createBatch(0, BATCH_SUPPLY, METADATA_URI);
      
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['MINT_PART', 1, 999, NFC_HASH_1, user1.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await owner.signMessage(ethers.getBytes(messageHash));
      
      await watchParts.connect(user1).mintPart(1, 999, NFC_HASH_1, signature);
    });

    it('Should verify valid part', async function () {
      expect(await watchParts.verifyPart(1, NFC_HASH_1)).to.be.true;
    });

    it('Should reject invalid NFC hash', async function () {
      expect(await watchParts.verifyPart(1, NFC_HASH_2)).to.be.false;
    });

    it('Should get watch parts', async function () {
      const parts = await watchParts.getWatchParts(999);
      expect(parts.length).to.equal(1);
      expect(parts[0]).to.equal(1);
    });
  });

  describe('Emergency Functions', function () {
    beforeEach(async function () {
      await watchParts.createBatch(0, BATCH_SUPPLY, METADATA_URI);
      
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['MINT_PART', 1, 999, NFC_HASH_1, user1.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await owner.signMessage(ethers.getBytes(messageHash));
      
      await watchParts.connect(user1).mintPart(1, 999, NFC_HASH_1, signature);
    });

    it('Should emergency revoke part', async function () {
      await watchParts.emergencyRevokePart(1);
      
      const [,,,,, isAuthentic] = await watchParts.getPartInfo(1);
      expect(isAuthentic).to.be.false;
      
      expect(await watchParts.verifyPart(1, NFC_HASH_1)).to.be.false;
    });

    it('Should set batch status', async function () {
      await watchParts.setBatchStatus(1, false);
      
      const [,,,,, isActive] = await watchParts.getBatchInfo(1);
      expect(isActive).to.be.false;
    });
  });

  describe('Part Types', function () {
    it('Should have default part types', async function () {
      expect(await watchParts.partTypes(0)).to.equal('Bracelet');
      expect(await watchParts.partTypes(1)).to.equal('Cadran');
      expect(await watchParts.partTypes(2)).to.equal('Couronne');
      expect(await watchParts.partTypes(3)).to.equal('Verre');
      expect(await watchParts.partTypes(4)).to.equal('Boitier');
    });

    it('Should add new part type', async function () {
      await watchParts.addPartType(5, 'Aiguilles');
      expect(await watchParts.partTypes(5)).to.equal('Aiguilles');
    });
  });
});
