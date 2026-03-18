// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract WatchHistory is ERC721, Ownable, ReentrancyGuard {
    
    // ==================== ERRORS ====================
    
    error InvalidRecordType();
    error RecordAlreadyExists();
    error UnauthorizedAccess();
    error InvalidSignature();
    error RecordNotFound();
    
    // ==================== STRUCTS ====================
    
    enum RecordType {
        SERVICE,        // 0: Entretien
        CERTIFICATION,  // 1: Certification
        OWNERSHIP,      // 2: Changement de propriétaire
        VIP_STATUS,     // 3: Statut VIP
        WARRANTY,       // 4: Garantie
        RESTORATION     // 5: Restauration
    }
    
    struct HistoryRecord {
        uint256 recordId;
        uint256 watchTokenId; // Lié à la montre ERC-721
        RecordType recordType;
        string metadataURI;
        uint256 timestamp;
        address authorizedBy;
        bytes32 documentHash; // Hash du document physique
        bool isValid;
    }
    
    struct VIPStatus {
        uint256 watchTokenId;
        uint256 level; // 0: None, 1: Silver, 2: Gold, 3: Platinum
        uint256 since;
        uint256 expiresAt;
        string benefitsURI;
        bool isActive;
    }
    
    // ==================== STATE ====================
    
    uint256 private _currentRecordId;
    
    mapping(uint256 => HistoryRecord) public records;
    mapping(uint256 => uint256[]) public watchRecords; // watchTokenId => recordIds[]
    mapping(uint256 => VIPStatus) public vipStatuses;
    mapping(uint256 => mapping(RecordType => uint256)) public recordCounts; // watchTokenId => recordType => count
    
    // Addresses autorisées (service centers, certifiers)
    mapping(address => bool) public authorizedEntities;
    
    // ==================== EVENTS ====================
    
    event RecordCreated(
        uint256 indexed recordId,
        uint256 indexed watchTokenId,
        RecordType recordType,
        string metadataURI,
        address indexed authorizedBy
    );
    
    event VIPStatusChanged(
        uint256 indexed watchTokenId,
        uint256 oldLevel,
        uint256 newLevel,
        uint256 expiresAt
    );
    
    event RecordRevoked(uint256 indexed recordId, address indexed revokedBy);
    
    // ==================== CONSTRUCTOR ====================
    
    constructor() ERC721("Watch History", "WATCHHIST") Ownable(msg.sender) {
        _currentRecordId = 1;
        
        // Autoriser le owner par défaut
        authorizedEntities[owner()] = true;
    }
    
    // ==================== ERC-5192 OVERRIDES ====================
    
    // Les tokens sont non-transférables (soulbound)
    function transferFrom(address from, address to, uint256 tokenId) public pure override {
        revert("Soulbound: transfer not allowed");
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public pure override {
        revert("Soulbound: transfer not allowed");
    }
    
    function approve(address to, uint256 tokenId) public pure override {
        revert("Soulbound: approval not allowed");
    }
    
    function setApprovalForAll(address operator, bool approved) public pure override {
        revert("Soulbound: approval not allowed");
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
    function addAuthorizedEntity(address entity) public onlyOwner {
        authorizedEntities[entity] = true;
    }
    
    function removeAuthorizedEntity(address entity) public onlyOwner {
        authorizedEntities[entity] = false;
    }
    
    // ==================== RECORD MANAGEMENT ====================
    
    function createHistoryRecord(
        uint256 watchTokenId,
        RecordType recordType,
        string memory metadataURI,
        bytes32 documentHash,
        bytes memory signature
    ) public nonReentrant returns (uint256) {
        if (!authorizedEntities[msg.sender]) revert UnauthorizedAccess();
        
        // Vérifier la signature du propriétaire de la montre
        bytes32 messageHash = keccak256(abi.encodePacked(
            "CREATE_RECORD", 
            watchTokenId, 
            uint256(recordType), 
            documentHash, 
            msg.sender
        ));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
        
        // Le propriétaire doit signer (simulé - en pratique viendrait de la watch)
        require(recoveredSigner != address(0), "Invalid signature");
        
        uint256 recordId = _currentRecordId;
        
        records[recordId] = HistoryRecord({
            recordId: recordId,
            watchTokenId: watchTokenId,
            recordType: recordType,
            metadataURI: metadataURI,
            timestamp: block.timestamp,
            authorizedBy: msg.sender,
            documentHash: documentHash,
            isValid: true
        });
        
        watchRecords[watchTokenId].push(recordId);
        recordCounts[watchTokenId][recordType]++;
        
        // Mint le soulbound token au contract owner
        _safeMint(owner(), recordId);
        
        emit RecordCreated(recordId, watchTokenId, recordType, metadataURI, msg.sender);
        
        _currentRecordId++;
        return recordId;
    }
    
    function revokeRecord(uint256 recordId, bytes32 reason) public onlyOwner {
        HistoryRecord storage record = records[recordId];
        if (record.recordId == 0) revert RecordNotFound();
        
        record.isValid = false;
        
        emit RecordRevoked(recordId, msg.sender);
    }
    
    // ==================== VIP MANAGEMENT ====================
    
    function setVIPStatus(
        uint256 watchTokenId,
        uint256 level,
        uint256 duration,
        string memory benefitsURI,
        bytes memory signature
    ) public {
        if (!authorizedEntities[msg.sender]) revert UnauthorizedAccess();
        
        // Vérifier la signature du propriétaire
        bytes32 messageHash = keccak256(abi.encodePacked(
            "SET_VIP", 
            watchTokenId, 
            level, 
            duration, 
            msg.sender
        ));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
        
        require(recoveredSigner != address(0), "Invalid signature");
        
        uint256 oldLevel = vipStatuses[watchTokenId].level;
        uint256 expiresAt = duration == 0 ? 0 : block.timestamp + duration;
        
        vipStatuses[watchTokenId] = VIPStatus({
            watchTokenId: watchTokenId,
            level: level,
            since: block.timestamp,
            expiresAt: expiresAt,
            benefitsURI: benefitsURI,
            isActive: level > 0 && (expiresAt == 0 || expiresAt > block.timestamp)
        });
        
        // Créer un enregistrement VIP
        createHistoryRecord(
            watchTokenId,
            RecordType.VIP_STATUS,
            benefitsURI,
            keccak256(abi.encodePacked(level, expiresAt)),
            signature
        );
        
        emit VIPStatusChanged(watchTokenId, oldLevel, level, expiresAt);
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    function getRecordInfo(uint256 recordId) public view returns (
        uint256 watchTokenId,
        RecordType recordType,
        string memory metadataURI,
        uint256 timestamp,
        address authorizedBy,
        bytes32 documentHash,
        bool isValid
    ) {
        HistoryRecord storage record = records[recordId];
        return (
            record.watchTokenId,
            record.recordType,
            record.metadataURI,
            record.timestamp,
            record.authorizedBy,
            record.documentHash,
            record.isValid
        );
    }
    
    function getWatchRecords(uint256 watchTokenId) public view returns (uint256[] memory) {
        return watchRecords[watchTokenId];
    }
    
    function getVIPStatus(uint256 watchTokenId) public view returns (
        uint256 level,
        uint256 since,
        uint256 expiresAt,
        string memory benefitsURI,
        bool isActive
    ) {
        VIPStatus storage status = vipStatuses[watchTokenId];
        return (
            status.level,
            status.since,
            status.expiresAt,
            status.benefitsURI,
            status.isActive
        );
    }
    
    function getRecordCount(uint256 watchTokenId, RecordType recordType) public view returns (uint256) {
        return recordCounts[watchTokenId][recordType];
    }
    
    function isValidRecord(uint256 recordId) public view returns (bool) {
        return records[recordId].isValid;
    }
    
    function isVIPActive(uint256 watchTokenId) public view returns (bool) {
        VIPStatus storage status = vipStatuses[watchTokenId];
        return status.isActive && 
               (status.expiresAt == 0 || status.expiresAt > block.timestamp);
    }
    
    // ==================== UTILITIES ====================
    
    function getRecordTypeName(RecordType recordType) public pure returns (string memory) {
        if (recordType == RecordType.SERVICE) return "Service";
        if (recordType == RecordType.CERTIFICATION) return "Certification";
        if (recordType == RecordType.OWNERSHIP) return "Ownership";
        if (recordType == RecordType.VIP_STATUS) return "VIP Status";
        if (recordType == RecordType.WARRANTY) return "Warranty";
        if (recordType == RecordType.RESTORATION) return "Restoration";
        return "Unknown";
    }
    
    function getVIPLevelName(uint256 level) public pure returns (string memory) {
        if (level == 0) return "None";
        if (level == 1) return "Silver";
        if (level == 2) return "Gold";
        if (level == 3) return "Platinum";
        return "Unknown";
    }
}
