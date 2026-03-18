const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('WatchHistory', function () {
  let watchHistory;
  let owner, serviceCenter, certifier, user1, user2;
  
  const WATCH_TOKEN_ID = 1;
  const METADATA_URI = 'ipfs://QmHistory001';
  const DOCUMENT_HASH = ethers.keccak256(ethers.toUtf8Bytes('DOC_001'));
  
  beforeEach(async function () {
    [owner, serviceCenter, certifier, user1, user2] = await ethers.getSigners();
    
    const WatchHistory = await ethers.getContractFactory('WatchHistory');
    watchHistory = await WatchHistory.deploy();
    await watchHistory.waitForDeployment();
    
    // Autoriser les entités
    await watchHistory.addAuthorizedEntity(serviceCenter.address);
    await watchHistory.addAuthorizedEntity(certifier.address);
  });

  describe('Soulbound Token Properties', function () {
    it('Should prevent transfers', async function () {
      await expect(
        watchHistory.transferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWith("Soulbound: transfer not allowed");
    });

    it('Should prevent safe transfers', async function () {
      await expect(
        watchHistory.safeTransferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWith("Soulbound: transfer not allowed");
    });

    it('Should prevent approvals', async function () {
      await expect(
        watchHistory.approve(user2.address, 1)
      ).to.be.revertedWith("Soulbound: approval not allowed");
    });
  });

  describe('Record Creation', function () {
    it('Should create a service record', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['CREATE_RECORD', WATCH_TOKEN_ID, 0, DOCUMENT_HASH, serviceCenter.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await user1.signMessage(ethers.getBytes(messageHash));
      
      const recordId = await watchHistory.connect(serviceCenter).createHistoryRecord(
        WATCH_TOKEN_ID,
        0, // SERVICE
        METADATA_URI,
        DOCUMENT_HASH,
        signature
      );
      
      expect(await watchHistory.ownerOf(1)).to.equal(owner.address);
      
      const [watchTokenId, recordType, metadataURI, timestamp, authorizedBy, documentHash, isValid] = 
        await watchHistory.getRecordInfo(1);
      
      expect(watchTokenId).to.equal(WATCH_TOKEN_ID);
      expect(recordType).to.equal(0);
      expect(metadataURI).to.equal(METADATA_URI);
      expect(authorizedBy).to.equal(serviceCenter.address);
      expect(documentHash).to.equal(DOCUMENT_HASH);
      expect(isValid).to.be.true;
    });

    it('Should reject unauthorized entity', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['CREATE_RECORD', WATCH_TOKEN_ID, 0, DOCUMENT_HASH, user2.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await user1.signMessage(ethers.getBytes(messageHash));
      
      await expect(
        watchHistory.connect(user2).createHistoryRecord(
          WATCH_TOKEN_ID,
          0,
          METADATA_URI,
          DOCUMENT_HASH,
          signature
        )
      ).to.be.revertedWithCustomError(watchHistory, 'UnauthorizedAccess');
    });

    it('Should emit RecordCreated event', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['CREATE_RECORD', WATCH_TOKEN_ID, 1, DOCUMENT_HASH, certifier.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await user1.signMessage(ethers.getBytes(messageHash));
      
      await expect(watchHistory.connect(certifier).createHistoryRecord(
        WATCH_TOKEN_ID,
        1, // CERTIFICATION
        METADATA_URI,
        DOCUMENT_HASH,
        signature
      ))
        .to.emit(watchHistory, 'RecordCreated')
        .withArgs(1, WATCH_TOKEN_ID, 1, METADATA_URI, certifier.address);
    });

    it('Should track record counts', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['CREATE_RECORD', WATCH_TOKEN_ID, 0, DOCUMENT_HASH, serviceCenter.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await user1.signMessage(ethers.getBytes(messageHash));
      
      await watchHistory.connect(serviceCenter).createHistoryRecord(
        WATCH_TOKEN_ID,
        0, // SERVICE
        METADATA_URI,
        DOCUMENT_HASH,
        signature
      );
      
      expect(await watchHistory.getRecordCount(WATCH_TOKEN_ID, 0)).to.equal(1); // SERVICE
      expect(await watchHistory.getRecordCount(WATCH_TOKEN_ID, 1)).to.equal(0); // CERTIFICATION
    });
  });

  describe('VIP Status Management', function () {
    it('Should set VIP status', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'uint256', 'address'], 
        ['SET_VIP', WATCH_TOKEN_ID, 2, 365, serviceCenter.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await user1.signMessage(ethers.getBytes(messageHash));
      
      await watchHistory.connect(serviceCenter).setVIPStatus(
        WATCH_TOKEN_ID,
        2, // GOLD
        365 * 24 * 60 * 60, // 1 year
        METADATA_URI,
        signature
      );
      
      const [level, since, expiresAt, benefitsURI, isActive] = 
        await watchHistory.getVIPStatus(WATCH_TOKEN_ID);
      
      expect(level).to.equal(2);
      expect(isActive).to.be.true;
      expect(expiresAt).to.be.gt(0);
      expect(benefitsURI).to.equal(METADATA_URI);
    });

    it('Should emit VIPStatusChanged event', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'uint256', 'address'], 
        ['SET_VIP', WATCH_TOKEN_ID, 3, 0, serviceCenter.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await user1.signMessage(ethers.getBytes(messageHash));
      
      await expect(watchHistory.connect(serviceCenter).setVIPStatus(
        WATCH_TOKEN_ID,
        3, // PLATINUM
        0, // Permanent
        METADATA_URI,
        signature
      ))
        .to.emit(watchHistory, 'VIPStatusChanged')
        .withArgs(WATCH_TOKEN_ID, 0, 3, 0);
    });

    it('Should check VIP active status', async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'uint256', 'address'], 
        ['SET_VIP', WATCH_TOKEN_ID, 1, 1, serviceCenter.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await user1.signMessage(ethers.getBytes(messageHash));
      
      await watchHistory.connect(serviceCenter).setVIPStatus(
        WATCH_TOKEN_ID,
        1, // SILVER
        1, // 1 second
        METADATA_URI,
        signature
      );
      
      expect(await watchHistory.isVIPActive(WATCH_TOKEN_ID)).to.be.true;
      
      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check again (should be expired)
      // Note: This would need time manipulation in tests
    });
  });

  describe('Record Management', function () {
    beforeEach(async function () {
      const message = ethers.solidityPacked(['string', 'uint256', 'uint256', 'bytes32', 'address'], 
        ['CREATE_RECORD', WATCH_TOKEN_ID, 0, DOCUMENT_HASH, serviceCenter.address]);
      const messageHash = ethers.keccak256(message);
      const signature = await user1.signMessage(ethers.getBytes(messageHash));
      
      await watchHistory.connect(serviceCenter).createHistoryRecord(
        WATCH_TOKEN_ID,
        0,
        METADATA_URI,
        DOCUMENT_HASH,
        signature
      );
    });

    it('Should revoke record', async function () {
      await watchHistory.revokeRecord(1, ethers.keccak256(ethers.toUtf8Bytes('Test revoke')));
      
      expect(await watchHistory.isValidRecord(1)).to.be.false;
    });

    it('Should emit RecordRevoked event', async function () {
      await expect(watchHistory.revokeRecord(1, ethers.keccak256(ethers.toUtf8Bytes('Test revoke'))))
        .to.emit(watchHistory, 'RecordRevoked')
        .withArgs(1, owner.address);
    });

    it('Should get watch records', async function () {
      const records = await watchHistory.getWatchRecords(WATCH_TOKEN_ID);
      expect(records.length).to.equal(1);
      expect(records[0]).to.equal(1);
    });
  });

  describe('Utility Functions', function () {
    it('Should return correct record type names', async function () {
      expect(await watchHistory.getRecordTypeName(0)).to.equal("Service");
      expect(await watchHistory.getRecordTypeName(1)).to.equal("Certification");
      expect(await watchHistory.getRecordTypeName(3)).to.equal("VIP Status");
    });

    it('Should return correct VIP level names', async function () {
      expect(await watchHistory.getVIPLevelName(0)).to.equal("None");
      expect(await watchHistory.getVIPLevelName(1)).to.equal("Silver");
      expect(await watchHistory.getVIPLevelName(3)).to.equal("Platinum");
    });
  });

  describe('Authorization Management', function () {
    it('Should add authorized entity', async function () {
      await watchHistory.addAuthorizedEntity(user2.address);
      expect(await watchHistory.authorizedEntities(user2.address)).to.be.true;
    });

    it('Should remove authorized entity', async function () {
      await watchHistory.removeAuthorizedEntity(serviceCenter.address);
      expect(await watchHistory.authorizedEntities(serviceCenter.address)).to.be.false;
    });
  });
});
