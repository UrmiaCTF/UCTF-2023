import argparse
import base64
import logging

IV_LEN = 8


def xor_bytes(a, b):
    return bytes(ba ^ bb for ba, bb in zip(a, b))


def crack(known_plain: str, known_cipher: bytes, target_cipher: bytes) -> str | None:
    k_iv = known_cipher[:IV_LEN]
    t_iv = target_cipher[:IV_LEN]
    if k_iv != t_iv:
        logging.critical('Mismatched IVs')
        return None

    k = known_cipher[IV_LEN:]
    t = target_cipher[IV_LEN:]
    p = known_plain.encode('utf-8')

    x = xor_bytes(k, t)
    target_plain = xor_bytes(p, x)
    return target_plain.decode('utf-8')


if __name__ == '__main__':
    logging.basicConfig()

    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--known-plaintext', required=True)
    parser.add_argument('-c', '--known-ciphertext', required=True)
    parser.add_argument('-t', '--target-ciphertext', required=True)

    args = parser.parse_args()

    plaintext = crack(args.known_plaintext,
                      base64.b64decode(args.known_ciphertext),
                      base64.b64decode(args.target_ciphertext))
    print('Result:', plaintext)
