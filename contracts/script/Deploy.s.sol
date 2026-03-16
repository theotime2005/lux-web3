// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../src/WatchPassport.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        WatchPassport watchPassport = new WatchPassport("Watch Whispers", "WWP");
        
        console.log("WatchPassport deployed at:", address(watchPassport));
        
        vm.stopBroadcast();
    }
}
