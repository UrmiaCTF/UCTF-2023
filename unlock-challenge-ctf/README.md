# Challenge Title
Welcome to the Unlock challenge, an intriguing journey into the realm of Solidity smart contracts where the quest for knowledge leads to a concealed flag. As you embark on this cryptic adventure, you'll navigate through the intricacies of the Unlock contract, carefully unraveling its secrets to reveal the hidden key to success.

Your mission is clear: decipher the enigmatic flag, ingeniously hidden within the depths of the contract's data. The flag is a clever construction, waiting to be unveiled through the concatenation of three specific elements: `data[0]`, `FLAG`, and `data[1]`. Cracking this code showcases your mastery of the challenge, serving as a testament to your cryptographic prowess.

```c
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Unlock {
    address public OWNER;
    bool public isDeployed = true;
    uint16 public u16 = 18;
    uint256 private immutable MONTH;
    bytes32 private FLAG;
    uint256 public constant YEAR = 2023;
    bytes32[3] public data;


    constructor(bytes32 _flag, bytes32 _data, bytes32 _data2) {
        OWNER = msg.sender;
        MONTH = 8;
        FLAG = _flag;
        data[0] = _data;
        data[1] = _data2;
    }
}
```

Contract Address: 0xaF3bC055023Cb9A869083F5A6C126Df1c605Ad7a

https://mumbai.polygonscan.com/address/0xaf3bc055023cb9a869083f5a6c126df1c605ad7a

Note: To participate in this challenge, please ensure you possess Mumbai Testnet Matic tokens.

https://mumbaifaucet.com/

# Write Up

The contract consisted of the following crucial elements:
FLAG (Slot 1): A private bytes32 variable, hidden away in slot 1, held a pivotal role in the challenge.

Data Array (Slot 2, 3, 4): A bytes32[3] public array, spanning slots 2, 3, and 4, was a vital component in deciphering the flag.

Participants were presented with the challenge of extracting data from specific storage slots within the contract. To accomplish this, the usage of either web3.js or ethers.js was suggested. Both libraries facilitate interactions with Ethereum smart contracts, allowing for seamless retrieval of storage data.

Here's a snippet demonstrating the method to reach slot data using web3.js:

```js
const contractAddress = 'CONTRACT_ADDRESS';
const slot2Data = await web3.eth.getStorageAt(contractAddress, 2);
const slot1Data = await web3.eth.getStorageAt(contractAddress, 1);
const slot3Data = await web3.eth.getStorageAt(contractAddress, 3);

const flag = slot2Data + slot1Data + slot3Data;
```

# Flag

uctf{urmia4_lake_salt_g3m}

# Categories

- [X] Web
- [ ] Reverse
- [ ] PWN
- [X] Misc
- [ ] Forensics
- [ ] Cryptography
- [ ] Steganography

# Points

| Warm up | This Challenge | Evil |
| ------- |:--------------:| ----:|
| 25      | 150            | 500  |
