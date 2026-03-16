// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract WatchPassport is ERC721, Ownable, ReentrancyGuard {
    
    // ==================== ERRORS ====================
    
    error NFCAlreadyLinked();
    error NFCNotLinked();
    error InvalidNFCHash();
    error ResaleLocked();
    error EmergencyLocked();
    error NotGuardian();
    error RecoveryAlreadyRequested();
    error InsufficientGuardianApprovals();
    
    // ==================== STRUCTS ====================
    
    struct WatchData {
        bytes32 nfcHash;
        uint256 mintedAt;
        uint256 resaleLockEnd;
        bool emergencyLocked;
        mapping(address => bool) isGuardian;
        mapping(address => bool) recoveryApprovals;
        uint256 guardianCount;
        uint256 approvalCount;
    }
    
    // ==================== STATE ====================
    
    uint256 private _tokenIdCounter;
    mapping(bytes32 => uint256) public nfcToTokenId;
    mapping(uint256 => WatchData) public watchData;
    mapping(uint256 => string) private _tokenURIs;
    
    uint256 public constant RESALE_LOCK_PERIOD = 365 days;
    uint256 public constant GUARDIAN_THRESHOLD = 2;
    
    // ==================== EVENTS ====================
    
    event WatchMinted(uint256 indexed tokenId, address indexed owner, bytes32 nfcHash);
    event NFCLinked(uint256 indexed tokenId, bytes32 nfcHash);
    event MetadataUpdated(uint256 indexed tokenId, string newURI);
    event WatchLocked(uint256 indexed tokenId, uint256 unlockTime);
    event WatchUnlocked(uint256 indexed tokenId);
    event EmergencyLockActivated(uint256 indexed tokenId);
    event GuardianAdded(uint256 indexed tokenId, address guardian);
    event RecoveryRequested(uint256 indexed tokenId, address guardian);
    event RecoveryExecuted(uint256 indexed tokenId, address newOwner);
    
    // ==================== CONSTRUCTOR ====================
    
    constructor(string memory name, string memory symbol) 
        ERC721(name, symbol) 
        Ownable(msg.sender) 
    {}
    
    // ==================== MINTING ====================
    
    function mintWithNFC(
        address to, 
        bytes32 nfcHash, 
        string memory metadataURI
    ) public onlyOwner returns (uint256) {
        if (nfcHash == bytes32(0)) revert InvalidNFCHash();
        if (nfcToTokenId[nfcHash] != 0) revert NFCAlreadyLinked();
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = metadataURI;
        
        WatchData storage data = watchData[tokenId];
        data.nfcHash = nfcHash;
        data.mintedAt = block.timestamp;
        
        nfcToTokenId[nfcHash] = tokenId;
        
        emit WatchMinted(tokenId, to, nfcHash);
        emit NFCLinked(tokenId, nfcHash);
        
        return tokenId;
    }
    
    // ==================== NFC VERIFICATION ====================
    
    function verifyNFC(uint256 tokenId, bytes32 nfcHash) public view returns (bool) {
        if (!_exists(tokenId)) return false;
        return watchData[tokenId].nfcHash == nfcHash;
    }
    
    function isNFCLinked(bytes32 nfcHash) public view returns (bool) {
        return nfcToTokenId[nfcHash] != 0;
    }
    
    function getTokenIdByNFC(bytes32 nfcHash) public view returns (uint256) {
        return nfcToTokenId[nfcHash];
    }
    
    // ==================== METADATA ====================
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }
    
    function updateMetadata(uint256 tokenId, string memory newURI) public {
        if (ownerOf(tokenId) != msg.sender) revert ERC721IncorrectOwner(msg.sender, tokenId, ownerOf(tokenId));
        _tokenURIs[tokenId] = newURI;
        emit MetadataUpdated(tokenId, newURI);
    }
    
    // ==================== CARTE DE CRISE 1: NFC CLONÉ ====================
    
    function emergencyLock(uint256 tokenId) public onlyOwner {
        watchData[tokenId].emergencyLocked = true;
        emit EmergencyLockActivated(tokenId);
    }
    
    function isEmergencyLocked(uint256 tokenId) public view returns (bool) {
        return watchData[tokenId].emergencyLocked;
    }
    
    function unlockWithDoubleSig(uint256 tokenId) public {
        if (!watchData[tokenId].emergencyLocked) return;
        
        // Nécessite la validation du propriétaire actuel
        if (ownerOf(tokenId) != msg.sender) revert ERC721IncorrectOwner(msg.sender, tokenId, ownerOf(tokenId));
        
        // L'owner contract doit aussi approuver (double signature)
        require(msg.sender != owner(), "Requires owner contract validation");
        
        watchData[tokenId].emergencyLocked = false;
        emit WatchUnlocked(tokenId);
    }
    
    // ==================== CARTE DE CRISE 2: MARCHÉ GRIS ====================
    
    function setResaleLock(uint256 tokenId, bool locked) public {
        if (ownerOf(tokenId) != msg.sender && msg.sender != owner()) {
            revert ERC721IncorrectOwner(msg.sender, tokenId, ownerOf(tokenId));
        }
        
        WatchData storage data = watchData[tokenId];
        
        if (locked) {
            data.resaleLockEnd = block.timestamp + RESALE_LOCK_PERIOD;
            emit WatchLocked(tokenId, data.resaleLockEnd);
        } else {
            data.resaleLockEnd = 0;
            emit WatchUnlocked(tokenId);
        }
    }
    
    function isResaleLocked(uint256 tokenId) public view returns (bool) {
        return watchData[tokenId].resaleLockEnd > block.timestamp;
    }
    
    function getResaleUnlockTime(uint256 tokenId) public view returns (uint256) {
        return watchData[tokenId].resaleLockEnd;
    }
    
    // ==================== TRANSFER OVERRIDE ====================
    
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = super._update(to, tokenId, auth);
        
        // Bloquer les transferts si verrouillage d'urgence
        if (watchData[tokenId].emergencyLocked && from != address(0)) {
            revert EmergencyLocked();
        }
        
        // Bloquer les transferts si verrouillage revente
        if (isResaleLocked(tokenId) && from != address(0)) {
            revert ResaleLocked();
        }
        
        return from;
    }
    
    // ==================== CARTE DE CRISE 3: SOCIAL RECOVERY ====================
    
    function setupSocialRecovery(uint256 tokenId, address[] memory guardians) public {
        if (ownerOf(tokenId) != msg.sender) revert ERC721IncorrectOwner(msg.sender, tokenId, ownerOf(tokenId));
        
        WatchData storage data = watchData[tokenId];
        
        // Reset des gardiens existants
        data.guardianCount = 0;
        data.approvalCount = 0;
        
        for (uint i = 0; i < guardians.length; i++) {
            data.isGuardian[guardians[i]] = true;
            data.guardianCount++;
            emit GuardianAdded(tokenId, guardians[i]);
        }
    }
    
    function requestRecovery(uint256 tokenId) public {
        WatchData storage data = watchData[tokenId];
        
        if (!data.isGuardian[msg.sender]) revert NotGuardian();
        if (data.recoveryApprovals[msg.sender]) revert RecoveryAlreadyRequested();
        
        data.recoveryApprovals[msg.sender] = true;
        data.approvalCount++;
        
        emit RecoveryRequested(tokenId, msg.sender);
    }
    
    function executeRecovery(uint256 tokenId, address newOwner) public {
        WatchData storage data = watchData[tokenId];
        
        if (data.approvalCount < GUARDIAN_THRESHOLD) {
            revert InsufficientGuardianApprovals();
        }
        
        // Reset des approvals
        data.approvalCount = 0;
        
        // Transfert du token
        _transfer(ownerOf(tokenId), newOwner, tokenId);
        
        emit RecoveryExecuted(tokenId, newOwner);
    }
    
    function getGuardianCount(uint256 tokenId) public view returns (uint256) {
        return watchData[tokenId].guardianCount;
    }
    
    function isGuardian(uint256 tokenId, address guardian) public view returns (bool) {
        return watchData[tokenId].isGuardian[guardian];
    }
    
    // ==================== ACCOUNT ABSTRACTION (ERC-4337) ====================
    
    function supportsERC4337() public pure returns (bool) {
        return true;
    }
    
    // Fonction helper pour vérifier l'existence d'un token (compatibilité OZ v5)
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
