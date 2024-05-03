# Breaking AES

Can you break AES and capture the flag?

> `nc aes.uctf.ir 7001`

<details>
<summary>Server source code</summary>

```py
import logging

import os
import random
import time
import base64

import asyncio
from asyncio import StreamReader, StreamWriter, TimeoutError

from Crypto.Cipher import AES

class CryptorServer:
    MAX_INPUT_LEN = 64
    IV_LEN = 8

    def __init__(self, key: str, flag: str, host: str = '0.0.0.0', port: int = 7000, timeout: float = 8) -> None:
        self.host = host
        self.port = port
        self.timeout = timeout

        self.__key = bytes.fromhex(key)
        self.__flag = flag.encode('utf-8')

    async def run(self) -> None:
        server = await asyncio.start_server(self.__client_handler, host=self.host, port=self.port)
        await server.serve_forever()

    def __encrypt(self, message: bytes) -> bytes:
        random.seed(int(time.time()) * len(message))
        nonce = random.randbytes(CryptorServer.IV_LEN)

        cipher = AES.new(self.__key, AES.MODE_CTR, nonce=nonce)
        ciphertext = cipher.encrypt(message)

        return base64.b64encode((nonce + ciphertext)) + b'\n'

    async def __client_handler(self, reader: StreamReader, writer: StreamWriter) -> None:
        peer_ip, peer_port = writer.get_extra_info('peername')
        peer_name = f'[{peer_ip}]:{peer_port}'

        logging.info(f'New session for {peer_name}')
        try:
            writer.write(b'Encrypted flag: ' + self.__encrypt(self.__flag))
            writer.write(b"Give me a message and I'll encrypt it for you: ")
            await writer.drain()

            user_input = (await asyncio.wait_for(reader.readline(), self.timeout)).strip()
            if len(user_input) < CryptorServer.MAX_INPUT_LEN:
                enc = self.__encrypt(user_input.strip())
                writer.write(enc)
                await writer.drain()
        except TimeoutError:
            logging.warning(f'{peer_name} timed-out')
            return
        except ConnectionError:
            logging.warning(f'Connection error occurred for {peer_name}')
            return
        finally:
            logging.info(f'Session finished for {peer_name}')
            writer.close()

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)

    flag = os.environ['CRYPTOR_FLAG']
    key = os.environ['CRYPTOR_KEY']

    server = CryptorServer(key, flag)
    try:
        asyncio.run(server.run())
    except KeyboardInterrupt:
        logging.info('Bye bye!')
```

</details>

## Write Up

After connecting to the given server we're greeted with a program that prints ciphertext of the flag and lets us encrypt a message of our own:

```
$ nc aes.uctf.ir 7001
Encrypted flag: 1KtpqtZ00ZF1hX8i7NFBvYelJkbm3C2wk0857/I95KWHjWsq
Give me a message and I'll encrypt it for you:
```

```
Encrypted flag: 1KtpqtZ00ZF1hX8i7NFBvYelJkbm3C2wk0857/I95KWHjWsq
Give me a message and I'll encrypt it for you: Howdy world!
1AK1jmHo8ct/sEb5czhx0QuOZaE=
```

When using AES-CTR, for each message encrypted with the same key, IV __must__ be unique. In case of an IV reuse [plaintext can be recovered](https://crypto.stackexchange.com/questions/2991/why-must-iv-key-pairs-not-be-reused-in-ctr-mode).

Looking at the source code we see that it's vulnerable to IV reuse because of the way IVs are generated:

```py3
random.seed(int(time.time()) * len(message))
nonce = random.randbytes(CryptorServer.IV_LEN)
```

The generated IV for each message is dependant on the the time of encryption and length of the message. And because `random.seed()` is called for each encryption operation, the generated IV will be the same for messages with _the same length_ encrypted at _the same unix epoch_. 

First we have to determine the length of the flag. Looking at the source code we see that the length of IV is set to __8__ and is prepended to the ciphertext, so `len(flag) = len(encrypted flag) - 8`.

> Ciphertext and plaintext have the same length in AES because there's no padding in AES-CTR

Calculating flag length with simple shell commands:

```
$ IV_LEN=8
$ cipher_len=$(base64 -d <<<'3rjF4fk79K8l2anFehO3j7QQnpDUqwX6/dNZPxKTvPmlmkvN' | wc -c)
$ echo $(( cipher_len - IV_LEN ))
28
```

Now we can get a ciphertext with the same IV if we ask the server to encrypt a message of length 28:

```
$ echo '0123456789012345678901234567' | nc aes.uctf.ir 7001
Encrypted flag: 8h4tDvRHMlGg/QB6hViwMdO+wVryLPU5hU7HY2/RtnvnHdbx
Give me a message and I'll encrypt it for you: 8h4tDvRHMlHlr0Yvygm3YrT+wR6fdbQ5hCadKGzU7xfnG9W7
```

> Plaintext is directly piped to netcat to avoid any delays between encryptions and end up with the same IV.

As we can see, first few characters of the returned ciphers (the IVs) are the same. Now we can decrypt the flag because of the reused key and IV pair!

$C1=P1⊕F(Key,IV)$

$C2=P2⊕F(Key,IV)$

Where $F$ is block cipher encryption function, $P1$ is the flag, $C1$ is the ciphertext of the flag, $P2$ is our chosen plaintext and $C2$ is the ciphertext of our chosen plaintext. 

Now if we get rid of $F(Key,IV)$:

$C1⊕C2=P1⊕P2$

and then:

$P1=P2⊕(C1⊕C2)$

Bingo! We end up with the the flag!

[break.py](./break.py) is a simple POC Python script written for doing the above calculation on the outputs from the server.

```
$ c1='8h4tDvRHMlGg/QB6hViwMdO+wVryLPU5hU7HY2/RtnvnHdbx'
$ p2='0123456789012345678901234567'
$ c2='8h4tDvRHMlHlr0Yvygm3YrT+wR6fdbQ5hCadKGzU7xfnG9W7+0H/'
$ python break.py -p $p2 -c $c2 -t $c1
Result: uctf{d1d_y0u_ju57_br34k_435}
```

## Flag

uctf{d1d_y0u_ju57_br34k_435}

## Categories

- [ ] Web
- [ ] Reverse
- [ ] PWN
- [ ] Misc
- [ ] Forensics
- [X] Cryptography
- [ ] Steganography

## Points

| Warm up | This Challenge | Evil |
| ------- |:--------------:| ----:|
| 25      | 400            | 500  |

## Resources

- No file is shared with the contestants.
- `src/` contains server source code.
- `break.py` is a POC for breaking the encryption. (MUST NOT be shared with the contestants)