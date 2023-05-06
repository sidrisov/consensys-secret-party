// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SecretPartyList is Ownable {
    string[] invitations;

    event Invited(string[] indexed invitation);

    constructor() {}

    function invite(string[] memory _invitations) external onlyOwner {
        for (uint i = 0; i < _invitations.length; i++) {
            invitations.push(_invitations[i]);
        }
        emit Invited(_invitations);
    }

    function getInvitationList() public view returns (string[] memory) {
        return invitations;
    }
}
