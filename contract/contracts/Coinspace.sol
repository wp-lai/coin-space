//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract Coinspace {
    using Counters for Counters.Counter;
    struct Coin {
        uint256 index;
        string name;
        address submitter;
        bool isSubmitted;
    }

    Counters.Counter private coinCounter;
    Coin[] private coins;
    mapping(string => Coin) private coinByName;
    mapping(address => Coin[]) private coinsBySubmitter;

    event CoinSubmitted(uint256 index, string name, address submitter);
    event TipSent(address from, address to, uint256 amount, string forCoin);

    function submit(string calldata _name) external {
        string memory name = _toLower(_name);
        require(!coinByName[name].isSubmitted, "Coin already submitted");

        Coin memory c;
        c.index = coinCounter.current();
        c.name = name;
        c.submitter = msg.sender;
        c.isSubmitted = true;

        coinByName[name] = c;
        coins.push(c);
        coinsBySubmitter[msg.sender].push(c);

        emit CoinSubmitted(c.index, name, msg.sender);

        coinCounter.increment();
    }

    function getCoins() public view returns (Coin[] memory) {
        return coins;
    }

    function getCoinByName(string memory _name)
        public
        view
        returns (Coin memory)
    {
        _name = _toLower(_name);
        return coinByName[_name];
    }

    function getCoinsByAddress(address _addr)
        public
        view
        returns (Coin[] memory)
    {
        return coinsBySubmitter[_addr];
    }

    function tipByIndex(uint256 _index) external payable {
        require(coins[_index].isSubmitted, "coin not submitted");
        address payable submitter = payable(coins[_index].submitter);
        string memory name = coins[_index].name;
        require(msg.sender != submitter, "tip to self");
        submitter.transfer(msg.value);
        emit TipSent(msg.sender, submitter, msg.value, name);
    }

    function tipByName(string memory _name) external payable {
        string memory name = _toLower(_name);
        require(coinByName[name].isSubmitted, "coin not submitted");

        address payable submitter = payable(coinByName[name].submitter);
        require(msg.sender != submitter, "tip to self");

        (bool success, ) = submitter.call{value: msg.value}("");
        require(success, "fail to send tip");

        emit TipSent(msg.sender, submitter, msg.value, name);
    }

    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint256 i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }
}
