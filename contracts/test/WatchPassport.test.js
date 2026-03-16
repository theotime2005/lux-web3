const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('WatchPassport', function () {
  let watchPassport;
  let owner, user1, user2, guardian1, guardian2;
  
  const NFC_HASH_1 = ethers.keccak256(ethers.toUtf8Bytes('NFC_TAG_001'));
  const NFC_HASH_2 = ethers.keccak256(ethers.toUtf8Bytes('NFC_TAG_002'));
  const METADATA_URI = 'ipfs://QmWatch001';
  
  beforeEach(async function () {
    [owner, user1, user2, guardian1, guardian2] = await ethers.getSigners();
    
    const WatchPassport = await ethers.getContractFactory('WatchPassport');
    watchPassport = await WatchPassport.deploy('Watch Whispers', 'WWP');
    await watchPassport.waitForDeployment();
  });

  describe('Minting ERC-721', function () {
    it('Should mint a watch with NFC', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      
      expect(await watchPassport.ownerOf(1)).to.equal(user1.address);
      expect(await watchPassport.tokenURI(1)).to.equal(METADATA_URI);
      expect(await watchPassport.isNFCLinked(NFC_HASH_1)).to.be.true;
      expect(await watchPassport.getTokenIdByNFC(NFC_HASH_1)).to.equal(1);
    });

    it('Should revert when minting duplicate NFC', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      
      await expect(
        watchPassport.mintWithNFC(user2.address, NFC_HASH_1, METADATA_URI)
      ).to.be.revertedWithCustomError(watchPassport, 'NFCAlreadyLinked');
    });

    it('Should emit WatchMinted event', async function () {
      await expect(watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI))
        .to.emit(watchPassport, 'WatchMinted')
        .withArgs(1, user1.address, NFC_HASH_1);
    });
  });

  describe('NFC Verification', function () {
    it('Should verify valid NFC', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      
      expect(await watchPassport.verifyNFC(1, NFC_HASH_1)).to.be.true;
    });

    it('Should reject invalid NFC hash', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      
      expect(await watchPassport.verifyNFC(1, NFC_HASH_2)).to.be.false;
    });
  });

  describe('Metadata', function () {
    it('Should update metadata by owner', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      
      const newURI = 'ipfs://QmUpdated';
      await watchPassport.connect(user1).updateMetadata(1, newURI);
      
      expect(await watchPassport.tokenURI(1)).to.equal(newURI);
    });

    it('Should revert when non-owner updates metadata', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      
      await expect(
        watchPassport.connect(user2).updateMetadata(1, 'ipfs://QmUpdated')
      ).to.be.reverted;
    });
  });

  describe('Crisis Card 1: NFC Cloned', function () {
    it('Should lock and unlock with double signature', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      
      // Owner locks the watch
      await watchPassport.emergencyLock(1);
      expect(await watchPassport.isEmergencyLocked(1)).to.be.true;
      
      // User unlocks (double signature simulation)
      await watchPassport.connect(user1).unlockWithDoubleSig(1);
      expect(await watchPassport.isEmergencyLocked(1)).to.be.false;
    });
  });

  describe('Crisis Card 2: Gray Market', function () {
    it('Should lock resale for one year', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      
      await watchPassport.setResaleLock(1, true);
      expect(await watchPassport.isResaleLocked(1)).to.be.true;
      
      // Attempt transfer should fail
      await expect(
        watchPassport.connect(user1).transferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWithCustomError(watchPassport, 'ResaleLocked');
    });

    it('Should allow transfer after lock period', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      await watchPassport.setResaleLock(1, true);
      
      // Fast forward 366 days
      await ethers.provider.send('evm_increaseTime', [366 * 24 * 60 * 60]);
      await ethers.provider.send('evm_mine');
      
      await watchPassport.connect(user1).transferFrom(user1.address, user2.address, 1);
      expect(await watchPassport.ownerOf(1)).to.equal(user2.address);
    });
  });

  describe('Crisis Card 3: Social Recovery', function () {
    it('Should setup guardians', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      
      await watchPassport.connect(user1).setupSocialRecovery(1, [guardian1.address, guardian2.address]);
      
      expect(await watchPassport.getGuardianCount(1)).to.equal(2);
      expect(await watchPassport.isGuardian(1, guardian1.address)).to.be.true;
    });

    it('Should execute recovery with guardian approvals', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      await watchPassport.connect(user1).setupSocialRecovery(1, [guardian1.address, guardian2.address]);
      
      // Both guardians request recovery
      await watchPassport.connect(guardian1).requestRecovery(1);
      await watchPassport.connect(guardian2).requestRecovery(1);
      
      // Execute recovery to new owner
      await watchPassport.executeRecovery(1, user2.address);
      
      expect(await watchPassport.ownerOf(1)).to.equal(user2.address);
    });

    it('Should revert recovery without enough approvals', async function () {
      await watchPassport.mintWithNFC(user1.address, NFC_HASH_1, METADATA_URI);
      await watchPassport.connect(user1).setupSocialRecovery(1, [guardian1.address, guardian2.address]);
      
      // Only one guardian approves
      await watchPassport.connect(guardian1).requestRecovery(1);
      
      await expect(
        watchPassport.executeRecovery(1, user2.address)
      ).to.be.revertedWithCustomError(watchPassport, 'InsufficientGuardianApprovals');
    });
  });

  describe('Account Abstraction', function () {
    it('Should support ERC-4337', async function () {
      expect(await watchPassport.supportsERC4337()).to.be.true;
    });
  });
});
