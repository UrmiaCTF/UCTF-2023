# License, Please

https://lplz.uctf.ir

Can you get a valid license and capture the flag?

Server source code: [src](src/)

## Write Up

The website let's us generate new "demo" licenses but they're not suitable for accessing the flag.

In order to access the flag we have to need a license with the `demo` field set to `false`. However we can't simply modify the license as all feilds are signed using ECDSA.

Looking at `Signature::of` function in [signature.php](src/inc/ecc/signature.php), it's apparent that not a proper random number generator was used for the ECDSA nonce (`k`).

```php
gmp_random_seed(time());
$k = gmp_random_range(1, gmp_sub($curve->n(), 1));
```

An insecure random generator with _current unix epoch_ as seed is being used for generating the nonce. This is a very, very bad idea because nonce reuse in ECDSA is catastrophic - private key can be recovered from two different messages signed with the same nonce.

So, to forge a valid license we have to get two licenses with the same nonce. Since unix epoch is used as the seed for the random generator, all we have to do is request two licenses in quick successions and they might get signed with the same nonce.

```
$ curl 'https://lplz.uctf.ir/getlicense.php?user=demo-1'; curl 'https://lplz.uctf.ir/getlicense.php?user=demo-2'

{"user":"demo-1","expire":"+2023-08-19T15:02:24+00:00","demo":true,"signature":"fM7cSjyWRp2ftlFfDJBsgX04G6s9EX6FGCt1KxR2ugM.j7pU6lmG8LTe8pbQt2VsNZGF95hNHF2gqj7i0waCp9L"}
{"user":"demo-2","expire":"+2023-08-19T15:02:24+00:00","demo":true,"signature":"fM7cSjyWRp2ftlFfDJBsgX04G6s9EX6FGCt1KxR2ugM.vCH1qCHQ9x8bGwkPg3IQ4K8fZPAeYaDbJHUh5swwBU8"}
```

The first halves of the signatures (`r`) are the same for both licenses (`fM7cSjyWRp2ftlFfDJBsgX04G6s9EX6FGCt1KxR2ugM`).

So there's indeed nonce reuse happening. All that's left is [doing some magic with math](https://asecuritysite.com/encryption/ecd5) and recovering the private key.

POC written for forging a new valid license: [forge.php]('forge.php')

```
$ php .\forge.php --l1 '{"user":"demo-1","expire":"+2023-08-19T15:02:24+00:00","demo":true,"signature":"fM7cSjyWRp2ftlFfDJBsgX04G6s9EX6FGCt1KxR2ugM.j7pU6lmG8LTe8pbQt2VsNZGF95hNHF2gqj7i0waCp9L"}' --l2 '{"user":"demo-2","expire":"+2023-08-19T15:02:24+00:00","demo":true,"signature":"fM7cSjyWRp2ftlFfDJBsgX04G6s9EX6FGCt1KxR2ugM.vCH1qCHQ9x8bGwkPg3IQ4K8fZPAeYaDbJHUh5swwBU8"}'

Recovered private key: ZTWAcGVGl2IFjnFAdH1CeYqSHqUGuoLdReJuBdcbPKo
Forged licesne: {"user":"pwned","expire":"+2024-08-19T15:08:26+00:00","demo":false,"signature":"ZI7cCiErOIkEGxqqrOuzJMoNxwTaxC5QfbvN0j8wgd6.HKg6KlcLqEF23ej5QENmda1FtPP1zCeUaU0tGvOnC5T"}
```

Aight, let's try the forged license:

![Valid license result](<img/valid_license_result.png>)

Sure enough, there's the flag!

## Flag

uctf{m4yu5h11_15_my_w41fu}

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
| 25      | 400-500        | 500  |

## Resources

Server [source files](src/) should be shared with the contestants.