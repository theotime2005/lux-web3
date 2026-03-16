const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log('Deploying with account:', deployer.address);
  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());

  const WatchPassport = await ethers.getContractFactory('WatchPassport');
  const watchPassport = await WatchPassport.deploy('Watch Whispers', 'WWP');
  
  await watchPassport.waitForDeployment();
  
  const address = await watchPassport.getAddress();
  console.log('WatchPassport deployed to:', address);
  console.log('Transaction hash:', watchPassport.deploymentTransaction().hash);
  
  // Mint a test watch for demo
  const testNFC = ethers.keccak256(ethers.toUtf8Bytes('DEMO_NFC_001'));
  const tx = await watchPassport.mintWithNFC(
    deployer.address,
    testNFC,
    'ipfs://QmTestWatch001'
  );
  await tx.wait();
  console.log('Test watch minted with tokenId: 1');
  
  console.log('\n=== Déploiement terminé ===');
  console.log('Contrat:', address);
  console.log('Réseau: Hardhat Network (local)');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
