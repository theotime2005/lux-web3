// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract WatchParts is ERC1155, Ownable, ReentrancyGuard {
    
    // ==================== ERRORS ====================
    
    error InvalidPartType();
    error InsufficientBatch();
    error BatchAlreadyExists();
    error PartNotAuthentic();
    error InvalidSignature();
    
    // ==================== STRUCTS ====================
    
    struct PartBatch {
        uint256 partType;
        uint256 totalSupply;
        uint256 minted;
        string metadataURI;
        uint256 createdAt;
        bool isActive;
    }
    
    struct Part {
        uint256 batchId;
        uint256 serialNumber;
        uint256 watchTokenId; // Lié à la montre ERC-721
        bytes32 nfcHash;
        uint256 mintedAt;
        bool isAuthentic;
    }
    
    // ==================== STATE ====================
    
    uint256 private _currentBatchId;
    uint256 private _currentPartId;
    
    // Types de pièces (0: Bracelet, 1: Cadran, 2: Couronne, 3: Verre, 4: Boitier)
    mapping(uint256 => string) public partTypes;
    mapping(uint256 => PartBatch) public batches;
    mapping(uint256 => Part) public parts;
    mapping(uint256 => uint256[]) public watchParts; // watchTokenId => partIds[]
    mapping(bytes32 => uint256) public nfcToPartId;
    
    // ==================== EVENTS ====================
    
    event BatchCreated(uint256 indexed batchId, uint256 partType, uint256 totalSupply, string metadataURI);
    event PartMinted(uint256 indexed partId, uint256 indexed batchId, uint256 indexed watchTokenId, bytes32 nfcHash);
    event PartVerified(uint256 indexed partId, bool isAuthentic);
    event BatchStatusChanged(uint256 indexed batchId, bool isActive);
    
    // ==================== CONSTRUCTOR ====================
    
    constructor() ERC1155("") Ownable(msg.sender) {
        // Initialiser les types de pièces
        partTypes[0] = "Bracelet";
        partTypes[1] = "Cadran";
        partTypes[2] = "Couronne";
        partTypes[3] = "Verre";
        partTypes[4] = "Boitier";
        
        _currentBatchId = 1;
        _currentPartId = 1;
    }
    
    // ==================== ADMIN FUNCTIONS ====================
    
    function createBatch(
        uint256 partType,
        uint256 totalSupply,
        string memory metadataURI
    ) public onlyOwner returns (uint256) {
        if (partType > 4) revert InvalidPartType();
        if (totalSupply < 10) revert InsufficientBatch();
        
        uint256 batchId = _currentBatchId;
        
        batches[batchId] = PartBatch({
            partType: partType,
            totalSupply: totalSupply,
            minted: 0,
            metadataURI: metadataURI,
            createdAt: block.timestamp,
            isActive: true
        });
        
        emit BatchCreated(batchId, partType, totalSupply, metadataURI);
        
        _currentBatchId++;
        return batchId;
    }
    
    function setBatchStatus(uint256 batchId, bool isActive) public onlyOwner {
        batches[batchId].isActive = isActive;
        emit BatchStatusChanged(batchId, isActive);
    }
    
    // ==================== MINTING FUNCTIONS ====================
    
    function mintPart(
        uint256 batchId,
        uint256 watchTokenId,
        bytes32 nfcHash,
        bytes memory signature
    ) public nonReentrant {
        PartBatch storage batch = batches[batchId];
        
        if (!batch.isActive) revert InvalidPartType();
        if (batch.minted >= batch.totalSupply) revert InvalidPartType();
        
        // Vérifier la signature de l'authorité (partenaire horloger)
        bytes32 messageHash = keccak256(abi.encodePacked("MINT_PART", batchId, watchTokenId, nfcHash, msg.sender));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
        require(recoveredSigner == owner(), "Invalid signature");
        
        uint256 partId = _currentPartId;
        
        parts[partId] = Part({
            batchId: batchId,
            serialNumber: batch.minted + 1,
            watchTokenId: watchTokenId,
            nfcHash: nfcHash,
            mintedAt: block.timestamp,
            isAuthentic: true
        });
        
        watchParts[watchTokenId].push(partId);
        nfcToPartId[nfcHash] = partId;
        
        batch.minted++;
        
        _mint(msg.sender, batchId, 1, "");
        emit PartMinted(partId, batchId, watchTokenId, nfcHash);
        
        _currentPartId++;
    }
    
    function batchMintParts(
        uint256[] memory batchIds,
        uint256[] memory watchTokenIds,
        bytes32[] memory nfcHashes,
        bytes[] memory signatures
    ) public {
        require(batchIds.length == watchTokenIds.length, "Array length mismatch");
        require(batchIds.length == nfcHashes.length, "Array length mismatch");
        require(batchIds.length == signatures.length, "Array length mismatch");
        
        for (uint256 i = 0; i < batchIds.length; i++) {
            mintPart(batchIds[i], watchTokenIds[i], nfcHashes[i], signatures[i]);
        }
    }
    
    // ==================== VERIFICATION FUNCTIONS ====================
    
    function verifyPart(uint256 partId, bytes32 nfcHash) public view returns (bool) {
        Part storage part = parts[partId];
        return part.nfcHash == nfcHash && part.isAuthentic;
    }
    
    function getPartByNFC(bytes32 nfcHash) public view returns (uint256) {
        return nfcToPartId[nfcHash];
    }
    
    function getWatchParts(uint256 watchTokenId) public view returns (uint256[] memory) {
        return watchParts[watchTokenId];
    }
    
    function getBatchInfo(uint256 batchId) public view returns (
        uint256 partType,
        uint256 totalSupply,
        uint256 minted,
        string memory metadataURI,
        uint256 createdAt,
        bool isActive
    ) {
        PartBatch storage batch = batches[batchId];
        return (
            batch.partType,
            batch.totalSupply,
            batch.minted,
            batch.metadataURI,
            batch.createdAt,
            batch.isActive
        );
    }
    
    function getPartInfo(uint256 partId) public view returns (
        uint256 batchId,
        uint256 serialNumber,
        uint256 watchTokenId,
        bytes32 nfcHash,
        uint256 mintedAt,
        bool isAuthentic
    ) {
        Part storage part = parts[partId];
        return (
            part.batchId,
            part.serialNumber,
            part.watchTokenId,
            part.nfcHash,
            part.mintedAt,
            part.isAuthentic
        );
    }
    
    // ==================== URI OVERRIDE ====================
    
    function uri(uint256 batchId) public view override returns (string memory) {
        return batches[batchId].metadataURI;
    }
    
    // ==================== ADMIN UTILITIES ====================
    
    function addPartType(uint256 typeId, string memory typeName) public onlyOwner {
        partTypes[typeId] = typeName;
    }
    
    function emergencyRevokePart(uint256 partId) public onlyOwner {
        parts[partId].isAuthentic = false;
        emit PartVerified(partId, false);
    }
}
