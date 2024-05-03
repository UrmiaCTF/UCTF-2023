# The Void
Your consciousness is lost in [the void](http://thevoidfx5o5da24s27ktnxlpgjj3nl7vnrqcdtkop36jptivs7y5bad.onion/).

Will you be able to escape and reach the correct destination?

# Write Up
All we have to do is send a GET request to `thevoidfx5o5da24s27ktnxlpgjj3nl7vnrqcdtkop36jptivs7y5bad.onion` but with the host header set to `www.google.com`.

```
$ curl -x 'socks5h://127.0.0.1:9050' -H 'Host: www.google.com' 'http://thevoidfx5o5da24s27ktnxlpgjj3nl7vnrqcdtkop36jptivs7y5bad.onion' 
uctf{pr4y1n6_47_57_m4ry}
```

# Flag
uctf{pr4y1n6_47_57_m4ry}

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
| 25      | 200-250        | 500  |

# Resources
`front` folder contains website data ready to be Dockerized.