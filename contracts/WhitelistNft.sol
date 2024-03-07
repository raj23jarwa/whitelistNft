// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract WhitelistNft is ERC721, Ownable, ERC721Pausable, ERC721Enumerable {
    uint256 private _nextTokenId;
    uint256 public maxSupply = 1000;

    bytes32 public root;
    bool public publicMintOpen = false;
    bool public whiteListMintOpen = false;
    uint256 public whiteListMintEndTime;
    uint256 public totalWhitelistedMints = 0; // Counter for total whitelisted mints
    uint256 public maxWhitelistedMints = 2; // Maximum number of whitelisted mints allowed

    mapping(address => bool) public whiteList;
    mapping(address => bool) public hasMinted; // Track whether whitelisted members have already minted

    constructor(bytes32 _root) ERC721("MyToken", "MTK") Ownable(msg.sender) {
        root = _root;
    }

    function whiteListMint(address to, bytes32[] memory proof) public payable {
        require(
            isValid(proof, keccak256(abi.encodePacked(msg.sender))),
            "Not a part of whitelist"
        );
        require(
            msg.value == 0.0001 ether &&
                whiteListMintOpen &&
                whiteList[msg.sender] &&
                block.timestamp <= whiteListMintEndTime &&
                totalWhitelistedMints < maxWhitelistedMints &&
                !hasMinted[msg.sender],
            "Invalid whiteListMint"
        );

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        totalWhitelistedMints++;
        hasMinted[msg.sender] = true;
    }

    function publicMint() public payable {
        require(publicMintOpen, "Public Mint closed");
        require(
            publicMintOpen &&
                msg.value == 0.001 ether &&
                _getNextTokenId() <= 1000,
            "Invalid publicMint"
        );

        internalMint();
    }

    function _getNextTokenId() internal view returns (uint256) {
        return totalSupply() + 1;
    }

    function internalMint() internal {
        require(totalSupply() < maxSupply, "Sold out");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function setWhiteList(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            whiteList[addresses[i]] = true;
        }
    }

    function editMIntWindows(
        bool _publicMintOpen,
        bool _whiteListMintOpen,
        uint256 _whiteListMintDuration
    ) external onlyOwner {
        publicMintOpen = _publicMintOpen;
        whiteListMintOpen = _whiteListMintOpen;
        whiteListMintEndTime = block.timestamp + (_whiteListMintDuration); // Set the end time for whitelisting
    }

    function isValid(
        bytes32[] memory proof,
        bytes32 leaf
    ) public view returns (bool) {
        return MerkleProof.verify(proof, root, leaf);
    }

    function withdraw(address _addr) external onlyOwner {
        // get the balance of the contract
        uint256 balance = address(this).balance;
        payable(_addr).transfer(balance);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Pausable) returns (bool) {
        return super._update(to, tokenId, auth);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable, ERC721Pausable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}


wutt harambe usedcar wynn