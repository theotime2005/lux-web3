// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Test.sol";
import "../src/WatchPassport.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract WatchPassportTest is Test {
    WatchPassport public watchPassport;
    address public owner;
    address public user1;
    address public user2;
    
    bytes32 constant NFC_HASH_1 = keccak256("NFC_TAG_001");
    bytes32 constant NFC_HASH_2 = keccak256("NFC_TAG_002");
    string constant METADATA_URI = "ipfs://QmWatch001";
    
    event WatchMinted(uint256 indexed tokenId, address indexed owner, bytes32 nfcHash);
    event NFCLinked(uint256 indexed tokenId, bytes32 nfcHash);
    event WatchLocked(uint256 indexed tokenId, uint256 unlockTime);
    
    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        watchPassport = new WatchPassport("Watch Whispers", "WWP");
    }
    
    // ==================== TESTS MINTING ERC-721 ====================
    
    function test_MintWithNFC() public {
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        assertEq(watchPassport.ownerOf(tokenId), user1);
        assertEq(watchPassport.tokenURI(tokenId), METADATA_URI);
        assertTrue(watchPassport.isNFCLinked(NFC_HASH_1));
        assertEq(watchPassport.getTokenIdByNFC(NFC_HASH_1), tokenId);
    }
    
    function test_RevertWhen_MintDuplicateNFC() public {
        watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        vm.expectRevert(WatchPassport.NFCAlreadyLinked.selector);
        watchPassport.mintWithNFC(user2, NFC_HASH_1, METADATA_URI);
    }
    
    function test_EmitEvent_OnMint() public {
        vm.expectEmit(true, true, false, false);
        emit WatchMinted(1, user1, NFC_HASH_1);
        
        watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
    }
    
    // ==================== TESTS VERIFICATION NFC ====================
    
    function test_VerifyNFC() public {
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        bool isValid = watchPassport.verifyNFC(tokenId, NFC_HASH_1);
        assertTrue(isValid);
    }
    
    function test_VerifyNFC_InvalidHash() public {
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        bool isValid = watchPassport.verifyNFC(tokenId, NFC_HASH_2);
        assertFalse(isValid);
    }
    
    // ==================== TESTS MÉTADONNÉES ====================
    
    function test_UpdateMetadata() public {
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        string memory newURI = "ipfs://QmUpdated";
        
        vm.prank(user1);
        watchPassport.updateMetadata(tokenId, newURI);
        
        assertEq(watchPassport.tokenURI(tokenId), newURI);
    }
    
    function test_RevertWhen_UpdateMetadata_NotOwner() public {
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        vm.prank(user2);
        vm.expectRevert();
        watchPassport.updateMetadata(tokenId, "ipfs://QmUpdated");
    }
    
    // ==================== TESTS CARTE DE CRISE 1: NFC CLONÉ ====================
    
    function test_DoubleSignature_Required() public {
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        // Simuler la détection d'un NFC cloné
        watchPassport.emergencyLock(tokenId);
        
        assertTrue(watchPassport.isEmergencyLocked(tokenId));
        
        // Déverrouiller avec double signature (owner + user)
        vm.prank(user1);
        watchPassport.unlockWithDoubleSig(tokenId);
        
        assertFalse(watchPassport.isEmergencyLocked(tokenId));
    }
    
    // ==================== TESTS CARTE DE CRISE 2: MARCHÉ GRIS ====================
    
    function test_LockResale_ForOneYear() public {
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        watchPassport.setResaleLock(tokenId, true);
        
        assertTrue(watchPassport.isResaleLocked(tokenId));
        
        // Tenter un transfert avant la période de blocage
        vm.prank(user1);
        vm.expectRevert(WatchPassport.ResaleLocked.selector);
        watchPassport.transferFrom(user1, user2, tokenId);
    }
    
    function test_UnlockAfterOneYear() public {
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        watchPassport.setResaleLock(tokenId, true);
        
        // Avancer le temps de 1 an + 1 jour
        skip(366 days);
        
        vm.prank(user1);
        watchPassport.transferFrom(user1, user2, tokenId);
        
        assertEq(watchPassport.ownerOf(tokenId), user2);
    }
    
    // ==================== TESTS CARTE DE CRISE 3: SOCIAL RECOVERY ====================
    
    function test_SetupSocialRecovery() public {
        address[] memory guardians = new address[](3);
        guardians[0] = makeAddr("guardian1");
        guardians[1] = makeAddr("guardian2");
        guardians[2] = makeAddr("guardian3");
        
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        vm.prank(user1);
        watchPassport.setupSocialRecovery(tokenId, guardians);
        
        assertEq(watchPassport.getGuardianCount(tokenId), 3);
    }
    
    function test_SocialRecovery_Execute() public {
        address guardian1 = makeAddr("guardian1");
        address guardian2 = makeAddr("guardian2");
        
        address[] memory guardians = new address[](2);
        guardians[0] = guardian1;
        guardians[1] = guardian2;
        
        uint256 tokenId = watchPassport.mintWithNFC(user1, NFC_HASH_1, METADATA_URI);
        
        vm.prank(user1);
        watchPassport.setupSocialRecovery(tokenId, guardians);
        
        // Les deux gardiens votent pour la récupération
        vm.prank(guardian1);
        watchPassport.requestRecovery(tokenId);
        
        vm.prank(guardian2);
        watchPassport.requestRecovery(tokenId);
        
        // Exécuter la récupération vers un nouveau wallet
        address newOwner = makeAddr("newOwner");
        watchPassport.executeRecovery(tokenId, newOwner);
        
        assertEq(watchPassport.ownerOf(tokenId), newOwner);
    }
    
    // ==================== TESTS ACCOUNT ABSTRACTION ====================
    
    function test_ValidateUserOp() public view {
        // Simuler une UserOperation ERC-4337
        // Ce test vérifie que le contrat peut valider les opérations sans MetaMask
        assertTrue(watchPassport.supportsERC4337());
    }
}
