//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Coinspace {
    struct Coin {
        string name;
        string symbol;
        address submitter;
    }

    Coin[] public coins;
    mapping(address => Coin[]) public coinsBySubmitter;

    event CoinSubmitted(
        string name,
        string symbol,
        address submitter
    );
    event TipSent(address from, address to, uint256 amount, string forCoin);

    function submit(string calldata _name, string calldata _symbol) external {
        Coin memory c = Coin({
            name: _name,
            symbol: _symbol,
            submitter: msg.sender
        });
        coins.push(c);
        coinsBySubmitter[msg.sender].push(c);
        emit CoinSubmitted(_name, _symbol, msg.sender);
    }

    function getCoins() public view returns (Coin[] memory) {
        return coins;
    }

    function getCoinsByAddress(address _addr) public view returns (Coin[] memory) {
        return coinsBySubmitter[_addr];
    }

    function tip(uint256 _index) external payable {
        address payable submitter = payable(coins[_index].submitter);
        string memory name = coins[_index].name;
        require(msg.sender != submitter, "tip to self");
        submitter.transfer(msg.value);
        emit TipSent(msg.sender, submitter, msg.value, name);
    }
}